import express from 'express';
import cors from 'cors';
import fs from 'fs';

export const createServer = () => {
  const server = express();

  server.use(express.json());
  server.use(cors());

  server.post('/data', (req, res) => {
    const { data, fileMap } = req.body;

    const files = new Set(Object.values(fileMap));

    for (const file of files) {
      const filePath = `./src/${file}.jsx`;
      if (!fs.existsSync(filePath)) {
        console.error(`File ${filePath} does not exist`);
        continue;
      }
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // ... Output the optimized code in this format:
      /**
       * ```js
       *
       * ```
       */
    }
  });

  server.listen(6900, () => {
    console.log('Listening on port 6900');
  });
};

createServer();
