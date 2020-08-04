import express, { Response } from 'express'
import { IS_PRODUCTION } from './config'

// Handle all errors that are thrown from our routes if we are in production. Express
// will notice that the function has 4 parameters and add it to the end of the execution
// chain
export default function (_err: Error, _req: Request, res: Response, _next: express.NextFunction): Response | void {
  if (IS_PRODUCTION) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
