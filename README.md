# REST

[![CircleCI](https://circleci.com/gh/ropelive/rest/tree/master.svg?style=svg)](https://circleci.com/gh/ropelive/rest/tree/master)
[![NPM version](https://img.shields.io/npm/v/@rope/rest.svg)](https://www.npmjs.com/package/@rope/rest)

REST endpoint for Rope nodes to make calls via any HTTP client.

## Getting Started

Install dependencies first via `npm install` then start the REST server
with `npm start`.

If developing locally and need to use a specific Rope server it can be
passed as an environment variable;

`ROPE_SERVER=http://0.0.0.0:3210 npm start`

Once server is up and running we can make a call to any  available node
with an HTTP client of choice;

`POST http://0.0.0.0:3435/KITE_ID/METHOD`

and body of the request should be in JSON format for
arguments.

If you need to query available nodes you can use `GET /query/[method]`
endpoint, which will return all available nodes if `method` is not provided.

If `method` is present it will try to find nodes which has that `method` in
their `api` manifest.

Complete example would be;

```bash
λ ~/ KITES=$(curl -sX GET http://0.0.0.0:3435/query/square) # find kites which has square method
λ ~/ KITEID=$(echo $KITES | jq -r '.[0].id')                # get the first one's id
λ ~/ curl -sX POST \
  http://0.0.0.0:3435/$KITEID/square \
  -H 'content-type: application/json' \
  -d '[50]' | jq                                            # run square method with 50
2500                                                        # and the result 2500
```

* `jq` is a tool for parsing json

## License

MIT (c) 2017 Rope
