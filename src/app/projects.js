import Project from "./project";

export default class Projects {
  static #defaultProject = new Project('default', 'lorem ipsum')
  static #projects = new Set([])

  static getProjects() {
    return Array.from(Projects.#projects)
  }

  static getProject(id) {
    const project = Projects.getProjects().find(p => p.id === id)
    return project
  }

  static addProject(project) { // 'project' is an object   
    for (const proj of this.#projects) {
      if (proj === project) {
        console.log('this project already exists!');
        return
      }
    }
    const newProject = new Project(project.title, project.description)
    this.#projects.add(newProject)
    return newProject
  }

  static deleteProject(id) {
    for (const project of this.#projects) {      
      if (project.id === id) {
        if (project.title === 'default') {
          console.error('cannot delete the default project')
          return
        } else {
          this.#projects.delete(project) // Delete the project
          console.log(`Project with id ${id} has been deleted.`)
          return project
        }
      }
    }
  }
}