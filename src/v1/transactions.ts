import { Request, Response } from 'express'
import {
  Transactions,
  Transaction,
  TransactionCommandType,
  Deposit,
  Freeze,
  Thaw,
  Withdraw,
  Transfer
} from './types'
import {
  processDeposit,
  processFreeze,
  processThaw,
  processWithdraw,
  processTransfer
} from './accounts'

type TransactionsResponse = Transactions[]

function process (transaction: Transaction): boolean {
  if (!Object.keys(TransactionCommandType).includes(transaction.cmd)) {
    return false
  }

  switch (transaction.cmd) {
    case TransactionCommandType.DEPOSIT:
      return processDeposit(transaction as Deposit)
    case TransactionCommandType.FREEZE:
      return processFreeze(transaction as Freeze)
    case TransactionCommandType.THAW:
      return processThaw(transaction as Thaw)
    case TransactionCommandType.WITHDRAW:
      return processWithdraw(transaction as Withdraw)
    case TransactionCommandType.XFER:
      return processTransfer(transaction as Transfer)
    default:
      return false
  }
}

function processTransactions (transactions: Transactions[]): Transactions[] {
  const unusedTransactions: Transactions[] = []

  for (const tx of transactions) {
    if (process(tx) === false) {
      unusedTransactions.push(tx)
    }
  }

  return unusedTransactions
}

export default function transactions (req: Request, res: Response): Response {
  const unusedTransactions = processTransactions(req.body)
  return res.status(200).json(unusedTransactions as TransactionsResponse)
}
