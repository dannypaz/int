import chai from 'chai'
import nodeFetch from 'node-fetch'

const API_URL = 'http://localhost:8080'

interface TestResponse {
  // eslint-disable-next-line
  [key: string]: any;
}

export async function get (route = ''): Promise<TestResponse> {
  const url = new URL(route, API_URL)
  const res = await nodeFetch(url.toString())
  if (!res.ok) {
    console.error(`Received a ${res.status} error when fetching ${url.toString()}: ${res.statusText}`)
  }
  return res.json()
}

interface PostParams {
  // eslint-disable-next-line
  [key: string]: any;
}

export async function post (route = '', params: PostParams = {}): Promise<TestResponse> {
  const url = new URL(route, API_URL)
  const res = await nodeFetch(url.toString(), {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) {
    console.error(`Received a ${res.status} error when trying POST ${url.toString()}: ${res.statusText}`)
  }
  return res.json()
}

export const expect = chai.expect

// Test the connection to server and fail if we do not get a response
before(async () => {
  try {
    await get()
  } catch (e) {
    if (e?.message?.includes('ECONNREFUSED')) {
      console.error(e)
      throw new Error('Please start server before running tests')
    }
  }
})

beforeEach(async () => {
  // Reset the API before continuing with test suite
  try {
    await post('/reset')
  } catch (e) {
    throw new Error('unable to reset api state, testing issues will occur')
  }
})
