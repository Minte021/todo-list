import { Project } from "./modules/project.js";
import {
  loadProjects,
  saveProjects,
} from "./modules/storage.js";

import {
  renderProjects,
  renderTodos,
  showProjectForm,
  hideProjectForm,
  showTodoForm,
  hideTodoForm,
} from "./modules/dom.js";

// Load saved projects.
let projects = loadProjects();

// Make sure the app always has a default project.
if (projects.length === 0) {
  projects = [new Project({ name: "My Tasks" })];
  saveProjects(projects);
}

let activeProjectId = projects[0].id;
let expandedTodoId = null;

// Find the active project.
function getActiveProject() {
  return projects.find(
    (project) => project.id === activeProjectId
  );
}

// Render the current application state.
function renderApp() {
  renderProjects(projects, activeProjectId);
  renderTodos(getActiveProject(), expandedTodoId);

  document.querySelector("#add-todo-btn").disabled =
    !getActiveProject();
}

// Persist changes before updating the interface.
function saveAndRender() {
  saveProjects(projects);
  renderApp();
}

// Open and close forms.
document
  .querySelector("#add-project-btn")
  .addEventListener("click", () => {
    hideTodoForm();
    showProjectForm();
  });

document
  .querySelector("#cancel-project-btn")
  .addEventListener("click", hideProjectForm);

document
  .querySelector("#add-todo-btn")
  .addEventListener("click", () => {
    hideProjectForm();
    showTodoForm();
  });

document
  .querySelector("#cancel-todo-btn")
  .addEventListener("click", hideTodoForm);

// Create a project.
document
  .querySelector("#project-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document
      .querySelector("#project-name")
      .value.trim();

    if (!name) {
      return;
    }

    const project = new Project({ name });

    projects.push(project);
    activeProjectId = project.id;
    expandedTodoId = null;

    hideProjectForm();
    saveAndRender();
  });

// Create a todo in the active project.
document
  .querySelector("#todo-form")
  .addEventListener("submit", (event) => {
    event.preventDefault();

    const project = getActiveProject();

    if (!project) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    const todoData = Object.fromEntries(formData.entries());

    try {
      project.addTodo(todoData);

      expandedTodoId = null;
      hideTodoForm();
      saveAndRender();
    } catch (error) {
      window.alert(error.message);
    }
  });

// Switch projects when a project button is clicked.
document
  .querySelector("#project-list")
  .addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-id]");

    if (!button) {
      return;
    }

    activeProjectId = button.dataset.projectId;
    expandedTodoId = null;

    hideProjectForm();
    hideTodoForm();
    renderApp();
  });

// Expand task details or delete a task.
document
  .querySelector("#todo-list")
  .addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");

    if (!button) {
      return;
    }

    const project = getActiveProject();
    const todoId = button.dataset.todoId;

    if (!project) {
      return;
    }

    if (button.dataset.action === "toggle-details") {
      expandedTodoId =
        expandedTodoId === todoId ? null : todoId;

      renderApp();
    }

    if (button.dataset.action === "delete-todo") {
      const todo = project.getTodo(todoId);

      if (!todo) {
        return;
      }

      const confirmed = window.confirm(
        `Delete "${todo.title}"?`
      );

      if (!confirmed) {
        return;
      }

      project.removeTodo(todoId);

      if (expandedTodoId === todoId) {
        expandedTodoId = null;
      }

      saveAndRender();
    }
  });

// Mark tasks complete or incomplete.
document
  .querySelector("#todo-list")
  .addEventListener("change", (event) => {
    const checkbox = event.target.closest(
      'input[data-action="toggle-complete"]'
    );

    if (!checkbox) {
      return;
    }

    const project = getActiveProject();
    const todo = project?.getTodo(checkbox.dataset.todoId);

    if (!todo) {
      return;
    }

    todo.toggleComplete();
    saveAndRender();
  });

// Initial render.
renderApp();