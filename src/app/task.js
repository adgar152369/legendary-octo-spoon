import { v4 as uuidv4 } from "uuid";
import Projects from "./projects";

export default class Task {
  constructor(title, dueDate, description, priority, projectId) {
    this.id = uuidv4();
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
    this.projectId = projectId;
  }
}
