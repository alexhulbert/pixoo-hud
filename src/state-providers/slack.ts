import Axios from 'axios'

import { state } from '../state'
import { redraw } from '../pixoo'

const config = require('../../config.json')
const axiosCfg = { headers: { Authorization: 'Bearer ' + config.slackToken } }

const POLL_INTERVAL = 120000

export function initSlack() {
  const loop = async () => {
    const users = await Axios.post('https://slack.com/api/conversations.list?types=im', {}, axiosCfg)
    const conversationIds: string[] = users.data.channels.map((ch: any) => ch.id)
    const conversationUnreadCounts: number[] = await Promise.all(conversationIds.map(async id => {
      const info = await Axios.post('https://slack.com/api/conversations.info?channel=' + id, {}, axiosCfg)
      return info.data.channel.unread_count_display
    }))
    const numUnread = conversationUnreadCounts.filter(n => n).length
    state.slack = numUnread
    redraw()
  }
  loop()
  setInterval(loop, POLL_INTERVAL)
}