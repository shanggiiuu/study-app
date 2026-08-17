import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import PlaceholderPage from "./pages/PlaceholderPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/grades" element={<PlaceholderPage title="My Grades" phase="Phase 2 — Academic Core" />} />
            <Route path="/subjects" element={<PlaceholderPage title="Subjects" phase="Phase 2 — Academic Core" />} />
            <Route path="/assignments" element={<PlaceholderPage title="Assignments" phase="Phase 2 — Academic Core" />} />
            <Route path="/exams" element={<PlaceholderPage title="Exams" phase="Phase 2 — Academic Core" />} />
            <Route path="/progress" element={<PlaceholderPage title="Progress" phase="Phase 3 — Dashboard" />} />
            <Route path="/advice" element={<PlaceholderPage title="Advice AI" phase="Phase 5 — Intelligence" />} />
            <Route path="/goals" element={<PlaceholderPage title="Goals" phase="Phase 4 — Productivity" />} />
            <Route path="/calendar" element={<PlaceholderPage title="Calendar" phase="Phase 3 — Dashboard" />} />
            <Route path="/notes" element={<PlaceholderPage title="Notes" phase="Phase 4 — Productivity" />} />
            <Route path="/documents" element={<PlaceholderPage title="Documents" phase="Phase 4 — Productivity" />} />
            <Route path="/flashcards" element={<PlaceholderPage title="Flashcards" phase="Phase 4 — Productivity" />} />
            <Route path="/study-timer" element={<PlaceholderPage title="Study Timer" phase="Phase 4 — Productivity" />} />
            <Route path="/settings" element={<PlaceholderPage title="Settings" phase="Phase 6 — Polish" />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
