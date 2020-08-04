require('ts-node').register({
  project: 'tsconfig.json',
  transpileOnly: process.env.NODE_ENV !== 'development'
})

require('./api.ts')
