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
  TrendingUp,
  PenTool,
  GraduationCap,
  Briefcase,
  CheckCircle,
  BarChart3,
  DollarSign
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
      icon: PenTool,
      title: "Smart Resume Builder",
      description: "Create professional, ATS-friendly resumes in minutes with our AI-powered builder."
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
    },
    {
      icon: GraduationCap,
      title: "Placement Insights",
      description: "Real-time statistics and placement data from top colleges and companies."
    }
  ];

  const resources = [
    {
      icon: Briefcase,
      title: "Career Blog",
      description: "Expert articles on career development, trends, and workplace advice.",
      link: "/blog"
    },
    {
      icon: MessageSquare,
      title: "Interview Tips",
      description: "Comprehensive guides for behavioral, technical, and situational questions.",
      link: "/interview-tips"
    },
    {
      icon: DollarSign,
      title: "Salary Guide",
      description: "In-depth salary trends and market rates for top tech roles in India.",
      link: "/salary-guide"
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
              The all-in-one AI platform to optimize your resume, master interviews, and land your dream job faster than ever.
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
      <section className="py-20 px-6 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Powerful AI-Driven Tools
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to accelerate your career growth, all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to="/login">
                <Card className="glass-card hover-lift p-8 border-white/5 h-full cursor-pointer">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Preview Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Career Resources</h2>
              <p className="text-gray-400">Expert insights to guide your journey.</p>
            </div>
            <Link to="/login">
              <Button variant="outline" className="text-primary hover:text-white border-primary/20 hover:bg-primary/20">
                View All Resources <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {resources.map((resource, idx) => (
              <Link key={idx} to="/login">
                <Card className="glass-card p-6 h-full hover:bg-white/5 transition-colors border-white/5 cursor-pointer">
                  <resource.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{resource.title}</h3>
                  <p className="text-sm text-gray-400">{resource.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-black/40">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-2xl font-bold mx-auto border border-purple-500/30">1</div>
              <h3 className="text-xl font-semibold text-white">Create Profile</h3>
              <p className="text-gray-400">Sign up and build your profile or upload your existing resume.</p>
            </div>
            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-2xl font-bold mx-auto border border-blue-500/30">2</div>
              <h3 className="text-xl font-semibold text-white">Optimize & Learn</h3>
              <p className="text-gray-400">Use our AI tools to improve your resume and prepare for interviews.</p>
            </div>
            <div className="space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-2xl font-bold mx-auto border border-green-500/30">3</div>
              <h3 className="text-xl font-semibold text-white">Get Hired</h3>
              <p className="text-gray-400">Apply to matched jobs with confidence and land your dream role.</p>
            </div>
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
          <Card className="glass-card p-12 text-center space-y-6 neon-glow border-primary/30">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Ready to Transform Your Career?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of professionals who have accelerated their career growth with CareerCraft's AI-powered platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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