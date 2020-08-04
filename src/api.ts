import express, { Request, Response, RequestHandler } from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import compression from 'compression'
import handleErrorsForProduction from './handle-errors-for-production'
import { API_HOST, API_PORT, IS_PRODUCTION } from './config'
import v1 from './v1/routes'

const MORGAN_LOG_LEVEL = IS_PRODUCTION
  ? 'common'
  : 'dev'

const app = express()

app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan(MORGAN_LOG_LEVEL))
app.use(handleErrorsForProduction as unknown as RequestHandler)

app.use('/v1', v1)
app.use('/', v1)

// Handle all invalid routes. This must be the last route in the chain
app.all('*', (_req: Request, res: Response): Response => {
  return res.status(404).json({ error: 'Not Found' })
})

app.listen(API_PORT, API_HOST, () => {
  return console.log(`Started local server on port: ${API_PORT}`)
})
