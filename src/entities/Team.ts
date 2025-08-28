import teamData from '../../Entities/Team.json';

export class Team {
  static all() {
    return teamData;
  }

  static find(id: number) {
    return teamData.find(t => t.id === id);
  }

  static create(newTeam: any) {
    teamData.push(newTeam);
    return newTeam;
  }

  static update(id: number, updates: any) {
    const team = teamData.find(t => t.id === id);
    if (team) Object.assign(team, updates);
    return team;
  }

  static delete(id: number) {
    const index = teamData.findIndex(t => t.id === id);
    if (index !== -1) teamData.splice(index, 1);
  }
}
