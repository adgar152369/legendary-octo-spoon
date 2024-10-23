import Project from "./project";
import Storage from "./Storage";
import Task from "./task";

export default class Projects {
  static #defaultProject = new Project("default", "lorem ipsum");
  static #projects = new Set([]);

  constructor() {
    Projects.loadFromLocalStorage();
  }

  static loadFromLocalStorage() {
    Projects.#projects.clear();

    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("Project-")) {
          const storedProjectData = JSON.parse(localStorage.getItem(key));
          const newProject = new Project(
            storedProjectData.title,
            storedProjectData.description,
            storedProjectData.tasks.map(
              (task) =>
                new Task(
                  task.id,
                  task.title,
                  task.dueDate,
                  task.description,
                  task.priority,
                  task.projectId,
                ),
            ),
            storedProjectData.id,
          );
          Projects.#projects.add(newProject);
        }
      }
      return Array.from(Projects.#projects);
    } else {
      console.log("empty localStorage");
    }
  }

  static getProjects() {
    return Projects.loadFromLocalStorage();
  }

  static getProject(id) {
    const storedProject = JSON.parse(localStorage.getItem(`Project-${id}`));
    if (storedProject == null) {
      console.log("no project with that id found");
      return false;
    }
    // translate back into an object of type Project:
    const project = new Project(
      storedProject.title,
      storedProject.description,
      storedProject.tasks.map(
        (task) =>
          new Task(
            task.id,
            task.title,
            task.dueDate,
            task.description,
            task.priority,
            task.projectId,
          ),
      ),
      storedProject.id,
    );
    return project;
  }

  static addProject(project) {
    // (Object{})
    for (const proj of Projects.#projects) {
      if (JSON.stringify(proj) === JSON.stringify(project)) {
        console.log("this project already exists!");
        return false;
      }
    }

    const newProject = new Project(project.title, project.description);
    this.#projects.add(newProject);
    // save to localStorage:
    Storage.setProject(newProject);
    return newProject;
  }

  static deleteProject(id) {
    // remove from Set:
    for (let project of Projects.#projects) {
      if (project.id === id) {
        Projects.#projects.delete(project);
      }
    }

    const deletedProject = Storage.removeProject(id);
    return deletedProject;
  }
}
