import "./styles.css";
import Projects from "./app/projects";
import { format, parseISO } from "date-fns";
import Toastify from "toastify-js";
import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";

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
});
const projectsList = document.createElement("ul"); // create projects list
projectsList.className = "projects-list";

bodyContent.appendChild(createProjectBtn);
bodyContent.appendChild(mainHeading);
bodyContent.appendChild(projectsList); // append projects list to body content

// START
function renderProjects() {
  const projectsApp = new Projects();
  const projectsList = document.querySelector(".projects-list");
  const projects = Projects.getProjects();
  projectsList.innerHTML = "";

  if (projects && projects.length > 0) {
    const message = document.querySelector(".no-projects-message");
    if (message) bodyContent.removeChild(message);

    for (const project of Array.from(projects)) {
      const projectEl = generateProjectEl(project);
      addProjectToDOM(projectEl);
      renderTasks(project);
    }
  } else {
    const emptyProjectsListEl = document.createElement("p");
    emptyProjectsListEl.className = "no-projects-message";
    emptyProjectsListEl.textContent = "No projects to display.";
    bodyContent.appendChild(emptyProjectsListEl);
  }
}

function renderTasks(project) {
  const tasksList = document.querySelector(
    `.tasks-list[data-project-id="${project.id.toString()}"]`,
  );
  tasksList.innerHTML = "";
  const tasks = project.tasks;

  if (tasks.length === 0) {
    const noTasksMessage = document.createElement("p");
    noTasksMessage.className = "no-tasks-message";
    noTasksMessage.textContent = "No tasks to display.";
    tasksList.appendChild(noTasksMessage);
  } else {
    for (const task of tasks) {
      const taskEl = generateTaskEl(task);
      addTaskToDOM(taskEl, project.id);
    }
  }
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
  const projectsList = document.querySelector(".projects-list");
  const projectItem = document.createElement("li");
  const projectTitle = document.createElement("h2");
  const projectDescription = document.createElement("p");
  const projectDeleteBtn = document.createElement("button");
  const projectAddTaskBtn = document.createElement("button");
  const projectItemBtnContainer = document.createElement("div");
  // create tasks list for project:
  const tasksList = document.createElement("ul");
  tasksList.className = "tasks-list";
  tasksList.setAttribute("data-project-id", projectData.id);

  projectItem.className = "project";
  projectTitle.className = "project-title";
  projectDescription.className = "project-desc";
  projectDeleteBtn.className = "delete-btn project-delete-btn";
  projectAddTaskBtn.className = "create-btn new-task-btn";
  projectItemBtnContainer.className = "project-btn-container";

  projectItem.setAttribute("data-project-id", projectData.id);

  projectTitle.textContent = projectData.title;
  projectDescription.textContent = `Project Description: ${projectData.description}`;
  projectDeleteBtn.textContent = "-";
  projectAddTaskBtn.textContent = "+ task";

  projectItemBtnContainer.appendChild(projectAddTaskBtn);
  projectItemBtnContainer.appendChild(projectDeleteBtn);
  projectItem.appendChild(projectTitle);
  projectItem.appendChild(projectItemBtnContainer);
  projectItem.appendChild(tasksList);

  projectAddTaskBtn.addEventListener("click", () => {
    const taskModal = createTaskModal(projectData);
    // openTaskModal(taskModal);
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
  taskItem.addEventListener("click", () => editTask(taskData));
  taskDeleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    removeTask(taskData);
  });

  return taskItem;
}

function createTaskModal(parentProject) {
  const newTaskModal = document.createElement("div");
  const taskModalBackdrop = document.createElement("div");
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
  // const taskDueDateLabel = document.createElement("label");

  taskDueDateInput.placeholder = "Due date";

  newTaskModal.className = "task-modal";
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
  taskTitleInput.name = "title";
  taskDueDateInput.name = "dueDate";
  taskDescription.name = "description";
  taskPriority.name = "priority";
  taskDueDateInput.type = "text";
  taskModalCancelBtn.type = "button";
  taskModalCreateBtn.type = "submit";
  taskModalForm.setAttribute("data-project", parentProject.id);
  taskModalHeader.textContent = parentProject.title;

  taskModalCancelBtn.textContent = "Cancel";
  taskModalCreateBtn.textContent = "Create";
  taskTitleInput.placeholder = "Task Title";
  taskDescription.placeholder = "Task Description";
  taskPriority.placeholder = "Task Priority";
  taskModalBackdrop.className = "modal-backdrop";

  taskTitleInput.required = true;
  taskPriority.required = true;

  taskModalBtnContainer.appendChild(taskModalCancelBtn);
  taskModalBtnContainer.appendChild(taskModalCreateBtn);

  taskModalForm.appendChild(taskTitleInput);
  taskModalForm.appendChild(taskDescription);
  taskModalForm.appendChild(taskPriority);
  taskModalForm.appendChild(taskDueDateInput);
  taskModalForm.appendChild(taskModalBtnContainer);

  newTaskModal.appendChild(taskModalHeader);
  newTaskModal.appendChild(taskModalForm);

  taskModalCancelBtn.addEventListener("click", (e) => {
    e.preventDefault();
    taskModalBackdrop.classList.add("close");
    bodyContent.removeChild(newTaskModal);
    document.querySelector("body").removeChild(taskModalBackdrop);
  });

  bodyContent.appendChild(newTaskModal);
  document.querySelector("body").appendChild(taskModalBackdrop);

  openTaskModal(newTaskModal);
}

function openTaskModal(modal) {
  const taskModalBackdrop = document.querySelector(".modal-backdrop");
  const dp = new AirDatepicker("#dueDate", {
    language: "en",
    autoClose: true,
    dateFormat: "MM/dd/yyyy",
    locale: {
      days: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      monthsShort: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      today: "Today",
      clear: "Clear",
      dateFormat: "MM/dd/yyyy",
      firstDay: 0,
    },
  });

  const taskTitle = modal.querySelector("input#title");
  const taskDueDate = modal.querySelector("input#dueDate");
  const taskDescription = modal.querySelector("input#description");
  const taskPriority = modal.querySelector("input#priority");
  const taskModalCreateBtn = modal.querySelector(".task-modal-create");
  const taskModalForm = document.querySelector(".task-modal-form");
  const taskProjectId = taskModalForm.getAttribute("data-project");

  taskModalCreateBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!taskModalForm.checkValidity()) {
      taskModalForm.reportValidity();
      return;
    }
    const parentProjectData = Projects.getProject(taskProjectId);
    const strDate = taskDueDate.value ? taskDueDate.value : null;
    const isoDate = strDate === null ? null : parseISO(strDate);

    const newTaskData = parentProjectData.addTask({
      title: taskTitle.value,
      dueDate: taskDueDate.value,
      description: taskDescription.value,
      priority: taskPriority.value,
    });
    renderTasks(parentProjectData);
    document.querySelector("body").removeChild(taskModalBackdrop);
    bodyContent.removeChild(modal);
  });
}

function addProjectToDOM(projectItem) {
  const projectsList = document.querySelector(".projects-list");
  projectsList.appendChild(projectItem);
}

function removeProject(id) {
  const confirmDelete = confirm(
    "This will delete all associated tasks. Continue? ",
  );

  if (confirmDelete) {
    const project = Projects.deleteProject(id);
    renderProjects();
  } else {
    console.log("canceled");
  }
}

function removeTask(task) {
  const parentProject = Projects.getProject(task.projectId);
  if (parentProject == null) {
    console.log("no project found");
  } else {
    const deletedTaskData = parentProject.deleteTask(task);
    // show toast:
    Toastify({
      text: `"${deletedTaskData.title}" task deleted!`,
      className: "task-toast delete-task-info",
      stopOnFocus: true,
      close: true,
      duration: -1,
    }).showToast();
    renderTasks(parentProject);
  }
}

function editTask(taskToEdit) {
  const parentProjectData = Projects.getProject(taskToEdit.projectId);
  createTaskModal(parentProjectData);

  const taskModalForm = document.querySelector(".task-modal-form");
  const taskModalBackdrop = document.querySelector(".modal-backdrop");
  const taskModalCreateBtn = document.querySelector(".task-modal-create");
  const taskModalBtnContainer = document.querySelector(".modal-btn-container");
  const taskModalSaveBtn = document.createElement("button");
  const taskTitle = taskModalForm.querySelector("input#title");
  const taskDueDate = taskModalForm.querySelector("input#dueDate");
  const taskDescription = taskModalForm.querySelector("input#description");
  const taskPriority = taskModalForm.querySelector("input#priority");

  taskModalBtnContainer.removeChild(taskModalCreateBtn);
  taskModalBtnContainer.appendChild(taskModalSaveBtn);

  taskModalSaveBtn.className = "create-btn task-save-btn";

  // pre-fill inputs
  taskTitle.value = taskToEdit.title;
  taskDueDate.value = taskToEdit.dueDate;
  taskDescription.value = taskToEdit.description;
  taskPriority.value = taskToEdit.priority;
  taskModalSaveBtn.textContent = "Save";

  taskModalSaveBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // get tasks from parent project:
    for (const task of parentProjectData.tasks) {
      if (task.id === taskToEdit.id) {
        const savedTask = parentProjectData.saveTask({
          id: task.id,
          title: taskTitle.value,
          dueDate: taskDueDate.value,
          description: taskDescription.value,
          priority: taskPriority.value,
          projectId: task.projectId,
        });
      }
    }
    const modal = document.querySelector(".task-modal");
    document.querySelector("body").removeChild(taskModalBackdrop);
    bodyContent.removeChild(modal);
    renderTasks(parentProjectData);
    // TODO: show Toast on save:
    Toastify({
      text: `successfully changed "${taskToEdit.title}" task!`,
      className: "task-toast add-task-info",
      stopOnFocus: true,
      close: true,
      duration: -1,
    }).showToast();
  });
}

function addTaskToDOM(taskEl, projectId) {
  const corrTasksList = document.querySelector(
    `.tasks-list[data-project-id="${projectId}"]`,
  );
  corrTasksList.appendChild(taskEl);
}

renderProjects();
