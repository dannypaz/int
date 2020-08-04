const {
  API_HOST: HOST,
  API_PORT: PORT,
  NODE_ENV
} = process.env

if (!PORT) {
  throw new Error('API_PORT is not specified')
}

if (!HOST) {
  throw new Error('API_HOST is not specified')
}

if (Number.isNaN(parseInt(PORT, 10))) {
  throw new Error('API_PORT must be an integer')
}

export const API_HOST = HOST
export const API_PORT = parseInt(PORT, 10)
export const IS_PRODUCTION = NODE_ENV === 'production'
