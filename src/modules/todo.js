export class Todo {
    constructor({
        id = crypto.randomUUID(),
        title,
        description = "",
        dueDate = "",
        priority = "medium",
        notes = "",
        completed = false,
    } = {}) {
        if(!title?.trim()) {
            throw new Error("A todo needs a title.");
        }
        const validPriorities = ["low", "medium", "high"];
        const normalizedPriority = String(priority).trim().toLowerCase();

        if (!validPriorities.includes(normalizedPriority)) {
        throw new Error("Invalid todo priority.");
        }

        this.id =id;
        this.title = title.trim();
        this.description = description;
        this.dueDate =dueDate;
        this.priority = normalizedPriority;
        this.notes = notes;
        this.completed = completed;
    }

    updateDetails({
  title,
  description = "",
  dueDate = "",
  priority = "medium",
  notes = "",
} = {}) {
  const trimmedTitle = title?.trim();

  if (!trimmedTitle) {
    throw new Error("A todo needs a title.");
  }

  const normalizedPriority = String(priority)
    .trim()
    .toLowerCase();

  const validPriorities = ["low", "medium", "high"];

  if (!validPriorities.includes(normalizedPriority)) {
    throw new Error("Invalid todo priority.");
  }

  this.title = trimmedTitle;
  this.description = description;
  this.dueDate = dueDate;
  this.priority = normalizedPriority;
  this.notes = notes;
}

    toggleComplete() {
        this.completed = !this.completed;
    }
}