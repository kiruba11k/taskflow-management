import sheetSyncData from '../../Entities/SheetSync.json';

export class SheetSync {
  static all() {
    return sheetSyncData;
  }

  static find(id: number) {
    return sheetSyncData.find(s => s.id === id);
  }

  static create(newSync: any) {
    sheetSyncData.push(newSync);
    return newSync;
  }

  static update(id: number, updates: any) {
    const sync = sheetSyncData.find(s => s.id === id);
    if (sync) Object.assign(sync, updates);
    return sync;
  }

  static delete(id: number) {
    const index = sheetSyncData.findIndex(s => s.id === id);
    if (index !== -1) sheetSyncData.splice(index, 1);
  }
}
