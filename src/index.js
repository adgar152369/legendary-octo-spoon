import Projects from "./app/projects";

// DOM creation will go here:
const projects = Projects()
projects.createProject("Project 1", "Demo")
const allProjects = projects.getProjects()
// console.log(allProjects)

for (let project of allProjects) {
	console.log(project.getProjectInfo())
}