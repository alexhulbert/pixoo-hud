declare module 'divoom-control'
import { init } from './src/pixoo'
import { mkPng } from './src/animation'
import { displayImage } from 'divoom-control'

const hz = 15
let t = 0

init().then(() => {
    setInterval(async () => {
        await mkPng(0.04 * (t++) + 10000)
        displayImage('test.png')
    }, 1000 / hz)
})
