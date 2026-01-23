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
import TeamSection from "@/components/TeamSection";
import ReviewsSection from "@/components/ReviewsSection";
import FAQSection from "@/components/FAQSection";

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
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-pulse-slow">
                <Sparkles className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
              Craft Your <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                Future Career
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              The all-in-one AI platform to optimize your resume, master interviews, and
              land your dream job faster than ever.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            {/* Primary CTA */}
            <Link to="/login">
              <Button className="h-12 px-8 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-medium hover-lift transition-all duration-300">
                Get Started Free
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>

            {/* Secondary CTA */}
            <Link to="/login">
              <Button variant="outline" className="h-12 px-8 rounded-full border-gray-800 bg-black/40 hover:bg-gray-900 text-gray-200 font-medium hover-lift transition-all duration-300">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-400" />
                Try AI Tools
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

      {/* New Sections */}
      <TeamSection />
      <ReviewsSection />
      <FAQSection />

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