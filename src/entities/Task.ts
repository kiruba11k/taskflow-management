import taskData from '../../Entities/Task.json';

export class Task {
  static all() {
    return taskData;
  }

  static find(id: number) {
    return taskData.find(t => t.id === id);
  }

  static create(newTask: any) {
    taskData.push(newTask);
    return newTask;
  }

  static update(id: number, updates: any) {
    const task = taskData.find(t => t.id === id);
    if (task) Object.assign(task, updates);
    return task;
  }

  static delete(id: number) {
    const index = taskData.findIndex(t => t.id === id);
    if (index !== -1) taskData.splice(index, 1);
  }
}
