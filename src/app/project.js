import Projects from "./projects";
import Task from "./task";

export default function Project(title, category) {
  let _projectId = Math.random() * 100
  let _projectTitle = title
  let _projectCategory = category

  return {
    getProjectInfo() {
      return {
        id: _projectId,
        title: _projectTitle,
        category: _projectCategory 
      }
    }
  }
}