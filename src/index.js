import express from 'express'
import bodyParser from 'body-parser'

import { Rope } from '@rope/node'
import { REST_PORT, REST_TIMEOUT } from './constants'

const rope = new Rope('rope-rest')

const app = express()
const jsonParser = bodyParser.json()

app.get('/', (req, res) => res.send('ROPE REST Ready'))

app.post('/:kiteId/:method', jsonParser, (req, res) => {
  const { kiteId, method, arg } = req.params
  const args = req.body

  rope
    .tell('run', { kiteId, method, args })
    .timeout(REST_TIMEOUT)
    .then(data => res.send(`${data}`))
    .catch(() => res.send('timeout'))
})

app.listen(REST_PORT)

rope.logger.info(`REST API is ready on http://0.0.0.0:${REST_PORT}`)
