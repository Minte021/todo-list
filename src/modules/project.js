import { Todo } from "./todo.js";

export class Project {
    constructor({
        id = crypto.randomUUID(),
        name = "My Tasks",
        todos = [],
    } = {}) {
        if(!name.trim()) {
            throw new Error("A project needs a name.")
        }

        this.id = id;
        this.name = name.trim();
        this.todos = todos.map((todo) => todo instanceof Todo ? todo : new Todo(todo));
    }

    addTodo(todoData) {
        const todo = todoData instanceof Todo ? todoData : new Todo(todoData);
        this.todos.push(todo);
        return todo;
    }

    getTodo(todoId) {
    return this.todos.find((todo) => todo.id === todoId);
  }
    removeTodo(todoId) {
        const originalLength = this.todos.length;

        this.todos = this.todos.filter((todo) => todo.id !== todoId);

        return this.todos.length < originalLength;
  }
}