import Task from "./task"

export default class Project {
  tasks = []
  id = Math.floor(Math.random() * 200)

  constructor(title, description) {
    this.title = title
    this.description = description
  }

  addTask(title, dueDate, description, priority) {
    const newTask = new Task(title, dueDate, description, priority, this.id)
    this.tasks.push(newTask)
    return newTask
  }

  getTasks() {
    return this.tasks
  }
  getTask(id) {
    return this.tasks.find(task => task.id === id)
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex(task => task.id === taskId)
    const deletedTask = this.tasks.splice(taskIndex, 1)
    
    return deletedTask
  }
}