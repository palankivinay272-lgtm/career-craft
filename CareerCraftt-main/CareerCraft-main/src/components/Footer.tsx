import { Link, useLocation } from "react-router-dom";
import { Sparkles, Github, Twitter, Linkedin, Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const location = useLocation();
  
  // 🙈 Only hide footer on Login and Signup pages (Removed "/" so it shows on Home)
  if (["/login", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-xl mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* 🌟 Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                CareerCraft
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Empowering careers with AI-driven insights. Build your resume, prepare for interviews, and land your dream job.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>

          {/* 🔗 Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <FooterLink to="/dashboard">Dashboard</FooterLink>
              <FooterLink to="/analyzer">Resume Analyzer</FooterLink>
              <FooterLink to="/jobs">Job Matcher</FooterLink>
              <FooterLink to="/roadmaps">Learning Roadmaps</FooterLink>
            </ul>
          </div>

          {/* 📚 Resources */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <FooterLink to="#">Career Blog</FooterLink>
              <FooterLink to="#">Interview Tips</FooterLink>
              <FooterLink to="#">Salary Guide</FooterLink>
              <FooterLink to="#">Help Center</FooterLink>
            </ul>
          </div>

          {/* 💌 Newsletter */}
          <div>
            <h3 className="text-white font-semibold mb-4">Stay Updated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get the latest career trends directly in your inbox.
            </p>
            <div className="flex gap-2">
              <Input 
                placeholder="Enter email" 
                className="bg-black/50 border-white/10 text-white focus:border-purple-500"
              />
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Mail size={16} />
              </Button>
            </div>
          </div>
        </div>

        {/* 👇 Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 CareerCraft. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Made with</span>
            <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
            {/* ✅ CHANGED TEXT HERE */}
            <span>by CareerCraft</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// ✨ Helper Components
const SocialIcon = ({ icon }: { icon: React.ReactNode }) => (
  <a href="#" className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-purple-500/20 hover:text-purple-400 transition-all">
    {icon}
  </a>
);

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <li>
    <Link to={to} className="hover:text-purple-400 transition-colors">
      {children}
    </Link>
  </li>
);

export default Footer;