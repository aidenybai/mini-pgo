import { transformAsync } from '@babel/core';
import * as t from '@babel/types';
import express from 'express';

// MARK: server

const createServer = () => {
  const server = express();

  server.use(express.json());

  server.post('/data', (req, res) => {
    const { data, fileMap } = req.body;
  });

  server.listen(6900, () => {
    console.log('Listening on port 6900');
  });
};
// MARK: build time

const isCapitalized = (str) => str[0] === str[0].toUpperCase();

const serializeSourceLocation = (loc) => {
  return `${loc.start.line}:${loc.start.column}:${loc.end.line}:${loc.end.column}`;
};

const convertObjectPatternToExpression = (node) => {
  const properties = [];
  for (const prop of node.properties) {
    if (t.isObjectProperty(prop)) {
      properties.push(
        t.objectProperty(
          t.isIdentifier(prop.key) ? prop.key : t.stringLiteral(prop.key.name),
          prop.value
        )
      );
    }
  }
  return t.objectExpression(properties);
};

const babelPlugin = (options = {}) => {
  return {
    visitor: {
      Program(programPath) {
        programPath.traverse({
          FunctionDeclaration(path) {
            if (
              t.isIdentifier(path.node.params[0]) ||
              t.isObjectPattern(path.node.params[0])
            ) {
              path.node.body.body.unshift(
                t.expressionStatement(
                  t.callExpression(
                    t.identifier('__SECRET_INTERNALS__.capture'),
                    [
                      t.stringLiteral(options.id || ''),
                      t.stringLiteral(serializeSourceLocation(path.node.loc)),
                      t.isObjectPattern(path.node.params[0])
                        ? convertObjectPatternToExpression(path.node.params[0])
                        : path.node.params[0],
                    ]
                  )
                )
              );
            }
          },
          JSXElement(path) {
            const jsxName = path.node.openingElement.name;
            if (t.isJSXIdentifier(jsxName) && isCapitalized(jsxName.name)) {
              for (const attr of path.node.openingElement.attributes) {
                if (
                  t.isJSXAttribute(attr) &&
                  t.isJSXExpressionContainer(attr.value)
                ) {
                  attr.value.expression = t.callExpression(
                    t.identifier('__SECRET_INTERNALS__.capture'),
                    [
                      t.stringLiteral(options.id || ''),
                      t.stringLiteral(serializeSourceLocation(path.node.loc)),
                      attr.value.expression,
                    ]
                  );
                }
              }

              path.replaceWith(
                t.jsxElement(
                  t.jsxOpeningElement(
                    t.jsxIdentifier('__SECRET_INTERNALS__.Capture'),
                    [
                      t.jsxAttribute(
                        t.jsxIdentifier('id'),
                        t.jsxExpressionContainer(
                          t.stringLiteral(options.id || '')
                        )
                      ),
                      t.jsxAttribute(
                        t.jsxIdentifier('loc'),
                        t.jsxExpressionContainer(
                          t.stringLiteral(
                            serializeSourceLocation(path.node.loc)
                          )
                        )
                      ),
                    ]
                  ),
                  t.jsxClosingElement(
                    t.jsxIdentifier('__SECRET_INTERNALS__.Capture')
                  ),
                  [path.node]
                )
              );
              path.skip();
            }
          },
          CallExpression(path) {
            if (
              t.isIdentifier(path.node.callee) &&
              path.node.callee.name.startsWith('use')
            ) {
              path.replaceWith(
                t.callExpression(t.identifier('__SECRET_INTERNALS__.capture'), [
                  t.stringLiteral(serializeSourceLocation(path.node.loc)),
                  path.node,
                ])
              );
              path.skip();
            }
          },
        });
      },
    },
  };
};

export const vitePlugin = () => {
  createServer();
  const includeRE = /\.(jsx)$/;
  return {
    name: 'mini-pgo',
    enforce: 'pre',
    async transform(src, id) {
      if (id.includes('/agent/src/')) return;
      if (!includeRE.test(id)) return;
      const result = await transformAsync(src, {
        parserOpts: { plugins: ['jsx'] },
        plugins: [[babelPlugin, { id }]],
      });
      if (!result?.code) return;
      return {
        code: result.code,
        map: result.map,
      };
    },
  };
};
