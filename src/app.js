import { Project } from "./modules/project.js";
import { loadProjects, saveProjects } from "./modules/storage.js";


let projects = loadProjects();

if (projects.length === 0) {
  const defaultProject = new Project({
    name: "My Tasks",
  });

  defaultProject.addTodo({
    title: "Learn JavaScript classes",
    description: "Practice constructors and methods",
    dueDate: "2026-10-20",
    priority: "high",
    notes: "Review The Odin Project lesson",
  });

  projects.push(defaultProject);

  saveProjects(projects);
}

console.log("Projects:", projects);
console.log("Project name:", projects[0]?.name);
console.log("Saved todos:", projects[0]?.todos);

console.log(
  "Todo methods restored:",
  typeof projects[0]?.todos[0]?.toggleComplete === "function"
);