import { useAuth } from "../context/AuthContext";
import GpaCard from "../components/dashboard/GpaCard";
import AverageGradeCard from "../components/dashboard/AverageGradeCard";
import StudyProgressCard from "../components/dashboard/StudyProgressCard";
import StudyStreakCard from "../components/dashboard/StudyStreakCard";
import SubjectPerformance from "../components/dashboard/SubjectPerformance";
import AiAdvice from "../components/dashboard/AiAdvice";
import GradeTrendChart from "../components/dashboard/GradeTrendChart";
import CalendarCard from "../components/dashboard/CalendarCard";
import TodaySchedule from "../components/dashboard/TodaySchedule";
import UpcomingDeadlines from "../components/dashboard/UpcomingDeadlines";
import ProgressBanner from "../components/dashboard/ProgressBanner";

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Good morning, {firstName} 👋</h1>
            <p className="mt-1 text-slate-500">Here's your academic overview. Keep going, you're doing great!</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GpaCard />
            <AverageGradeCard />
            <StudyProgressCard />
            <StudyStreakCard />
          </div>

          <SubjectPerformance />

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <AiAdvice />
            <GradeTrendChart />
          </div>
        </div>

        <div className="space-y-6">
          <CalendarCard />
          <TodaySchedule />
          <UpcomingDeadlines />
        </div>
      </div>

      <ProgressBanner />
    </div>
  );
}
