const projectList = document.querySelector("#project-list");
const currentProjectTitle = document.querySelector(
  "#current-project-title"
);
const projectSubtitle = document.querySelector("#project-subtitle");
const taskSummary = document.querySelector("#task-summary");
const todoList = document.querySelector("#todo-list");

const projectForm = document.querySelector("#project-form");
const projectNameInput = document.querySelector("#project-name");
const todoForm = document.querySelector("#todo-form");

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (text !== undefined) {
    element.textContent = text;
  }

  return element;
}

function formatDueDate(dueDate) {
  if (!dueDate) {
    return "";
  }

  const date = new Date(`${dueDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dueDate;
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function renderProjects(projects, activeProjectId) {
  projectList.replaceChildren();

  projects.forEach((project) => {
    const button = createElement("button", "project-link");
    button.type = "button";
    button.dataset.projectId = project.id;

    if (project.id === activeProjectId) {
      button.classList.add("is-active");
      button.setAttribute("aria-current", "page");
    }

    const name = createElement(
      "span",
      "project-name",
      project.name
    );

    const count = createElement(
      "span",
      "project-count",
      String(project.todos.length)
    );

    button.append(name, count);
    projectList.append(button);
  });
}

function renderEmptyState(title, message) {
  const container = createElement("div", "empty-state");
  const heading = createElement("h4", "", title);
  const description = createElement("p", "", message);

  container.append(heading, description);
  todoList.append(container);
}

function addDetail(details, label, value) {
  const container = createElement("div", "detail-field");
  const heading = createElement("p", "detail-label", label);
  const content = createElement(
    "p",
    "detail-value",
    value || "Nothing added yet."
  );

  container.append(heading, content);
  details.append(container);
}

function renderTodoCard(todo, expandedTodoId) {
  const card = createElement(
    "article",
    `todo-card${todo.completed ? " is-complete" : ""}`
  );

  const main = createElement("div", "todo-card-main");

  const completionLabel = createElement("label", "completion-control");
  const checkbox = createElement("input", "completion-checkbox");
  checkbox.type = "checkbox";
  checkbox.checked = todo.completed;
  checkbox.dataset.action = "toggle-complete";
  checkbox.dataset.todoId = todo.id;
  checkbox.setAttribute("aria-label", `Complete ${todo.title}`);

  completionLabel.append(checkbox);

  const content = createElement("div", "todo-copy");

  const title = createElement(
    "button",
    "todo-title-button",
    todo.title
  );
  title.type = "button";
  title.dataset.action = "toggle-details";
  title.dataset.todoId = todo.id;

  content.append(title);

  if (todo.description) {
    content.append(
      createElement(
        "p",
        "todo-description-preview",
        todo.description
      )
    );
  }

  const meta = createElement("div", "todo-meta");

  const priorityText =
    todo.priority.charAt(0).toUpperCase() +
    todo.priority.slice(1);

  meta.append(
    createElement(
      "span",
      `priority-badge priority-${todo.priority}`,
      `${priorityText} priority`
    )
  );

  const formattedDate = formatDueDate(todo.dueDate);

  if (formattedDate) {
    meta.append(
      createElement("span", "due-date", `Due ${formattedDate}`)
    );
  }

  content.append(meta);

  const deleteButton = createElement(
    "button",
    "delete-button",
    "Delete"
  );

  deleteButton.type = "button";
  deleteButton.dataset.action = "delete-todo";
  deleteButton.dataset.todoId = todo.id;
  deleteButton.setAttribute("aria-label", `Delete ${todo.title}`);

  main.append(completionLabel, content, deleteButton);
  card.append(main);

    if (todo.id === expandedTodoId) {
    const details = createElement("div", "todo-details");

    addDetail(details, "Description", todo.description);
    addDetail(details, "Notes", todo.notes);

    const actions = createElement("div", "form-actions");

    const editButton = createElement(
        "button",
        "button button-secondary",
        "Edit task"
    );

    editButton.type = "button";
    editButton.dataset.action = "edit-todo";
    editButton.dataset.todoId = todo.id;

    actions.append(editButton);
    details.append(actions);
    card.append(details);
    }

  return card;
}

export function renderTodos(project, expandedTodoId = null) {
  todoList.replaceChildren();

  if (!project) {
    currentProjectTitle.textContent = "No project";
    projectSubtitle.textContent = "Create a project to get started.";
    taskSummary.textContent = "0 tasks";

    renderEmptyState(
      "No project selected",
      "Create a project to begin organizing your tasks."
    );

    return;
  }

  currentProjectTitle.textContent = project.name;

  const total = project.todos.length;
  const completed = project.todos.filter(
    (todo) => todo.completed
  ).length;

  projectSubtitle.textContent =
    total - completed === 1
      ? "1 task left to complete."
      : `${total - completed} tasks left to complete.`;

  taskSummary.textContent =
    `${total} ${total === 1 ? "task" : "tasks"} · ` +
    `${completed} completed`;

  if (total === 0) {
    renderEmptyState(
      "Nothing on your list yet",
      "Add a task to this project and it will appear here."
    );

    return;
  }

  project.todos.forEach((todo) => {
    todoList.append(renderTodoCard(todo, expandedTodoId));
  });
}

export function showProjectForm() {
  projectForm.classList.remove("hidden");
  projectNameInput.focus();
}

export function hideProjectForm() {
  projectForm.reset();
  projectForm.classList.add("hidden");
}

export function showTodoForm(todo = null) {
  const isEditing = todo !== null;

  todoForm.elements.title.value = todo?.title ?? "";
  todoForm.elements.description.value =
    todo?.description ?? "";
  todoForm.elements.dueDate.value = todo?.dueDate ?? "";
  todoForm.elements.priority.value =
    todo?.priority ?? "medium";
  todoForm.elements.notes.value = todo?.notes ?? "";

  document.querySelector("#todo-form-title").textContent =
    isEditing ? "Edit task" : "Create a task";

  document.querySelector("#todo-submit-btn").textContent =
    isEditing ? "Save changes" : "Create task";

  todoForm.classList.remove("hidden");
  todoForm.elements.title.focus();
}

export function hideTodoForm() {
  todoForm.reset();
  todoForm.classList.add("hidden");

  document.querySelector("#todo-form-title").textContent =
    "Create a task";

  document.querySelector("#todo-submit-btn").textContent =
    "Create task";
}

