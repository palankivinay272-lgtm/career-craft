import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  FileText, 
  Target, 
  BookOpen, 
  MessageSquare, 
  ArrowRight,
  Star,
  Users,
  TrendingUp
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: FileText,
      title: "Resume ATS Analyzer",
      description: "Get instant compatibility scores and actionable feedback to optimize your resume for any job."
    },
    {
      icon: Target,
      title: "Smart Job Matching",
      description: "AI-powered job recommendations tailored to your skills, experience, and career goals."
    },
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description: "Custom learning roadmaps to bridge skill gaps and accelerate your career growth."
    },
    {
      icon: MessageSquare,
      title: "Mock Interviews",
      description: "Practice with AI-driven mock interviews designed for your target roles and industries."
    }
  ];

  const stats = [
    { number: "50K+", label: "Resumes Analyzed" },
    { number: "15K+", label: "Jobs Matched" },
    { number: "98%", label: "User Satisfaction" },
    { number: "500+", label: "Companies" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center neon-glow">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent leading-tight">
              Craft Your Career with AI
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your career journey with AI-powered tools for resume optimization, 
              job matching, skill development, and interview preparation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* UPDATED LINK: Now points to /login instead of /dashboard */}
            <Link to="/login">
              <Button variant="hero" size="lg" className="min-w-[200px] hover-bounce">
                Get Started Free
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            {/* This one can stay as /analyzer, or you can change it to /login if you want to protect it too */}
            <Link to="/analyzer">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Try Resume Analyzer
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.number}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful AI-Driven Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to accelerate your career growth and land your dream job.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="glass-card hover-lift p-8">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-12 text-center space-y-6 neon-glow">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their career growth with CareerCraft's AI-powered platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* UPDATED LINK: Now points to /login */}
              <Link to="/login">
                <Button variant="hero" size="lg" className="min-w-[200px]">
                  Start Your Journey
                  <Star className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Index;