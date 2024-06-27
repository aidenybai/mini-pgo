import { transformAsync } from '@babel/core';
import * as t from '@babel/types';
import express from 'express';

// MARK: server

export const createServer = () => {
  const server = express();

  server.use(express.json());

  server.post('/data', (req, res) => {
    const { data, fileMap } = req.body;
  });

  server.listen(6900, () => {
    console.log('Listening on port 6900');
  });
};
