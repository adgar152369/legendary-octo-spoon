import Project from "./project";
import Storage from "./Storage";

export default class Projects {
  static #defaultProject = new Project("default", "lorem ipsum");
  static #projects = new Set([]);

  constructor() {
    // Load projects from localStorage
    if (localStorage.length > 0) {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i); // Get the key at index i
        // console.log(key);
        if (key.startsWith("Project-")) {
          // Assuming you're storing projects with a 'Project-' prefix
          const projectData = JSON.parse(localStorage.getItem(key)); // Parse JSON string to object
          // console.log(projectData);
          // Create a new project and add it to the Set
          const newProject = new Project(
            projectData.id,
            projectData.title,
            projectData.description,
          );
          Projects.#projects.add(newProject); // Add to the Set
        }
      }
    }
  }

  static getProjects() {
    const projects = [];
    // load from localStorage:
    for (let project of Array.from(Projects.#projects)) {
      const storedProject = Projects.getProject(project.id);
      projects.push(storedProject);
    }
    return projects;
  }

  static getProject(id) {
    // load from localStorage:
    const project = localStorage.getItem(`Project-${id}`);
    return JSON.parse(project);
  }

  static addProject(project) {
    // 'project' is an object
    for (const proj of this.#projects) {
      if (proj === project) {
        console.log("this project already exists!");
        return;
      }
    }
    const newProject = new Project(null, project.title, project.description);
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
