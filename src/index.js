import "./styles.css";
import Projects from "./app/projects";
import { format, parseISO } from "date-fns";
import Task from "./app/task";
import Storage from "./app/Storage";
import Project from "./app/project";

// const newProject = Projects.addProject({
//   title: "New Project",
//   description: "Lorem ipsum",
// });
// newProject.addTask({
//   title: "task 1",
//   dueDate: "10-25-24",
//   description: "lorem ipsum task",
//   priority: "1",
// });

// const defaultProject = Projects.getProject(newProject.id);
// Storage.setProject({
//   id: defaultProject.id,
//   title: defaultProject.title,
//   description: defaultProject.description,
// });

// DOM creation:
const bodyContent = document.querySelector("#content");
const createProjectBtn = document.createElement("button");
const mainHeading = document.createElement("h1");
createProjectBtn.className = "cta create-project-btn";
mainHeading.className = "main-heading";
mainHeading.textContent = "Projects";
createProjectBtn.textContent = "+ project";
createProjectBtn.addEventListener("click", (e) => {
  e.preventDefault();
  createProjectModal();
  // openProjectModal(projectModal);
});
// create projects list:
const projectsList = document.createElement("ul");
projectsList.className = "projects-list";

bodyContent.appendChild(createProjectBtn);
bodyContent.appendChild(mainHeading);
bodyContent.appendChild(projectsList); // append projects list to body content

// START
const projectsApp = new Projects();

function renderProjects() {
  if (Projects.getProjects().length > 0) {
    // clear no-projects message
    const message = document.querySelector(".no-projects-message");
    const projects = document.querySelector(".projects-list");
    projects.innerHTML = "";

    if (message) {
      bodyContent.removeChild(message);
    }

    for (const project of Projects.getProjects()) {
      // generate project DOM elements
      const projectEl = generateProjectEl(project);
      addProjectToDOM(projectEl);
    }
  } else {
    const emptyProjectsListEl = document.createElement("p");
    emptyProjectsListEl.className = "no-projects-message";
    emptyProjectsListEl.textContent = "No projects to display yet.";
    bodyContent.appendChild(emptyProjectsListEl);
  }
}

function renderTasks(project) {
  const projectTasks = project.getTasks();
  console.log(projectTasks);
  const tasksList = document.querySelector(
    `.tasks-list[data-project-id="${project.id.toString()}"]`,
  );

  tasksList.innerHTML = "";
  projectTasks.forEach((task) => {
    const taskItem = generateTaskEl(task); // generate task item
    tasksList.appendChild(taskItem);
  });
}

function createProjectModal() {
  const projectModal = document.createElement("dialog");
  const projectModalForm = document.createElement("form");
  const projectTitleInput = document.createElement("input");
  const projectDescriptionInput = document.createElement("input");
  const projectTitleLabel = document.createElement("label");
  const projectDescriptionLabel = document.createElement("label");
  const projectModalCancelBtn = document.createElement("button");
  const projectModalCreateBtn = document.createElement("button");
  const projectModalBtnContainer = document.createElement("div");
  const projectModalHeader = document.createElement("h3");

  projectModalBtnContainer.className = "modal-btn-container";
  projectModal.className = "project-modal";
  projectModalForm.className = "modal-form project-modal-form";
  projectModalCancelBtn.className = "cancel-btn project-modal-cancel-btn";
  projectModalCreateBtn.className = "create-btn project-modal-create-btn";
  projectModalCancelBtn.type = "button";
  projectModalCreateBtn.type = "button";
  projectTitleInput.id = "title";
  projectDescriptionInput.id = "description";
  projectTitleLabel.htmlFor = "title";
  projectDescriptionLabel.htmlFor = "description";
  projectModalHeader.className = "project-modal-header";

  projectTitleLabel.textContent = "Project Title";
  projectDescriptionLabel.textContent = "Project Description";
  projectModalCancelBtn.textContent = "Cancel";
  projectModalCreateBtn.textContent = "Create";
  projectModalHeader.textContent = "Create Project";

  projectTitleInput.placeholder = "Title";
  projectDescriptionInput.placeholder = "Description";

  projectModalForm.appendChild(projectModalHeader);
  projectModalForm.appendChild(projectTitleInput);
  projectModalForm.appendChild(projectDescriptionInput);
  projectModalBtnContainer.appendChild(projectModalCancelBtn);
  projectModalBtnContainer.appendChild(projectModalCreateBtn);
  projectModalForm.appendChild(projectModalBtnContainer);
  projectModal.appendChild(projectModalForm);

  bodyContent.appendChild(projectModal);

  openProjectModal(projectModal);
}

function openProjectModal(modal) {
  const projectModalCancelBtn = modal.querySelector(
    ".project-modal-cancel-btn",
  );
  const projectModalCreateBtn = modal.querySelector(
    ".project-modal-create-btn",
  );
  const titleInput = document.querySelector(".project-modal-form input#title");
  const descInput = document.querySelector(
    ".project-modal-form input#description",
  );

  modal.showModal();

  // cancel modal event listener:
  projectModalCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.close();
    bodyContent.removeChild(modal);
  });

  // create project event listener:
  projectModalCreateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // TODO: save project to localStorage:
    const projectData = {
      title: titleInput.value,
      description: descInput.value,
    };

    const newProjectData = Projects.addProject(projectData);
    renderProjects();

    modal.close();
    bodyContent.removeChild(modal);
  });
}

function generateProjectEl(projectData) {
  // console.log(projectData);
  const projectsList = document.querySelector(".projects-list");
  const projectItem = document.createElement("li");
  const projectTitle = document.createElement("h2");
  const projectDescription = document.createElement("p");
  const projectDeleteBtn = document.createElement("button");
  const projectTaskBtn = document.createElement("button");
  const projectItemBtnContainer = document.createElement("div");
  // create tasks list for project:
  const tasksList = document.createElement("ul");
  tasksList.className = "tasks-list";
  tasksList.setAttribute("data-project-id", projectData.id);

  projectItem.className = "project";
  projectTitle.className = "project-title";
  projectDescription.className = "project-desc";
  projectDeleteBtn.className = "delete-btn project-delete-btn";
  projectTaskBtn.className = "create-btn new-task-btn";
  projectItemBtnContainer.className = "project-btn-container";

  projectItem.setAttribute("data-project-id", projectData.id);

  projectTitle.textContent = projectData.title;
  projectDescription.textContent = `Project Description: ${projectData.description}`;
  projectDeleteBtn.textContent = "-";
  projectTaskBtn.textContent = "+ task";

  projectItemBtnContainer.appendChild(projectTaskBtn);
  projectItemBtnContainer.appendChild(projectDeleteBtn);
  projectItem.appendChild(projectTitle);
  projectItem.appendChild(projectItemBtnContainer);
  projectItem.appendChild(tasksList);

  projectTaskBtn.addEventListener("click", () => {
    const taskModal = createTaskModal(projectItem); // create new task modal
    openTaskModal(taskModal);
  });
  projectDeleteBtn.addEventListener("click", () =>
    removeProject(projectData.id),
  );

  return projectItem;
}

function generateTaskEl(taskData) {
  const taskItem = document.createElement("li");
  const taskTitle = document.createElement("h4");
  const taskDueDate = document.createElement("p");
  const taskDescription = document.createElement("p");
  const taskPriority = document.createElement("p");
  const taskDeleteBtn = document.createElement("button");

  taskItem.className = "task";
  taskTitle.className = "task-title";
  taskDueDate.className = "task-due-date";
  taskDescription.className = "task-desc";
  taskDeleteBtn.className = "delete-btn task-delete-btn";
  if (taskData.priority === "1") {
    taskPriority.className = "low-priority task-priority";
  } else if (taskData.priority === "2") {
    taskPriority.className = "med-priority task-priority";
  } else {
    taskPriority.className = "high-priority task-priority";
  }
  taskItem.setAttribute("data-project-id", taskData.projectId);

  taskTitle.textContent = taskData.title;
  taskDueDate.textContent = `due: ${taskData.dueDate}`;
  taskDescription.textContent = taskData.description;
  taskPriority.textContent = taskData.priority;
  taskDeleteBtn.textContent = "-";

  taskItem.appendChild(taskDeleteBtn);
  taskItem.appendChild(taskTitle);
  taskItem.appendChild(taskDueDate);
  taskItem.appendChild(taskDescription);
  taskItem.appendChild(taskPriority);

  // task event listeners:
  taskDeleteBtn.addEventListener("click", () => removeTask(taskData));

  return taskItem;
}

function createTaskModal(parentProject) {
  const projectElement = document.querySelector(".project");
  const newTaskModal = document.createElement("dialog");
  const taskModalForm = document.createElement("form");
  // inputs
  const taskTitleInput = document.createElement("input");
  const taskDueDateInput = document.createElement("input");
  const taskDescription = document.createElement("input");
  const taskPriority = document.createElement("input");
  const taskModalCancelBtn = document.createElement("button");
  const taskModalCreateBtn = document.createElement("button");
  const taskModalBtnContainer = document.createElement("div");
  const taskModalHeader = document.createElement("h3");

  taskModalCancelBtn.className = "cancel-btn task-modal-cancel";
  taskModalCreateBtn.className = "create-btn task-modal-create";
  taskModalForm.className = "modal-form task-modal-form";
  taskModalBtnContainer.className = "modal-btn-container";
  taskModalHeader.className = "task-modal-header";
  taskTitleInput.id = "title";
  taskDueDateInput.id = "dueDate";
  taskDescription.id = "description";
  taskPriority.id = "priority";
  taskDueDateInput.type = "date";
  taskModalCancelBtn.type = "button";
  taskModalCreateBtn.type = "button";
  taskModalForm.setAttribute(
    "data-project",
    parentProject.getAttribute("data-project-id"),
  );

  taskModalCancelBtn.textContent = "Cancel";
  taskModalCreateBtn.textContent = "Create";
  taskTitleInput.placeholder = "Task Title";
  taskDueDateInput.placeholder = "Task Due Date";
  taskDescription.placeholder = "Task Description";
  taskPriority.placeholder = "Task Priority";
  taskModalHeader.textContent = `Project: ${parentProject.querySelector(".project-title").textContent}`;

  taskModalBtnContainer.appendChild(taskModalCancelBtn);
  taskModalBtnContainer.appendChild(taskModalCreateBtn);

  taskModalForm.appendChild(taskTitleInput);
  taskModalForm.appendChild(taskDueDateInput);
  taskModalForm.appendChild(taskDescription);
  taskModalForm.appendChild(taskPriority);

  newTaskModal.appendChild(taskModalHeader);
  newTaskModal.appendChild(taskModalForm);
  newTaskModal.appendChild(taskModalBtnContainer);

  taskModalCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    newTaskModal.close();
    bodyContent.removeChild(newTaskModal);
  });

  bodyContent.appendChild(newTaskModal);

  openProjectModal(newTaskModal);
  // return newTaskModal;
}

function openTaskModal(modal) {
  modal.showModal();

  const taskTitle = modal.querySelector("input#title");
  const taskDueDate = modal.querySelector("input#dueDate");
  const taskDescription = modal.querySelector("input#description");
  const taskPriority = modal.querySelector("input#priority");
  const taskModalCreateBtn = modal.querySelector(".task-modal-create");
  const taskProjectId = modal
    .querySelector(".task-modal-form")
    .getAttribute("data-project");

  // TODO: add function to add task to storage and dom:
  taskModalCreateBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const parentProject = Projects.getProject(taskProjectId);
    // console.log(parentProject);
    // console.log(Projects.getProjects());
    const strDate = taskDueDate.value;
    const isoDate = parseISO(strDate);
    // // TODO: save task to localStorage in this method:
    const newTaskData = parentProject.addTask({
      title: taskTitle.value,
      dueDate: format(isoDate, "MM/dd/yy"),
      description: taskDescription.value,
      priority: taskPriority.value,
    });
    console.log(parentProject);
    // console.log(Projects.getProjects());
    const newTaskEl = generateTaskEl(newTaskData);
    renderTasks(parentProject);

    modal.close();
    bodyContent.removeChild(modal);
  });
}

function createTask() {}

function addProjectToDOM(projectItem) {
  const projectsList = document.querySelector(".projects-list");
  projectsList.appendChild(projectItem);
}

function removeProject(id) {
  const project = Projects.deleteProject(id);
  console.log(project);
  if (project == null) {
    console.error("No such project exists!");
    return;
  }
  const projectsList = document.querySelector(".projects-list");
  const projectEl = projectsList.querySelector(
    `.project[data-project-id="${project.id.toString()}"]`,
  );
  projectsList.removeChild(projectEl);
}

function removeTask(task) {
  const tasksList = document.querySelector(
    `.tasks-list[data-project-id="${task.projectId.toString()}"]`,
  );
  const parentProject = Projects.getProject(task.projectId);
  // console.log(parentProject.getTasks())
  const deletedTaskData = parentProject.deleteTask(task.id);
  // console.log(deletedTaskData)
  renderTasks(parentProject);
}

function addTaskToDOM(taskEl) {
  const taskProjectId = taskEl.getAttribute("data-project-id");
  const corrTasksList = document.querySelector(
    `.tasks-list[data-project-id="${taskProjectId}"]`,
  );

  // append new task to tasks list:
  corrTasksList.appendChild(taskEl);
}

renderProjects();
