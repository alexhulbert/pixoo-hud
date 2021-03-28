import Todoist from 'todoist-rest-api'
import { redraw } from '../pixoo'
import { state } from '../state'

const config = require('../../config.json')

const POLL_RATE = 30000

export function initTodoist() {
  const todoist = Todoist(config.todoistToken)
  const updateTodoistTasks = async () => {
    const pastMidnight = new Date().getHours() < 7
    const filter = pastMidnight ? 'due before: today' : 'due before: tomorrow'
    const tasks = await todoist.v1.task.findAll({ filter })
    state.todoist = tasks.length
    await redraw()
  }
  updateTodoistTasks()
  setInterval(updateTodoistTasks, POLL_RATE)
}