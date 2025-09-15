// lib/init-middleware.ts
import { NextApiRequest, NextApiResponse } from 'next';

type MiddlewareFunction = (
  req: NextApiRequest,
  res: NextApiResponse,
  next: (result?: unknown) => void
) => void;

export default function initMiddleware(middleware: MiddlewareFunction) {
  return (req: NextApiRequest, res: NextApiResponse): Promise<unknown> =>
    new Promise((resolve, reject) => {
      middleware(req, res, (result) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
}
