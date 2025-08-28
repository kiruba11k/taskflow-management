import teamMemberData from '../../Entities/TeamMember.json';

export class TeamMember {
  static all() {
    return teamMemberData;
  }

  static find(id: number) {
    return teamMemberData.find(m => m.id === id);
  }

  static create(newMember: any) {
    teamMemberData.push(newMember);
    return newMember;
  }

  static update(id: number, updates: any) {
    const member = teamMemberData.find(m => m.id === id);
    if (member) Object.assign(member, updates);
    return member;
  }

  static delete(id: number) {
    const index = teamMemberData.findIndex(m => m.id === id);
    if (index !== -1) teamMemberData.splice(index, 1);
  }

  static async me() {
    // Example: return the first member as the logged-in user
    return teamMemberData[0];
  }
}
