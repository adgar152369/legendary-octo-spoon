import Project from './project'
import Projects from './projects'

export default class Task {
  id = 1

  constructor(title, dueDate, description, priority, projectId) {
    this.id = Projects.getProject(projectId).getTasks().length + 1
    this.title = title
    this.dueDate = dueDate
    this.description = description
    this.priority = priority
    this.projectId = projectId
  } 
}