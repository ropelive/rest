export const REST_PORT = process.env.REST_PORT || 3435
export const REST_TIMEOUT = process.env.REST_TIMEOUT || 10000
export const STATE = {
  0: 'NOTREADY',
  1: 'READY',
  3: 'CLOSED',
  5: 'CONNECTING',
}
