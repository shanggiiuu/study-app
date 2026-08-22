export interface User {
  id: number;
  name: string;
  email: string;
  school: string | null;
  gradeLevel: string | null;
  graduationYear: number | null;
  profilePictureUrl: string | null;
  weeklyStudyGoalMinutes: number | null;
  theme: "light" | "dark";
}
