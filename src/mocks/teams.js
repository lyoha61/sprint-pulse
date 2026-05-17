export const teams = [
  {
    id: 1,
    name: "Команда Alpha",
    members: [
      {
        id: 101,
        name: "Александр Иванов",
        role: "Frontend Developer",
        avatar: "https://via.placeholder.com/40",
        velocity: 8.5,
        tasksCompleted: 12,
        tasksInProgress: 2
      },
      {
        id: 102,
        name: "Мария Петрова",
        role: "UI/UX Designer",
        avatar: "https://via.placeholder.com/40",
        velocity: 6.2,
        tasksCompleted: 9,
        tasksInProgress: 3
      },
      {
        id: 103,
        name: "Дмитрий Сидоров",
        role: "Backend Developer",
        avatar: "https://via.placeholder.com/40",
        velocity: 12.1,
        tasksCompleted: 15,
        tasksInProgress: 1
      },
      {
        id: 104,
        name: "Елена Козлова",
        role: "QA Engineer",
        avatar: "https://via.placeholder.com/40",
        velocity: 5.3,
        tasksCompleted: 7,
        tasksInProgress: 4
      },
      {
        id: 105,
        name: "Иван Смирнов",
        role: "DevOps Engineer",
        avatar: "https://via.placeholder.com/40",
        velocity: 9.7,
        tasksCompleted: 11,
        tasksInProgress: 2
      }
    ],
    metrics: {
      averageVelocity: 8.4,
      sprintGoalAchievement: 75,
      burndownRate: 0.8
    }
  }
];

export const getTeamById = (id) => teams.find(team => team.id === id);

export const getTeamMemberById = (teamId, memberId) => {
  const team = getTeamById(teamId);
  return team ? team.members.find(member => member.id === memberId) : null;
};