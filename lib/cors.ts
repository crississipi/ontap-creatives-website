// lib/cors.ts
import Cors from 'cors';
import initMiddleware from './init-middleware';

const allowedOrigin = 'https://yellowgreen-alligator-963520.hostingersite.com';

const cors = initMiddleware(
  Cors({
    origin: allowedOrigin,
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);

export default cors;
