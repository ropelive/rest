import express from 'express'
import bodyParser from 'body-parser'

import { Rope } from '@rope/node'
import { REST_PORT, REST_TIMEOUT, STATE } from './constants'

const rope = new Rope('rope-rest')

const app = express()
const jsonParser = bodyParser.json()

app.get('/', (req, res) => res.send(`ROPE REST ${STATE[rope.readyState]}`))

app.get('/query/:method?/:region?', (req, res) => {
  const { method, region } = req.params
  if (rope.readyState != 1) {
    return res.status(500).send('REST IS NOT READY')
  }

  rope
    .tell('query', { method, region })
    .timeout(REST_TIMEOUT)
    .then(data => res.json(data))
    .catch(() =>
      res.status(408).send(`Couldn't get response in ${REST_TIMEOUT}ms`)
    )
})

app.post(
  '/:kiteId?/:method',
  jsonParser,
  bodyParser.text({ type: '*/*' }),
  (req, res) => {
    const { kiteId, method } = req.params
    const args = req.body

    if (rope.readyState != 1) {
      return res.status(500).send('REST IS NOT READY')
    }

    rope
      .tell('run', { kiteId, method, args })
      .timeout(REST_TIMEOUT)
      .then(data => res.json(data))
      .catch(err => {
        let message = err.message || 'An unknown error occurred'
        if (err.name == 'TimeoutError')
          message = `Couldn't get response in ${REST_TIMEOUT}ms`
        res.status(408).send(message)
      })
  }
)

app.listen(REST_PORT)

rope.logger.info(`REST API is ready on http://0.0.0.0:${REST_PORT}`)
