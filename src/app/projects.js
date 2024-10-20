import Project from "./project";
import Storage from "./Storage";

export default class Projects {
  static #defaultProject = new Project("default", "lorem ipsum");
  static #projects = new Set([]);

  constructor() {
    this.loadFromLocalStorage();
  }

  loadFromLocalStorage() {
    Projects.#projects.clear();

    if (localStorage.length > 0) {
      // console.log(localStorage.length);
      // get from localStorage:
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith("Project-")) {
          const storedProjectData = JSON.parse(localStorage.getItem(key));
          const newProject = new Project(
            storedProjectData.title,
            storedProjectData.description,
            storedProjectData.id,
          );
          Projects.#projects.add(newProject);
        }
      }
    } else {
      console.log("empty localStorage");
    }
  }

  static getProjects() {
    return Array.from(Projects.#projects);
  }

  static getProject(id) {
    // load from localStorage:
    const storedProject = JSON.parse(localStorage.getItem(`Project-${id}`));
    // console.log(storedProject);
    // translate back into an object of type Project:
    const project = new Project(
      storedProject.id,
      storedProject.title,
      storedProject.description,
    );
    return project;
  }

  static addProject(project) {
    // 'project' is an object
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
    const deletedProject = Storage.removeProject(id);
    return deletedProject;
  }
}
