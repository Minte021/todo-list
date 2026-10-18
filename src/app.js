import { Project } from "./modules/project.js";

const programmingProject = new Project({
    name: "Programming",
});

const task = programmingProject.addTodo({
    title: "Learn Full Stack Classes",
    description: "Practice constructors and methods",
    duedate: "2026-10-20",
    priority: "high",
    notes: "Review The Odin Project Lesson",
});

console.log("Project:", programmingProject.name);
console.log("Todo added:", task.title);

task.toggleComplete();
console.log("Completed:", task.completed);

const removed = programmingProject.removeTodo(task.id);
console.log("Todo removed:", removed);
console.log("Remaining todos:", programmingProject.todos.length);