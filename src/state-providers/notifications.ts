import * as Http from 'http'

import { redraw } from '../pixoo'
import { state } from '../state'

export function initNotificationServer() {
  Http.createServer((req, res) => {
    req.on('data', data => {
      state.messages = JSON.parse(data).notifications || 0
      redraw()
    })
    res.end()
  }).listen(8091)
}
