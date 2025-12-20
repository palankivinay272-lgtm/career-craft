import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Target, BookOpen, MessageSquare, BarChart3, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const quickStats = [
    { label: "Resumes Analyzed", value: "12", icon: BarChart3 },
    { label: "Job Matches", value: "47", icon: Target },
    { label: "Learning Progress", value: "68%", icon: BookOpen },
    { label: "Practice Sessions", value: "8", icon: Clock },
  ];

  const recentActivity = [
    { action: "Resume analyzed for Software Engineer position", time: "2 hours ago" },
    { action: "Completed JavaScript fundamentals module", time: "1 day ago" },
    { action: "New job match: Frontend Developer at TechCorp", time: "2 days ago" },
    { action: "Mock interview completed - 85% score", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Welcome back to CareerCraft
          </h1>
          <p className="text-muted-foreground text-lg">
            Your AI-powered career development dashboard
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="glass-card hover-lift p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-accent" />
              </div>
            </Card>
          ))}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resume Analyzer */}
          <Card className="glass-card hover-lift p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Upload className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Resume ATS Analyzer</h2>
              </div>
              <p className="text-muted-foreground">
                Upload your resume and job description to get an instant ATS compatibility score with actionable feedback.
              </p>
              <Link to="/analyzer">
                <Button variant="hero" className="w-full">
                  Analyze Resume
                </Button>
              </Link>
            </div>
          </Card>

          {/* Job Matching */}
          <Card className="glass-card hover-lift p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Target className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Smart Job Matching</h2>
              </div>
              <p className="text-muted-foreground">
                Discover personalized job opportunities that match your skills and career goals.
              </p>
              <Link to="/jobs">
                <Button variant="outline" className="w-full">
                  View Job Matches
                </Button>
              </Link>
            </div>
          </Card>

          {/* Learning Roadmap */}
          <Card className="glass-card hover-lift p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">AI Learning Roadmap</h2>
              </div>
              <p className="text-muted-foreground">
                Get personalized learning paths to bridge skill gaps and advance your career.
              </p>
              <Link to="/Roadmaps">
                <Button variant="outline" className="w-full">
                  View Roadmap
                </Button>
              </Link>
            </div>
          </Card>

          {/* Mock Interview */}
          <Card className="glass-card hover-lift p-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">Mock Interview</h2>
              </div>
              <p className="text-muted-foreground">
                Practice with AI-powered mock interviews tailored to your target roles.
              </p>
              <Link to="/interview">
                <Button variant="outline" className="w-full">
                  Start Interview
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <p className="text-sm">{activity.action}</p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;