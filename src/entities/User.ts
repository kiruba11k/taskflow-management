import userData from '../../Entities/TeamMember.json'; // Or create a separate User.json if needed

export class User {
  static all() {
    return userData;
  }

  static find(id: string | number) {
    return userData.find(u => u.id === id);
  }

  static create(newUser: any) {
    userData.push(newUser);
    return newUser;
  }

  static update(id: string | number, updates: any) {
    const user = userData.find(u => u.id === id);
    if (user) Object.assign(user, updates);
    return user;
  }

  static delete(id: string | number) {
    const index = userData.findIndex(u => u.id === id);
    if (index !== -1) userData.splice(index, 1);
  }

  static async me() {
    // Example: return the first user as the logged-in user
    return userData[0];
  }
}
