import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Home,
  FileText,
  Target,
  BookOpen,
  MessageSquare,
  User,
  Menu,
  X,
  Sparkles,
  GraduationCap,
  Shield,
  LogOut,
} from "lucide-react";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // ✅ IMPORTANT FIX: re-check admin on every route change
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin");
    setIsAdmin(admin === "true");
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("isAdmin");
    setIsAdmin(false);
    navigate("/dashboard");
  };

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "Resume Analyzer", path: "/analyzer", icon: FileText },
    { name: "Job Matches", path: "/jobs", icon: Target },
    { name: "Placements", path: "/placements", icon: GraduationCap },
    { name: "Roadmaps", path: "/roadmaps", icon: BookOpen },
    { name: "Mock Interview", path: "/interview", icon: MessageSquare },
    { name: "Profile", path: "/profile", icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="glass-card border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center space-x-2 hover-bounce">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CareerCraft
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isActive(item.path)
                    ? "bg-primary/20 text-primary neon-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            ))}

            {/* 🛡️ ADMIN BUTTON (ONLY FOR ADMIN) */}
            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
              >
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Admin</span>
              </Link>
            )}

            {/* 🚪 LOGOUT (ONLY FOR ADMIN) */}
            {isAdmin && (
              <Button
                variant="ghost"
                className="text-red-400 hover:text-red-500"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* MOBILE NAVIGATION */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-border/30">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive(item.path)
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}

              {/* ADMIN + LOGOUT (MOBILE) */}
              {isAdmin && (
                <>
                  <Link
                    to="/admin"
                    className="flex items-center space-x-3 px-3 py-3 rounded-lg text-yellow-400"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-5 w-5" />
                    <span className="font-medium">Admin</span>
                  </Link>

                  <Button
                    variant="ghost"
                    className="justify-start text-red-400"
                    onClick={logout}
                  >
                    <LogOut className="h-5 w-5 mr-2" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
