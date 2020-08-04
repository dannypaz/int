import { Request, Response } from 'express'
import { Deposit, Freeze, Thaw, Withdraw, Transfer } from './types'

interface AccountBalance {
  accountId: string,
  balance: number,
  frozen: boolean
}

type AccountResponse = AccountBalance[]

let balances = new Map<string, number>()
let freezes = new Set<string>()

export function processDeposit (tx: Deposit): boolean {
  if (!tx.accountId) return false
  if (tx.amount == null) return false

  const freeze = freezes.has(tx.accountId)
  if (freeze) {
    console.debug(`Cannot process deposit: ${tx.accountId} is frozen`)
    return false
  }

  // TODO: maybe some input validation here for the amount too to see if its a number
  // or not (hard to check in nodejs)
  const balance = balances.get(tx.accountId)

  // I've left this as a more verbose check on balance because it might be nice to
  // know if we are "creating" an account vs just updating the balance
  if (!balance) {
    console.debug(`Creating an account with id ${tx.accountId}`)
    balances.set(tx.accountId, parseFloat(tx.amount.toString()))
  } else {
    balances.set(tx.accountId, parseFloat(tx.amount.toString()) + balance)
  }

  return true
}

export function processFreeze (tx: Freeze): boolean {
  // The requirements for the project said that this command should always succeed
  // however it might be good to return 'false' here in the future if the command info
  // is malformed
  if (!tx.accountId) {
    console.debug('accountId is missing on freeze transaction, skipping')
    return true
  }

  const freeze = freezes.has(tx.accountId)

  if (!freeze) {
    freezes.add(tx.accountId)
  }

  return true
}

export function processThaw (tx: Thaw): boolean {
  // The requirements for the project said that this command should always succeed
  // however it might be good to return 'false' here in the future if the command info
  // is malformed
  if (!tx.accountId) {
    console.debug('accountId is missing on thaw transaction, skipping')
    return true
  }

  const freeze = freezes.has(tx.accountId)

  if (freeze) {
    freezes.delete(tx.accountId)
  }

  return true
}

export function processWithdraw (tx: Withdraw): boolean {
  if (!tx.accountId) return false
  if (tx.amount == null) return false

  const freeze = freezes.has(tx.accountId)
  if (freeze) {
    console.debug(`Cannot process withdraw: ${tx.accountId} is frozen`)
    return false
  }

  const balance = balances.get(tx.accountId)
  // Might be good to know if someone is trying to withdraw money continuously from
  // an account that does not exist
  if (!balance) {
    console.debug(`Cannot process withdraw: ${tx.accountId} does not exist`)
    return false
  }

  if (balance < tx.amount) {
    console.debug(`Cannot process withdraw: ${tx.accountId} has insufficient funds`)
    return false
  }

  balances.set(tx.accountId, balance - parseFloat(tx.amount.toString()))

  return true
}

export function processTransfer (tx: Transfer): boolean {
  if (!tx.fromId) return false
  if (!tx.toId) return false
  if (!tx.amount) return false

  if (freezes.has(tx.toId)) {
    console.debug(`Cannot process transfer: ${tx.toId} is frozen`)
    return false
  }

  if (freezes.has(tx.fromId)) {
    console.debug(`Cannot process transfer: ${tx.toId} is frozen`)
    return false
  }

  // Either the id can have an existing (maybe negative) balance, or we just assume
  // its zero
  const toBalance = balances.get(tx.toId) || 0
  const fromBalance = balances.get(tx.fromId)

  if (!fromBalance) {
    console.debug(`Cannot process transfer: ${tx.fromId} has no balance`)
    return false
  }

  if (fromBalance < parseFloat(tx.amount.toString())) {
    console.debug(`Cannot process transfer: ${tx.fromId} has insufficient balance to cover the transfer amount`)
    return false
  }

  balances.set(tx.toId, toBalance + parseFloat(tx.amount.toString()))
  balances.set(tx.fromId, fromBalance - parseFloat(tx.amount.toString()))

  return true
}

function getBalancesForAccountIds (ids: string[]): AccountResponse {
  return ids.map((id: string) => {
    const balance = balances.get(id) || 0
    const frozen = freezes.has(id)

    return {
      accountId: id,
      balance,
      frozen
    }
  })
}

export function reset (req: Request, res: Response): Response {
  balances = new Map<string, number>()
  freezes = new Set<string>()
  return res.status(200).json({})
}

export default function accounts (req: Request, res: Response): Response {
  const ids = Array.isArray(req.query.accountId)
    ? req.query.accountId
    : [req.query.accountId]

  const records = getBalancesForAccountIds(ids)
  return res.status(200).json(records as AccountResponse)
}
