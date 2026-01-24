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
  PenTool,
  ChevronDown,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ IMPORTANT FIX: re-check auth on every route change
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin");
    const email = localStorage.getItem("email");
    setIsAdmin(admin === "true");
    setIsLoggedIn(!!email);
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminCollege");
    localStorage.removeItem("email");
    localStorage.removeItem("user");
    localStorage.removeItem("college");
    localStorage.removeItem("uid");
    setIsAdmin(false);
    setIsLoggedIn(false);
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  // Grouped Navigation Logic
  // Hide student features if on admin panel
  const isAdminPath = location.pathname.startsWith("/admin");
  const showStudentNav = !isAdmin && !isAdminPath;

  const navGroups = [
    { name: "Dashboard", path: isAdminPath ? "/admin" : "/dashboard", icon: Home },
    ...(showStudentNav ? [{
      name: "Resume Tools",
      icon: FileText,
      items: [
        { name: "Resume Analyzer", path: "/analyzer", icon: FileText },
        { name: "Resume Builder", path: "/builder", icon: PenTool },
      ]
    },
    {
      name: "Jobs & Placements",
      icon: Target,
      items: [
        { name: "Job Matches", path: "/jobs", icon: Target },
        { name: "Placements", path: "/placements", icon: GraduationCap },
      ]
    },
    {
      name: "Learn & Practice",
      icon: BookOpen,
      items: [
        { name: "Roadmaps", path: "/roadmaps", icon: BookOpen },
        { name: "Mock Interview", path: "/interview", icon: MessageSquare },
      ]
    }] : []),
    // Admin specific Profile/Logout handled in footer logic or separate button
  ];

  const resourceLinks = [
    { name: "Career Blog", path: "/blog", icon: FileText },
    { name: "Interview Tips", path: "/interview-tips", icon: MessageSquare },
    { name: "Salary Guide", path: "/salary-guide", icon: Target },
    { name: "Help Center", path: "/help", icon: BookOpen },
  ];



  return (
    <nav className="glass-card border-b border-border/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">
            {/* 👈 LEFT SIDE RESOURCES MENU */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2 text-muted-foreground hover:text-white">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] border-r border-white/10 bg-black/90 backdrop-blur-xl pt-10 overflow-y-auto">
                <SheetHeader>
                  <SheetTitle className="text-left text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
                    Menu
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-6">
                  {/* MAIN NAV */}
                  <div className="space-y-2">
                    {navGroups.map((group, idx) => {
                      if (group.items) {
                        return (
                          <div key={idx} className="space-y-1">
                            <h4 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                              {group.name}
                            </h4>
                            {group.items.map(subItem => (
                              <Link
                                key={subItem.path}
                                to={subItem.path}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(subItem.path)
                                  ? "bg-primary/20 text-primary"
                                  : "text-muted-foreground hover:text-white hover:bg-white/5"
                                  }`}
                                onClick={() => setIsMenuOpen(false)}
                              >
                                <subItem.icon className="h-4 w-4" />
                                <span className="font-medium text-sm">{subItem.name}</span>
                              </Link>
                            ))}
                          </div>
                        );
                      }
                      return (
                        <Link
                          key={group.path}
                          to={group.path!}
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(group.path!)
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                            }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <group.icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{group.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {/* DIVIDER */}
                  <div className="h-px bg-white/10 my-2" />

                  {/* RESOURCES */}
                  <div>
                    <h4 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Resources
                    </h4>
                    <div className="space-y-1">
                      {resourceLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-all duration-200 ${isActive(link.path)
                            ? "bg-primary/20 text-primary border border-primary/20"
                            : "text-muted-foreground hover:text-white hover:bg-white/5"
                            }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <link.icon className="h-4 w-4" />
                          <span className="font-medium text-sm">{link.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* LOGO */}
            <Link to={isLoggedIn ? "/dashboard" : "/"} className="flex items-center space-x-2 hover-bounce">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CareerCraft
              </span>
            </Link>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-6">
            {navGroups.map((group, idx) => {
              if (group.items) {
                // Dropdown Item
                return (
                  <DropdownMenu key={idx}>
                    <DropdownMenuTrigger className="flex items-center space-x-1 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 outline-none transition-all">
                      <group.icon className="h-4 w-4" />
                      <span className="text-sm font-medium">{group.name}</span>
                      <ChevronDown className="h-3 w-3 opacity-50" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black/90 border-white/10 backdrop-blur-xl">
                      {group.items.map(subItem => (
                        <DropdownMenuItem key={subItem.path} asChild>
                          <Link to={subItem.path} className="flex items-center cursor-pointer">
                            <subItem.icon className="h-4 w-4 mr-2" />
                            <span>{subItem.name}</span>
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )
              } else {
                // Single Item
                return (
                  <Link
                    key={group.path}
                    to={group.path!}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive(group.path!)
                      ? "bg-primary/20 text-primary neon-glow"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                  >
                    <group.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{group.name}</span>
                  </Link>
                )
              }
            })}

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

            {/* 👤 PROFILE (FOR LOGGED IN USERS) */}
            {isLoggedIn && (
              <Link
                to="/profile"
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${isActive("/profile")
                  ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
                  }`}
              >
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Profile</span>
              </Link>
            )}

            {/* 🚪 LOGOUT (FOR ALL USERS) */}
            {isLoggedIn && (
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
              {navGroups.map((group, idx) => {
                if (group.items) {
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        {group.name}
                      </div>
                      {group.items.map(subItem => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isActive(subItem.path)
                            ? "bg-primary/20 text-primary"
                            : "text-muted-foreground hover:bg-secondary/50"
                            }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <subItem.icon className="h-4 w-4" />
                          <span className="text-sm font-medium">{subItem.name}</span>
                        </Link>
                      ))}
                    </div>
                  )
                }
                return (
                  <Link
                    key={group.path}
                    to={group.path!}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${isActive(group.path!)
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-secondary/50"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <group.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{group.name}</span>
                  </Link>
                )
              })}

              {/* Mobile Logout */}
              {isLoggedIn && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-400 hover:text-red-500"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
