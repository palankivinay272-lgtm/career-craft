import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";

import Navigation from "./components/Navigation";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import ResumeAnalyzer from "./pages/ResumeAnalyzer";
import JobMatches from "./pages/JobMatches";
import Roadmaps from "./pages/Roadmaps";
import RoadmapDetail from "./pages/RoadmapDetail";
import Profile from "./pages/Profile";
import MockInterview from "./pages/MockInterview";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navigation />
              <Dashboard />
            </>
          }
        />

        {/* Resume Analyzer */}
        <Route
          path="/analyzer"
          element={
            <>
              <Navigation />
              <ResumeAnalyzer />
            </>
          }
        />

        {/* Job Matches */}
        <Route
          path="/jobs"
          element={
            <>
              <Navigation />
              <JobMatches />
            </>
          }
        />

        {/* ✅ ROADMAPS PAGE */}
        <Route
          path="/roadmaps"
          element={
            <>
              <Navigation />
              <Roadmaps />
            </>
          }
        />

        {/* ✅ ROADMAP DETAILS PAGE */}
        <Route
          path="/roadmap/:id"
          element={
            <>
              <Navigation />
              <RoadmapDetail />
            </>
          }
        />

        {/* Profile */}
        <Route
          path="/profile"
          element={
            <>
              <Navigation />
              <Profile />
            </>
          }
        />

        {/* Mock Interview */}
        <Route
          path="/interview"
          element={
            <>
              <Navigation />
              <MockInterview />
            </>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
