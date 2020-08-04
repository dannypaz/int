import express, { Request, Response, NextFunction } from 'express'
import { body, check, validationResult } from 'express-validator'
import transactions from './transactions'
import accounts, { reset } from './accounts'
import status from './status'

const app = express()

function runValidations (req: Request, res: Response, next: NextFunction): Response | void {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  return next()
}

app.get('/status', status)
app.post('/transactions', [
  body().isArray().withMessage('request body must be an array of transactions')
], runValidations, transactions)
app.get('/accounts', [
  check('accountId').exists().withMessage('accountId does not exist on url')
], runValidations, accounts)
app.post('/reset', reset)

export default app
