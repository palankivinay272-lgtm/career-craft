import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Target, BookOpen, MessageSquare, BarChart3, Clock, PenTool, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import TeamSection from "@/components/TeamSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";

const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const uid = localStorage.getItem("uid");
      if (!uid) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8000/dashboard-stats/${uid}`);
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats", e);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const quickStats = [
    { label: "Resumes Analyzed", value: stats?.resumes_analyzed?.toString() || "0", icon: BarChart3 },
    { label: "Job Matches", value: "47", icon: Target }, // Placeholder until we have job match history
    { label: "Interview Score", value: stats?.avg_score ? `${stats.avg_score}%` : "0%", icon: BookOpen },
    { label: "Practice Sessions", value: stats?.practice_sessions?.toString() || "0", icon: Clock },
  ];

  const recentActivity = stats?.recent_activity || [];

  return (
    <div className="min-h-screen p-8 bg-black/50">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Welcome back to CareerCraft
          </h1>
          <p className="text-muted-foreground text-lg">
            Your AI-powered career development dashboard
          </p>
        </div>

        {/* 🏆 Gamification / Level Progress (Feature 4) */}
        {stats && (
          <Card className="glass-card p-8 border-white/10 relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Target size={100} className="text-yellow-500" />
            </div>

            <div className="relative z-10 flex items-center space-x-6">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-2xl font-bold text-black border-4 border-white/20">
                {stats.level || 1}
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-white">Level UE (User Experience) {stats.level || 1}</h3>
                    <p className="text-gray-400 text-sm">Keep analyzing resumes and practicing to level up!</p>
                  </div>
                  <span className="text-yellow-400 font-mono">{stats.xp || 0} XP</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 transition-all duration-1000"
                    style={{ width: `${stats.xp_progress || 0}%` }}
                  />
                </div>
                <p className="text-xs text-right text-gray-500">{stats.xp_progress || 0}% to next level</p>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {quickStats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift p-8 border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">
                    {loading ? "..." : stat.value}
                  </p>
                </div>
                <stat.icon className="h-8 w-8 text-purple-500" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Resume Analyzer */}
          <Card className="glass-card hover-lift p-8 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Upload className="h-8 w-8 text-purple-500" />
                <h2 className="text-2xl font-semibold text-white">Resume ATS Analyzer</h2>
              </div>
              <p className="text-gray-400">
                Upload your resume and job description to get an instant ATS compatibility score with actionable feedback.
              </p>
              <Link to="/analyzer">
                {/* ✅ FIXED: Now uses the same outline style as other buttons */}
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                  Analyze Resume
                </Button>
              </Link>
            </div>
          </Card>

          {/* Job Matching */}
          <Card className="glass-card hover-lift p-8 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-blue-400" />
                <h2 className="text-2xl font-semibold text-white">Smart Job Matching</h2>
              </div>
              <p className="text-gray-400">
                Discover personalized job opportunities that match your skills and career goals.
              </p>
              <Link to="/jobs">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                  View Job Matches
                </Button>
              </Link>
            </div>
          </Card>

          {/* Learning Roadmap */}
          <Card className="glass-card hover-lift p-8 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-green-400" />
                <h2 className="text-2xl font-semibold text-white">AI Learning Roadmap</h2>
              </div>
              <p className="text-gray-400">
                Get personalized learning paths to bridge skill gaps and advance your career.
              </p>
              <Link to="/roadmaps">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                  View Roadmap
                </Button>
              </Link>
            </div>
          </Card>

          {/* Mock Interview */}
          <Card className="glass-card hover-lift p-8 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-orange-400" />
                <h2 className="text-2xl font-semibold text-white">Mock Interview</h2>
              </div>
              <p className="text-gray-400">
                Practice with AI-powered mock interviews tailored to your target roles.
              </p>
              <Link to="/interview">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                  Start Interview
                </Button>
              </Link>
            </div>
          </Card>

          {/* NEW: Resume Builder */}
          <Card className="glass-card hover-lift p-8 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <PenTool className="h-8 w-8 text-cyan-400" />
                <h2 className="text-2xl font-semibold text-white">Smart Resume Builder</h2>
              </div>
              <p className="text-gray-400">
                Create a professional, ATS-friendly resume from scratch with our step-by-step wizard.
              </p>
              <Link to="/builder">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                  Build Resume
                </Button>
              </Link>
            </div>
          </Card>

          {/* NEW: Placements */}
          <Card className="glass-card hover-lift p-8 border-white/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-8 w-8 text-yellow-400" />
                <h2 className="text-2xl font-semibold text-white">Placement Insights</h2>
              </div>
              <p className="text-gray-400">
                View real-time placement statistics from top colleges and companies.
              </p>
              <Link to="/placements">
                <Button variant="outline" className="w-full border-white/10 hover:bg-white/5 hover:text-white">
                  View Placements
                </Button>
              </Link>
            </div>
          </Card>
        </div>


        {/* Recent Activity */}
        <Card className="glass-card p-8 border-white/10">
          <h3 className="text-xl font-semibold mb-4 text-white">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity yet. Start analyzing resumes!</p>
            ) : (
              recentActivity.map((activity: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <p className="text-sm text-gray-300">{activity.action}</p>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Extra Sections (Team, Reviews, FAQ) */}
        <div className="space-y-12">
          <TeamSection />
          <ReviewsSection />
          <FAQSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;