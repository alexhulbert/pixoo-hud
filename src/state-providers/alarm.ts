import * as Aedes from 'aedes'
import { createServer } from 'aedes-server-factory'
import { powerOff, powerOn, redraw } from '../pixoo'

const alarmState = {
    isPastBedtime: false,
    nextAlarmTime: 0
}

export function isPastBedtime(): boolean {
  return alarmState.isPastBedtime
}

export function hoursUntilWake(): number {
    const MS_IN_HOUR = 1000 * 60 * 60
    const msUntilAlarm = alarmState.nextAlarmTime - new Date().getTime()
    return Math.floor(Math.max(0, msUntilAlarm / MS_IN_HOUR))
}

const mqttHandlers: Record<string, Function> = {
  time_to_bed_alarm_alert: (nextAlarmTime: number) => {
    alarmState.isPastBedtime = true
    alarmState.nextAlarmTime = nextAlarmTime
    console.log(alarmState)
    redraw()
  },
  sleep_tracking_started: () => {
    powerOff()
  },
  alarm_alert_start: async () => {
    alarmState.isPastBedtime = false
    console.log(alarmState)
    await redraw()
    powerOn()
  }
}

export function initAlarm() {
  const mqttServer = Aedes()
  mqttServer.subscribe('SleepAsAndroid', ({ payload }, cb) => {
    const message = JSON.parse(payload.toString())
    if (mqttHandlers.hasOwnProperty(message.event)) {
      mqttHandlers[message.event](message.value1, message.value2)
    }
    cb()
  }, () => {})

  const tcpServer = createServer(mqttServer)
  tcpServer.listen(1883, '0.0.0.0', () => {})
}