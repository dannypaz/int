import { expect, post, get } from '../test/test-helper'

describe('api', () => {
  for (const route of ['', '/v1']) {
    describe(route, () => {
      describe('accounts', () => {
        let id1: string
        let id2: string

        beforeEach(async () => {
          id1 = 'ACT100'
          id2 = 'ACT101'

          const request = [
            { cmd: 'DEPOSIT', accountId: 'ACT100', amount: 302.34 },
            { cmd: 'DEPOSIT', accountId: 'ACT101', amount: 100.32 },
            { cmd: 'FREEZE', accountId: 'ACT101' }
          ]
          await post(`${route}/transactions`, request)
        })

        it('should fail if we dont provide an accountId', async () => {
          const res = await get(`${route}/accounts?account=${id1}`)
          expect(res.errors).to.be.length(1)
          return expect(res.errors[0].param).to.be.eql('accountId')
        })

        it('should return account information for a single account', async () => {
          const res = await get(`${route}/accounts?accountId=${id1}`)
          const expectedRes = [
            { accountId: 'ACT100', balance: 302.34, frozen: false }
          ]
          return expect(res).to.be.eql(expectedRes)
        })

        it('should return account information for multiple accounts', async () => {
          const res = await get(`${route}/accounts?accountId=${id1}&accountId=${id2}`)
          const expectedRes = [
            { accountId: 'ACT100', balance: 302.34, frozen: false },
            { accountId: 'ACT101', balance: 100.32, frozen: true }
          ]
          return expect(res).to.be.eql(expectedRes)
        })
      })

      describe('transactions', () => {
        it('should fail if we dont provide transactions', async () => {
          const res = await post(`${route}/transactions`, {})
          expect(res.errors).to.be.length(1)
          expect(res.errors[0].location).to.be.eql('body')
          return expect(res.errors[0].param).to.be.eql('')
        })

        it('return unused transactions', async () => {
          const request = [
            { cmd: 'DEPOSIT', accountId: 'ACT300', amount: 100.00 },
            { cmd: 'XFER', fromId: 'ACT300', toId: 'ACT100', amount: 10.00 },
            { cmd: 'FREEZE', accountId: 'ACT303' },
            { cmd: 'DEPOSIT', accountId: 'ACT303', amount: 20.00 },
            { cmd: 'WITHDRAW', accountId: 'ACT100', amount: 5.00 },
            { cmd: 'THAW', accountId: 'ACT303' }
          ]
          const expectedRes = [
            { cmd: 'DEPOSIT', accountId: 'ACT303', amount: 20.00 }
          ]
          const res = await post(`${route}/transactions`, request)
          return expect(res).to.eql(expectedRes)
        })

        describe('freezing', () => {
          beforeEach(async () => {
            const request = [{ cmd: 'FREEZE', accountId: 'ACT103' }]
            await post(`${route}/transactions`, request)
          })

          it('returns a deposit transaction', async () => {
            const req = [{ cmd: 'DEPOSIT', accountId: 'ACT103', amount: 20.00 }]
            const res = await post(`${route}/transactions`, req)
            expect(res).to.be.eql(req)
          })

          it('returns a withdraw transaction', async () => {
            const req = [{ cmd: 'WITHDRAW', accountId: 'ACT103', amount: 5.00 }]
            const res = await post(`${route}/transactions`, req)
            expect(res).to.be.eql(req)
          })

          it('returns a transfer transaction', async () => {
            const req = [{ cmd: 'XFER', fromId: 'ACT300', toId: 'ACT103', amount: 10.00 }]
            const res = await post(`${route}/transactions`, req)
            expect(res).to.be.eql(req)
          })

          it('doesnt return a freeze transaction', async () => {
            const req = [{ cmd: 'FREEZE', accountId: 'ACT103' }]
            const res = await post(`${route}/transactions`, req)
            expect(res).to.be.eql([])
          })

          it('doesnt return a thaw transaction', async () => {
            const req = [{ cmd: 'THAW', accountId: 'ACT103' }]
            const res = await post(`${route}/transactions`, req)
            expect(res).to.be.eql([])
          })

          it('allows an action after it has been unfrozen', async () => {
            const req = [
              { cmd: 'THAW', accountId: 'ACT103' },
              { cmd: 'DEPOSIT', accountId: 'ACT103', amount: 20.00 }
            ]
            const res = await post(`${route}/transactions`, req)
            expect(res).to.be.eql([])
          })
        })
      })
    })
  }
})
