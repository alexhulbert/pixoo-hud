import { Canvas, createCanvas } from 'canvas'
import * as pixel from 'pixel-art'
import { icons, numerals, palette } from './art'
import { hoursUntilWake, isPastBedtime } from './state-providers/alarm'
import { state } from './state'

interface Notification {
  icon: string[],
  number: number
}

export function drawGUI(): Canvas {
  let pixelMatrix = new Array(16).fill(' '.repeat(16))
  const notifications: Notification[] = []

  if (state.todoist) notifications.push({ number: state.todoist, icon: icons.todoist })
  if (state.messages) notifications.push({ number: state.messages, icon: icons.messages })
  if (state.slack) notifications.push({ number: state.slack, icon: icons.slack })
  if (isPastBedtime() && notifications.length < 3) {
    notifications.unshift({ number: hoursUntilWake(), icon: icons.greyCircle })
  }

  for (let i = 0; i < Math.min(3, notifications.length); i++) {
    pixelMatrix = drawNotification(pixelMatrix, i, notifications[i].number, notifications[i].icon)
  }

  const pixelArt = pixel.art(pixelMatrix).scale(1).palette(palette)
  const canvas = createCanvas(16, 16)
  pixelArt.draw(canvas.getContext('2d'))
  return canvas
}

function drawNotification(canvas: string[], position: number, num: number, icon: string[]): string[] {
  const y = 1 + 5 * position
  const digits = [Math.floor(num / 10), num % 10]
  canvas = drawImage(canvas, icon, 1, y)
  canvas = drawImage(canvas, numerals[digits[0]], 7, y)
  canvas = drawImage(canvas, numerals[digits[1]], 11, y)
  return canvas
}

function drawImage(canvas: string[], image: string[], startX: number, startY: number): string[] {
  for (let i = 0; i < image.length; i++) {
    const newLine = canvas[startY + i].split('')
    newLine.splice(startX, image[i].length, image[i])
    canvas[startY + i] = newLine.join('')
  }
  return canvas
}