import { GPU } from 'gpu.js'
import * as Jimp from 'jimp'

const resX = 16
const resY = 16

const gpu = new GPU();
const drawFrame = gpu.createKernel(function(t: number) {
    const uv = [
        (this.thread.x - this.output.x / 2) / this.output.x,
        (this.thread.y - this.output.y / 2) / this.output.y
    ]
    let v = Math.sin(uv[0] * 5 + t)
    v += Math.sin(5 * (uv[0] * Math.sin(t / 2) + uv[1] * Math.cos(t / 3)) + t)
    const c = [uv[0] + Math.sin(t / 5) * 5, uv[1] + Math.sin(t / 3) * 5]
    v += Math.sin(Math.sqrt(75 * (Math.pow(c[0], 2) + Math.pow(c[1], 2)) + 1) + t)
    v *= Math.PI
    const rgb = [
        Math.cos(v),
        Math.sin(v + 6 * Math.PI / 3),
        Math.cos(v + 4 * Math.PI / 3)
    ]
    let rgbHex = 255
    for (let i = 0; i < 3; i++) {
        rgbHex += Math.floor(255 * Math.min(1, Math.max(0, rgb[i]))) * Math.pow(2, 8 * (3 - i))
    }
    return rgbHex
}).setOutput([resX, resY])

export function mkPng(t: number): Promise<void> {
    return new Promise((resolve) => {
        const pixels = Array.prototype.slice.call(drawFrame(t))
        new Jimp(16, 16, function (err, image) {
            if (err) throw err
            pixels.forEach((row, y) => {
                row.forEach((color, x) => {
                    image.setPixelColor(color, x, y)
                })
            })
            image.write('test.png', (err) => {
                if (err) throw err
                resolve()
            })
        })
    })
}