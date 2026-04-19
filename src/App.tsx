import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ExerciseDetail from "./pages/ExerciseDetail";
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import AdminMembers from "./pages/AdminMembers";
import AdminContent from "./pages/AdminContent";
import AdminExerciseItems from "./pages/AdminExerciseItems";
import AdminMessages from "./pages/AdminMessages";
import AdminNotifications from "./pages/AdminNotifications";
import MemberPortal from "./pages/MemberPortal";
import { AppErrorBoundary } from "./components/AppErrorBoundary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppErrorBoundary>
            <Routes>
              <Route
                path="/"
                element={
                  <LanguageProvider>
                    <Index />
                  </LanguageProvider>
                }
              />
              <Route
                path="/exercises/:id"
                element={
                  <LanguageProvider>
                    <ExerciseDetail />
                  </LanguageProvider>
                }
              />
              <Route
                path="/member"
                element={
                  <LanguageProvider>
                    <MemberPortal />
                  </LanguageProvider>
                }
              />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="members" element={<AdminMembers />} />
                <Route path="content" element={<AdminContent />} />
                <Route path="exercises" element={<AdminExerciseItems />} />
                <Route path="messages" element={<AdminMessages />} />
                <Route path="notifications" element={<AdminNotifications />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
