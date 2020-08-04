export enum TransactionCommandType {
  DEPOSIT = 'DEPOSIT',
  XFER = 'XFER',
  FREEZE = 'FREEZE',
  WITHDRAW = 'WITHDRAW',
  THAW = 'THAW'
}

export interface Transaction {
  cmd: TransactionCommandType
}

export interface Deposit extends Transaction {
  accountId: string,
  amount: number
}

export interface Transfer extends Transaction {
  fromId: string,
  toId: string,
  amount: number
}

export interface Freeze extends Transaction {
  accountId: string
}

export interface Withdraw extends Transaction {
  accountId: string,
  amount: number
}

export interface Thaw extends Transaction {
  accountId: string
}

export type Transactions = Deposit | Transfer | Freeze | Withdraw | Thaw
