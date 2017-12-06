import express from 'express'
import bodyParser from 'body-parser'

import { Rope } from '@rope/node'
import { ROPE_SERVER, REST_PORT, REST_TIMEOUT, STATE } from './constants'

const rope = new Rope('rope-rest', {}, { url: ROPE_SERVER })

const app = express()
const jsonParser = bodyParser.json()

function run(kiteId, method, args, res) {
  if (rope.readyState != 1) {
    return res
      .status(500)
      .type('txt')
      .send('REST IS NOT READY')
  }

  rope
    .tell('run', { kiteId, method, args })
    .timeout(REST_TIMEOUT)
    .then(data => res.json(data))
    .catch(err => {
      let message = err.message || 'An unknown error occurred'
      if (err.name == 'TimeoutError')
        message = `Couldn't get response in ${REST_TIMEOUT}ms`
      res
        .status(408)
        .type('txt')
        .send(message)
    })
}

app.get('/', (req, res) =>
  res.type('txt').send(`ROPE REST ${STATE[rope.readyState]}`)
)

app.get('/query/:method?', (req, res) => {
  const { method } = req.params
  if (rope.readyState != 1) {
    return res
      .status(500)
      .type('txt')
      .send('REST IS NOT READY')
  }

  rope
    .tell('query', { method })
    .timeout(REST_TIMEOUT)
    .then(data => res.json(data))
    .catch(() =>
      res
        .status(408)
        .type('txt')
        .send(`Couldn't get response in ${REST_TIMEOUT}ms`)
    )
})

app.get('/method/:kiteId?/:method', (req, res) => {
  const { kiteId, method } = req.params
  let args = req.query.args

  if (!Array.isArray(args)) {
    args = [args]
  }

  args = args.map(arg => {
    try {
      return JSON.parse(arg)
    } catch (err) {
      return arg
    }
  })

  if (args.length == 1) args = args[0]

  run(kiteId, method, args, res)
})

app.post(
  '/:kiteId?/:method',
  jsonParser,
  bodyParser.text({ type: '*/*' }),
  (req, res) => {
    const { kiteId, method } = req.params
    const args = req.body

    run(kiteId, method, args, res)
  }
)

app.listen(REST_PORT)

rope.logger.info(`REST API is ready on http://0.0.0.0:${REST_PORT}`)
