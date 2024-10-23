import { v4 as uuidv4 } from "uuid";
import Projects from "./projects";

export default class Task {
  constructor(id = null, title, dueDate, description, priority, projectId) {
    this.id = id == null ? uuidv4() : id;
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
    this.projectId = projectId;
  }
}
