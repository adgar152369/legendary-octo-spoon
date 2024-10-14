import Project from "./project";

const Priorities = Object.freeze({
  none: 0,
  low: 1,
  medium: 2,
  high: 3
});

export default function Projects() {
  let _projects = [];

  // methods:
  const getProjects = () => _projects
  const getProject = (projectId) => {
    const project = _projects.find(p => p.id === projectId)
    return project
  }
  const createProject = (title, category) => {
    const newProject = Project(title, category)
    _projects.push(newProject)
  }
  const deleteProject = (projectId) => {}

  return {
    getProjects,
    getProject,
    createProject,
    deleteProject
  }
}