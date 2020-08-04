import { Request, Response } from 'express'

export default function (_req: Request, res: Response): Response {
  const response = {}
  return res.status(200).json(response)
}
