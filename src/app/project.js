import Task from "./task";
import { v4 as uuidv4 } from "uuid";
import Storage from "./Storage";

export default class Project {
  constructor(title, description, tasks = [], id = null) {
    this.title = title;
    this.description = description;
    this.id = id == null ? uuidv4() : id;
    this.tasks = tasks;
  }

  addTask(task) {
    const newTask = new Task(
      null,
      task.title,
      task.dueDate,
      task.description,
      task.priority,
      this.id,
    );
    this.tasks.push(newTask);
    this.saveToStorage(); // save updated project to localStorage
    return newTask;
  }

  saveTask(task) {
    const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
    this.tasks.splice(taskIndex, 1, task);
    Storage.setProject({
      id: this.id,
      title: this.title,
      description: this.description,
      tasks: this.tasks,
    });
  }

  getTasks() {
    return this.tasks;
  }
  getTask(id) {
    return this.tasks.find((task) => task.id === id);
  }

  deleteTask(task) {
    if (task) {
      const taskId = task.id;
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
      const deletedTask = this.tasks.splice(taskIndex, 1);
      Storage.removeTask(this, taskId);

      return deletedTask[0];
    }
  }

  saveToStorage() {
    Storage.setProject({
      id: this.id,
      title: this.title,
      description: this.description,
      tasks: this.tasks,
    });
  }
}
