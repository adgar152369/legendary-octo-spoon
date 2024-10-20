import Task from "./task";
import { v4 as uuidv4 } from "uuid";

export default class Project {
  tasks = [];
  // id = uuidv4();

  constructor(title, description, id = null) {
    this.title = title;
    this.description = description;
    this.id = id == null ? uuidv4() : id;
  }

  addTask(task) {
    const newTask = new Task(
      task.title,
      task.dueDate,
      task.description,
      task.priority,
      this.id,
    );
    // console.log(newTask);
    this.tasks.push(newTask);
    // console.log(this.tasks);
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
