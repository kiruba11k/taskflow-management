import fileUploadData from '../../Entities/FileUpload.json';

export class FileUpload {
  static all() {
    return fileUploadData;
  }

  static find(id: number) {
    return fileUploadData.find(f => f.id === id);
  }

  static create(newFile: any) {
    fileUploadData.push(newFile);
    return newFile;
  }

  static update(id: number, updates: any) {
    const file = fileUploadData.find(f => f.id === id);
    if (file) Object.assign(file, updates);
    return file;
  }

  static delete(id: number) {
    const index = fileUploadData.findIndex(f => f.id === id);
    if (index !== -1) fileUploadData.splice(index, 1);
  }
}
