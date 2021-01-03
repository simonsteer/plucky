import Command from './Command'

export default class CommandQueue {
  private queue: Command[] = []
  private index = -1
  private get current() {
    return this.queue[this.index]
  }

  exec(...commands: Command[]) {
    if (this.canRedo) {
      this.queue = this.queue.slice(0, this.index + 1)
    }

    commands.forEach(cmd => {
      this.queue.push(cmd)
      this.index++
      this.current.exec()
    })

    return this
  }

  undo() {
    if (!this.canUndo) return
    this.current.undo()
    this.index--
  }

  redo() {
    if (!this.canRedo) return
    this.index++
    this.current.exec()
  }

  repeat() {
    if (this.canRepeat) this.exec(this.current)
  }

  get canUndo() {
    return this.index > -1
  }

  get canRedo() {
    return this.index < this.queue.length - 1
  }

  get canRepeat() {
    return this.canUndo
  }
}
