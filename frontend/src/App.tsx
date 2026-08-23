import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import SubjectsPage from "./pages/SubjectsPage";
import GradesPage from "./pages/GradesPage";
import AssignmentsPage from "./pages/AssignmentsPage";
import ExamsPage from "./pages/ExamsPage";
import CalendarPage from "./pages/CalendarPage";
import ProgressPage from "./pages/ProgressPage";
import GoalsPage from "./pages/GoalsPage";
import NotesPage from "./pages/NotesPage";
import DocumentsPage from "./pages/DocumentsPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";
import StudyTimerPage from "./pages/StudyTimerPage";
import AdvicePage from "./pages/AdvicePage";
import AchievementsPage from "./pages/AchievementsPage";

export default function App() {
  return <BrowserRouter><AuthProvider><Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
    <Route path="/reset-password" element={<ResetPasswordPage />} />
    <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/grades" element={<GradesPage />} />
      <Route path="/subjects" element={<SubjectsPage />} />
      <Route path="/assignments" element={<AssignmentsPage />} />
      <Route path="/exams" element={<ExamsPage />} />
      <Route path="/progress" element={<ProgressPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/goals" element={<GoalsPage />} />
      <Route path="/notes" element={<NotesPage />} />
      <Route path="/documents" element={<DocumentsPage />} />
      <Route path="/flashcards" element={<FlashcardsPage />} />
      <Route path="/quizzes" element={<QuizPage />} />
      <Route path="/study-timer" element={<StudyTimerPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/advice" element={<AdvicePage />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Route>
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></AuthProvider></BrowserRouter>;
}
