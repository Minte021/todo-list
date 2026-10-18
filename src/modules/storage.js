import { Project } from "./project.js";

const STORAGE_KEY = "todo-list-projects";

export function saveProjects(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function loadProjects() {
  const savedProjects = localStorage.getItem(STORAGE_KEY);

  if (savedProjects === null) {
    return [];
  }

  try {
    const projectsData = JSON.parse(savedProjects);

    if (!Array.isArray(projectsData)) {
      return [];
    }

    return projectsData.map(
      (projectData) => new Project(projectData)
    );
  } catch (error) {
    console.error("Could not load saved projects:", error);
    return [];
  }
}