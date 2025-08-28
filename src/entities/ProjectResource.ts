import projectResourceData from '../../Entities/ProjectResource.json';

export class ProjectResource {
  static all() {
    return projectResourceData;
  }

  static find(id: number) {
    return projectResourceData.find(r => r.id === id);
  }

  static create(newResource: any) {
    projectResourceData.push(newResource);
    return newResource;
  }

  static update(id: number, updates: any) {
    const resource = projectResourceData.find(r => r.id === id);
    if (resource) Object.assign(resource, updates);
    return resource;
  }

  static delete(id: number) {
    const index = projectResourceData.findIndex(r => r.id === id);
    if (index !== -1) projectResourceData.splice(index, 1);
  }
}
