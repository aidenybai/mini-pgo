import * as t from '@babel/types';
import { Options } from './types';
import { transformAsync, type PluginObj } from '@babel/core';
import type { SourceLocation } from '@babel/types';

const isCapitalized = (str: string) => str[0] === str[0].toUpperCase();

const serializeSourceLocation = (loc: SourceLocation | null | undefined) => {
  return loc
    ? `${loc.start.line}:${loc.start.column}:${loc.end.line}:${loc.end.column}`
    : '';
};

const convertObjectPatternToExpression = (node: t.ObjectPattern) => {
  const properties = [];
  for (const prop of node.properties) {
    if (t.isObjectProperty(prop) && t.isIdentifier(prop.key)) {
      properties.push(t.objectProperty(prop.key, prop.value));
    }
  }
  return t.objectExpression(properties);
};

const capture = '__SECRET_INTERNALS__.capture';
const Capture = '__SECRET_INTERNALS__.Capture';
const babelPlugin = (_: any, options: Options = {}): PluginObj => {
  const fileName = options.id || '';

  return {
    visitor: {
      Program(programPath) {
        programPath.traverse({
          FunctionDeclaration(path) {
            const props = path.node.params[0];
            if (t.isIdentifier(props) || t.isObjectPattern(props)) {
              path.node.body.body.unshift(
                t.expressionStatement(
                  t.callExpression(t.identifier(capture), [
                    t.stringLiteral(fileName),
                    t.stringLiteral(serializeSourceLocation(path.node.loc)),
                    t.isObjectPattern(props)
                      ? convertObjectPatternToExpression(props)
                      : props,
                  ])
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
                  t.isJSXExpressionContainer(attr.value) &&
                  !t.isJSXEmptyExpression(attr.value.expression)
                ) {
                  attr.value.expression = t.callExpression(
                    t.identifier(capture),
                    [
                      t.stringLiteral(fileName),
                      t.stringLiteral(serializeSourceLocation(path.node.loc)),
                      attr.value.expression,
                    ]
                  );
                }
              }

              // get key from path.node.openingElement

              let keyAttribute: t.JSXAttribute | undefined;

              for (const attr of path.node.openingElement.attributes) {
                if (t.isJSXAttribute(attr) && attr.name.name === 'key') {
                  keyAttribute = attr;
                  break;
                }
              }

              path.replaceWith(
                t.jsxElement(
                  t.jsxOpeningElement(
                    t.jsxIdentifier(Capture),
                    [
                      t.jsxAttribute(
                        t.jsxIdentifier('id'),
                        t.jsxExpressionContainer(t.stringLiteral(fileName))
                      ),
                      t.jsxAttribute(
                        t.jsxIdentifier('loc'),
                        t.jsxExpressionContainer(
                          t.stringLiteral(
                            serializeSourceLocation(path.node.loc)
                          )
                        )
                      ),
                      keyAttribute,
                    ].filter(Boolean) as t.JSXAttribute[]
                  ),
                  t.jsxClosingElement(t.jsxIdentifier(Capture)),
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
                t.callExpression(t.identifier(capture), [
                  t.stringLiteral(fileName),
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
  const includeRE = /\.(jsx)$/;
  return {
    name: 'mini-pgo',
    enforce: 'pre',
    async transform(code: string, id: string) {
      if (id.includes('/agent/src/')) return;
      if (!includeRE.test(id)) return;
      const result = await transformAsync(code, {
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
