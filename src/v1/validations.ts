import { Transaction } from './types'

export function validateTransactionType (value: Transaction): void {
  if (!value.cmd) {
    throw new Error('Invalid transaction command in payload')
  }
}
