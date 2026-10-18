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

let projects = loadProjects();

if (projects.length === 0) {
  projects = [new Project({ name: "My Tasks" })];
  saveProjects(projects);
}

let activeProjectId = projects[0].id;
let expandedTodoId = null;
let editingTodoId = null;

function getActiveProject() {
  return projects.find(
    (project) => project.id === activeProjectId
  );
}

function renderApp() {
  renderProjects(projects, activeProjectId);
  renderTodos(getActiveProject(), expandedTodoId);

  document.querySelector("#add-todo-btn").disabled =
    !getActiveProject();
}

function saveAndRender() {
  saveProjects(projects);
  renderApp();
}

// Open the project form.
document
  .querySelector("#add-project-btn")
  .addEventListener("click", () => {
    editingTodoId = null;
    hideTodoForm();
    showProjectForm();
  });

document
  .querySelector("#cancel-project-btn")
  .addEventListener("click", hideProjectForm);

// Open a blank task form.
document
  .querySelector("#add-todo-btn")
  .addEventListener("click", () => {
    editingTodoId = null;
    hideProjectForm();
    showTodoForm();
  });

document
  .querySelector("#cancel-todo-btn")
  .addEventListener("click", () => {
    editingTodoId = null;
    hideTodoForm();
  });

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
    editingTodoId = null;

    hideProjectForm();
    saveAndRender();
  });

// Create a new task or update an existing one.
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
      if (editingTodoId !== null) {
        const existingTodo = project.getTodo(editingTodoId);

        if (!existingTodo) {
          editingTodoId = null;
          hideTodoForm();
          renderApp();
          return;
        }

        existingTodo.updateDetails(todoData);
      } else {
        project.addTodo(todoData);
      }

      editingTodoId = null;
      expandedTodoId = null;

      hideTodoForm();
      saveAndRender();
    } catch (error) {
      window.alert(error.message);
    }
  });

// Switch between projects.
document
  .querySelector("#project-list")
  .addEventListener("click", (event) => {
    const button = event.target.closest("[data-project-id]");

    if (!button) {
      return;
    }

    activeProjectId = button.dataset.projectId;
    expandedTodoId = null;
    editingTodoId = null;

    hideProjectForm();
    hideTodoForm();
    renderApp();
  });

// Expand tasks, edit tasks, or delete tasks.
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

    const action = button.dataset.action;

    if (action === "toggle-details") {
      expandedTodoId =
        expandedTodoId === todoId ? null : todoId;

      renderApp();
      return;
    }

    if (action === "edit-todo") {
      const todo = project.getTodo(todoId);

      if (!todo) {
        return;
      }

      editingTodoId = todo.id;
      expandedTodoId = todo.id;

      hideProjectForm();
      showTodoForm(todo);
      return;
    }

    if (action === "delete-todo") {
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

      if (editingTodoId === todoId) {
        editingTodoId = null;
        hideTodoForm();
      }

      saveAndRender();
    }
  });

// Complete or uncomplete a task.
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

renderApp();