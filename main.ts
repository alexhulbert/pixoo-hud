import { init, powerOn } from './src/pixoo'
import { initAlarm } from './src/state-providers/alarm'
import { initNotificationServer } from './src/state-providers/notifications'
import { initTodoist } from './src/state-providers/todoist'

const main = async () => {
  await init()
  await powerOn()
  initTodoist()
  initAlarm()
  initNotificationServer()
}

main()