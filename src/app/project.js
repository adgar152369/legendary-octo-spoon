import Task from "./task";
import { v4 as uuidv4 } from "uuid";

export default class Project {
  tasks = [];
  // id = uuidv4();

  constructor(id, title, description) {
    this.title = title;
    this.description = description;
    this.id = id == null ? uuidv4() : id;
  }

  addTask(title, dueDate, description, priority) {
    const newTask = new Task(title, dueDate, description, priority, this.id);
    this.tasks.push(newTask);
    return newTask;
  }

  getTasks() {
    return this.tasks;
  }
  getTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(taskId) {
    const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
    const deletedTask = this.tasks.splice(taskIndex, 1);

    return deletedTask;
  }
}
