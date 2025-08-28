import projectData from '../../Entities/Project.json';

export class Project {
  static all() {
    return projectData;
  }

  static find(id: number) {
    return projectData.find(p => p.id === id);
  }

  static create(newProject: any) {
    projectData.push(newProject);
    return newProject;
  }

  static update(id: number, updates: any) {
    const project = projectData.find(p => p.id === id);
    if (project) Object.assign(project, updates);
    return project;
  }

  static delete(id: number) {
    const index = projectData.findIndex(p => p.id === id);
    if (index !== -1) projectData.splice(index, 1);
  }
}
