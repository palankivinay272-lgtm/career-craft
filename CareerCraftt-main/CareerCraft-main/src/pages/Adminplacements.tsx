import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, School, Users, GraduationCap, TrendingUp, Briefcase, Search, Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// --- TYPES ---
type Placement = { company: string; totalHires: number; domains: string[]; roles: string[] };
type Job = { id?: string; role: string; company: string; skills: string; location: string; salary: string };
type User = { uid: string; email: string; college: string; role: string; lastLogin: any };

const COLLEGES = [
  "ABC College", "XYZ University", "IIT Delhi", "IIT Bombay", "IIT Madras",
  "NIT Trichy", "NIT Warangal", "NIT Surathkal", "BITS Pilani", "VIT Vellore",
  "SRM University", "Amity University", "Anna University", "JNTU Hyderabad",
  "Osmania University", "Manipal University", "PES University", "Christ University",
  "Lovely Professional University", "SASTRA University", "Anurag University",
];

export default function AdminPlacements() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "jobs" | "students">("dashboard");
  const [loggedIn, setLoggedIn] = useState(false);

  // Auth State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Dashboard State
  const [college, setCollege] = useState("ABC College");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [placements, setPlacements] = useState<Placement[]>([]);

  // Jobs State
  const [jobs, setJobs] = useState<Job[]>([]);
  const [newJob, setNewJob] = useState<Job>({ role: "", company: "", skills: "", location: "Remote", salary: "" });

  // Students State
  const [students, setStudents] = useState<User[]>([]);

  // 1. Initial Load
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const adminCollege = localStorage.getItem("adminCollege");

    if (isAdmin) {
      setLoggedIn(true);
      if (adminCollege && adminCollege !== "SUPER_ADMIN") {
        setCollege(adminCollege);
        setIsSuperAdmin(false);
      } else {
        setIsSuperAdmin(true);
      }
    }
  }, []);

  // 2. Data Fetching based on Tab
  useEffect(() => {
    if (!loggedIn) return;

    if (activeTab === "dashboard") loadPlacements();
    if (activeTab === "jobs") loadJobs();
    if (activeTab === "students") loadStudents();

  }, [activeTab, loggedIn, college]);

  // --- ACTIONS ---
  const login = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminCollege", data.college);
        setLoggedIn(true);
        setCollege(data.college === "SUPER_ADMIN" ? "ABC College" : data.college);
        setIsSuperAdmin(data.college === "SUPER_ADMIN");
      } else alert("Wrong credentials");
    } catch { alert("Login failed"); }
  };

  const logout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminCollege");
    setLoggedIn(false);
    navigate("/");
  };

  // --- FETCHERS ---
  const loadPlacements = async () => {
    const res = await fetch(`http://127.0.0.1:8000/placements/${college}`);
    setPlacements(await res.json());
  };
  const loadJobs = async () => {
    const res = await fetch("http://127.0.0.1:8000/jobs");
    setJobs(await res.json());
  };
  const loadStudents = async () => {
    // If Super Admin, fetch all (or support filter if backend allows)
    // If College Admin, fetch only their students
    const url = isSuperAdmin
      ? "http://127.0.0.1:8000/admin/users"
      : `http://127.0.0.1:8000/admin/users?college=${encodeURIComponent(college)}`;

    const res = await fetch(url);
    setStudents(await res.json());
  };

  // --- HANDLERS ---
  const handlePostJob = async () => {
    await fetch("http://127.0.0.1:8000/admin/jobs", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newJob)
    });
    setNewJob({ role: "", company: "", skills: "", location: "Remote", salary: "" });
    loadJobs();
  };

  const handleDeleteJob = async (id: string) => {
    if (!id) return;
    await fetch(`http://127.0.0.1:8000/admin/jobs/${id}`, { method: "DELETE" });
    loadJobs();
  };

  // --- VIEW: LOGIN ---
  if (!loggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-full max-w-sm p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-md">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Admin Portal</h1>
          <Input placeholder="Username" className="bg-black/40 border-white/20 text-white mb-3" onChange={e => setUsername(e.target.value)} />
          <Input type="password" className="bg-black/40 border-white/20 text-white mb-6" placeholder="Password" onChange={e => setPassword(e.target.value)} />
          <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" onClick={login}>Access Dashboard</Button>
        </div>
      </div>
    );
  }

  // --- VIEW: DASHBOARD ---
  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
            Admin Console
          </h1>
          <div className="flex gap-2">
            <TabButton active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} label="Dashboard" icon={School} />
            <TabButton active={activeTab === "jobs"} onClick={() => setActiveTab("jobs")} label="Jobs Portal" icon={Briefcase} />
            <TabButton active={activeTab === "students"} onClick={() => setActiveTab("students")} label="Directory" icon={Users} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select value={college} disabled={!isSuperAdmin} onChange={(e) => setCollege(e.target.value)} className="bg-black text-white border border-white/20 rounded p-1 text-sm">
            {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <Button variant="ghost" size="icon" onClick={logout} className="text-red-400"><LogOut size={18} /></Button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="animate-in fade-in duration-500">

        {/* === TAB 1: DASHBOARD (Placements & Charts) === */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard title="Total Hires" value={placements.reduce((acc, p) => acc + p.totalHires, 0)} icon={TrendingUp} color="text-green-400" />
              <StatsCard title="Companies" value={placements.length} icon={Briefcase} color="text-blue-400" />
              <StatsCard title="Avg Package" value="₹12.5 LPA" icon={GraduationCap} color="text-yellow-400" />
              <StatsCard title="Placement %" value="92%" icon={Users} color="text-purple-400" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* CHART */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader><CardTitle className="text-white text-lg">Hiring Trends</CardTitle></CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={placements}>
                      <XAxis dataKey="company" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: "#111", border: "1px solid #333" }} />
                      <Bar dataKey="totalHires" fill="#8884d8" radius={[4, 4, 0, 0]}>
                        {placements.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#8b5cf6" : "#06b6d4"} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* PLACEMENT LIST */}
              <Card className="bg-white/5 border-white/10">
                <CardHeader><CardTitle className="text-white text-lg">Recent Placements</CardTitle></CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {placements.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                      <div>
                        <p className="font-semibold text-white">{p.company}</p>
                        <p className="text-xs text-gray-400">{p.roles.length} Roles • {p.domains.slice(0, 2).join(", ")}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-green-400">{p.totalHires}</span>
                        <p className="text-[10px] text-gray-500 uppercase">Hires</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* === TAB 2: JOBS MANAGER === */}
        {activeTab === "jobs" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ADD FORM */}
            <Card className="bg-white/5 border-white/10 h-fit">
              <CardHeader><CardTitle className="text-white text-lg flex items-center gap-2"><Plus size={18} /> Post New Job</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Job Role" value={newJob.role} onChange={e => setNewJob({ ...newJob, role: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                <Input placeholder="Company" value={newJob.company} onChange={e => setNewJob({ ...newJob, company: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                <Input placeholder="Skills (comma sep)" value={newJob.skills} onChange={e => setNewJob({ ...newJob, skills: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                <Input placeholder="Location" value={newJob.location} onChange={e => setNewJob({ ...newJob, location: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                <Input placeholder="Salary Range" value={newJob.salary} onChange={e => setNewJob({ ...newJob, salary: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                <Button onClick={handlePostJob} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500">Post Job</Button>
              </CardContent>
            </Card>

            {/* JOBS LIST */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              {jobs.map((job, i) => (
                <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between group hover:border-purple-500/30 transition">
                  <div>
                    <h3 className="font-bold text-white text-lg">{job.role}</h3>
                    <p className="text-sm text-cyan-400">{job.company}</p>
                    <p className="text-xs text-gray-400 mt-2">{job.location} • {job.salary}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {job.skills.split(" ").slice(0, 3).map(s => <span key={s} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300">{s}</span>)}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteJob(job.id || "")} className="text-red-400 opacity-0 group-hover:opacity-100 transition"><Trash2 size={18} /></Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* === TAB 3: STUDENT DIRECTORY === */}
        {activeTab === "students" && (
          <Card className="bg-white/5 border-white/10">
            <CardHeader><CardTitle className="text-white text-lg flex items-center justify-between">
              <span>Registered Students</span>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 text-gray-400" size={14} />
                <Input placeholder="Search students..." className="pl-8 bg-black/40 border-white/20 h-9 text-sm text-white" />
              </div>
            </CardTitle></CardHeader>
            <CardContent>
              <div className="rounded-lg border border-white/10 overflow-hidden">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs uppercase bg-black/40 text-gray-200">
                    <tr>
                      <th className="px-6 py-3">Student</th>
                      <th className="px-6 py-3">College</th>
                      <th className="px-6 py-3">Role</th>
                      <th className="px-6 py-3">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition">
                        <td className="px-6 py-4 font-medium text-white">{s.email}</td>
                        <td className="px-6 py-4">{s.college}</td>
                        <td className="px-6 py-4"><span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">{s.role}</span></td>
                        <td className="px-6 py-4">{s.lastLogin ? new Date(s.lastLogin * 1000).toLocaleDateString() : "Never"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}

// --- SUBCOMPONENTS ---
const TabButton = ({ active, onClick, label, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${active ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}
  >
    <Icon size={16} /> {label}
  </button>
);

const StatsCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center gap-4">
    <div className={`p-3 rounded-lg bg-black/30 ${color}`}><Icon size={20} /></div>
    <div>
      <h3 className="text-xl font-bold text-white">{value}</h3>
      <p className="text-xs text-gray-400 uppercase tracking-wide">{title}</p>
    </div>
  </div>
);
