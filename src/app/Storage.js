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
    localStorage.setItem(`Task-${id}-${projectId}`, JSON.stringify(savedTask));
    return true;
  }

  static setProject({ id, title, description, tasks }) {
    const savedProject = { id, title, description, tasks };

    localStorage.setItem(`Project-${id}`, JSON.stringify(savedProject));
    return true;
  }

  static removeProject(id) {
    const project = JSON.parse(localStorage.getItem(`Project-${id}`));
    const deletedProject = { ...project };
    localStorage.removeItem(`Project-${id}`);
    return deletedProject;
  }

  static removeTask(project, taskId) {
    const projectData = JSON.parse(
      localStorage.getItem(`Project-${project.id}`),
    );
    const taskIndex = projectData.tasks.findIndex((task) => task.id === taskId);

    if (taskIndex !== -1) {
      projectData.tasks.splice(taskIndex, 1);
      localStorage.setItem(
        `Project-${project.id}`,
        JSON.stringify(projectData),
      );
      console.log(`Task ${taskId} removed successfully.`);
    } else {
      console.log("Project or tasks not found.");
    }
  }
}
