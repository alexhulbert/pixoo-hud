import { setBrightness, displayImage } from 'divoom-control'
import { connect } from 'divoom-control/src/bluetooth'
import { promisify } from 'util'
import { unlink, writeFile } from 'fs'
import * as tmp from 'tmp'

import { drawGUI } from './gui'

const config = require('../config.json')

export async function redraw() {
  const canvas = drawGUI()
  const tmpFile = await promisify(tmp.file)()
  await promisify(writeFile)(tmpFile, canvas.toBuffer())
  await displayImage(tmpFile)
  await promisify(unlink)(tmpFile)
}

export async function init() {
  await connect(config.pixooMacAddress)
}

export async function powerOff() {
  await setBrightness(0)
}

export async function powerOn() {
  await setBrightness(100)
}