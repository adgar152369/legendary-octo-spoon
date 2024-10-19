export default class Storage {
  static setTask({ id, title, dueDate, description, priority, projectId }) {
    const savedTask = {
      id,
      title,
      dueDate,
      description,
      priority,
      projectId,
    };

    console.log(savedTask);
    localStorage.setItem(`Task-${id}-${projectId}`, JSON.stringify(savedTask));
    return true;
  }

  static setProject({ id, title, description }) {
    const savedProject = { id, title, description };

    localStorage.setItem(`Project-${id}`, JSON.stringify(savedProject));
    return true;
  }

  static removeProject(id) {
    const project = JSON.parse(localStorage.getItem(`Project-${id}`));
    const deletedProject = { ...project };
    localStorage.removeItem(`Project-${id}`);
    return deletedProject;
  }
}
