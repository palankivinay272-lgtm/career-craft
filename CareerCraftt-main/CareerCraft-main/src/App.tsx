import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom"; // No BrowserRouter

import Navigation from "./components/Navigation";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer"; // ✅ Import Footer

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatches from "./pages/JobMatches";
import Roadmaps from "./pages/Roadmaps";
import RoadmapDetail from "./pages/RoadmapDetail";
import Profile from "./pages/Profile";
import MockInterview from "./pages/MockInterview";
import Placements from "./pages/Placements";
import AdminPlacements from "./pages/Adminplacements";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeBuilder from "./pages/ResumeBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      {/* 🚀 Main Content */}
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            {/* --- PUBLIC ROUTES --- */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* --- PROTECTED ROUTES --- */}

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/analyzer"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <ResumeAnalyzer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/builder"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />

            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <JobMatches />
                </ProtectedRoute>
              }
            />

            <Route
              path="/placements"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Placements />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roadmaps"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Roadmaps />
                </ProtectedRoute>
              }
            />

            <Route
              path="/roadmap/:id"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <RoadmapDetail />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/interview"
              element={
                <ProtectedRoute>
                  <Navigation />
                  <MockInterview />
                </ProtectedRoute>
              }
            />

            {/* Admin Route */}
            <Route
              path="/admin"
              element={
                <>
                  <Navigation />
                  <AdminPlacements />
                </>
              }
            />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>

        {/* ✅ FOOTER ADDED HERE - Stays at bottom */}
        <Footer />
      </div>

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;