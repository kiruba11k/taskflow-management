import dailyTaskData from '../../Entities/DailyTask.json';

export class DailyTask {
  static all() {
    return dailyTaskData;
  }

  static find(id: number) {
    return dailyTaskData.find(t => t.id === id);
  }

  static create(newTask: any) {
    dailyTaskData.push(newTask);
    return newTask;
  }

  static update(id: number, updates: any) {
    const task = dailyTaskData.find(t => t.id === id);
    if (task) Object.assign(task, updates);
    return task;
  }

  static delete(id: number) {
    const index = dailyTaskData.findIndex(t => t.id === id);
    if (index !== -1) dailyTaskData.splice(index, 1);
  }
}
