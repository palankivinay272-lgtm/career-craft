import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, School, Users, GraduationCap, TrendingUp, Briefcase, Search, Plus, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

// --- TYPES ---
type Placement = {
  company: string;
  totalHires: number;
  domains: string[];
  roles: string[];
  eligibility?: string;
  deadline?: string;
  drive_date?: string;
};
type Job = { id?: string; role: string; company: string; skills: string; location: string; salary: string };
type User = { uid: string; email: string; college: string; role: string; lastLogin: any };

const COLLEGES = [
  "Anurag University",
  "BITS Pilani, Hyderabad Campus",
  "BV Raju Institute of Technology (BVRIT)",
  "Chaitanya Bharathi Institute of Technology (CBIT)",
  "Gokaraju Rangaraju Institute of Engineering and Technology (GRIET)",
  "IIIT Hyderabad",
  "IIT Bombay",
  "IIT Hyderabad",
  "Institute of Aeronautical Engineering (IARE)",
  "JNTU Hyderabad",
  "Mahindra University",
  "Mallareddy Engineering College",
  "Methodist College of Engineering and Technology",
  "Muffakham Jah College of Engineering and Technology",
  "Narayanamma Institute of Technology and Science",
  "National Institute of Technology (NIT) Trichy",
  "NIT Warangal",
  "Osmania University",
  "Sreenidhi Institute of Science and Technology (SNIST)",
  "University of Hyderabad (HCU)",
  "Vardhaman College of Engineering",
  "Vasavi College of Engineering",
  "VNR Vignana Jyothi Institute of Engineering and Technology",
  "Woxsen University",
];

export default function AdminPlacements() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"dashboard" | "jobs" | "students" | "drives">("dashboard");
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

  // Drive Management State
  const [newDrive, setNewDrive] = useState<Placement>({
    company: "",
    totalHires: 0,
    domains: [],
    roles: [],
    eligibility: "",
    deadline: "",
    drive_date: ""
  });
  const [selectedDriveApplicants, setSelectedDriveApplicants] = useState<any[]>([]);
  const [viewingApplicantsFor, setViewingApplicantsFor] = useState<string | null>(null);

  // 1. Initial Load
  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    const adminCollege = localStorage.getItem("adminCollege");

    if (isAdmin) {
      setLoggedIn(true);
      console.log("🏛️ Admin Auth Detected. College stored:", adminCollege);
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
      } else toast.error("Wrong credentials");
    } catch { toast.error("Login failed"); }
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

  const handlePostDrive = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newDrive, college })
      });
      if (res.ok) {
        toast.success("Drive posted successfully!");
        setNewDrive({ company: "", totalHires: 0, domains: [], roles: [], eligibility: "", deadline: "", drive_date: "" });
        loadPlacements();
      }
    } catch (err) { toast.error("Failed to post drive"); }
  };

  const loadApplicants = async (company: string) => {
    const res = await fetch(`http://127.0.0.1:8000/admin/applications/${college}/${company}`);
    const data = await res.json();
    setSelectedDriveApplicants(data);
    setViewingApplicantsFor(company);
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
            <TabButton active={activeTab === "drives"} onClick={() => setActiveTab("drives")} label="Manage Drives" icon={TrendingUp} />
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
                <CardHeader><CardTitle className="text-white text-lg">Active Drives & Applications</CardTitle></CardHeader>
                <CardContent className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {placements.map((p, i) => (
                    <div key={i} className="flex justify-between items-center p-3 bg-black/40 rounded-lg border border-white/5">
                      <div>
                        <p className="font-semibold text-white">{p.company}</p>
                        <p className="text-xs text-gray-400">Eligibility: {p.eligibility || "N/A"}</p>
                        <p className="text-xs text-cyan-400">Deadline: {p.deadline || "N/A"}</p>
                      </div>
                      <div className="text-right">
                        <Button variant="outline" size="sm" onClick={() => loadApplicants(p.company)} className="text-[10px] h-7">View Applicants</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* APPLICANT MODAL / OVERLAY */}
            {viewingApplicantsFor && (
              <Card className="bg-gray-900 border-purple-500/50 mt-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-white">Applicants for {viewingApplicantsFor}</CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setViewingApplicantsFor(null)}>Close</Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedDriveApplicants.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No applications yet.</p>
                    ) : (
                      selectedDriveApplicants.map((app, idx) => (
                        <div key={idx} className="flex justify-between p-2 bg-black/20 border border-white/5 rounded">
                          <span className="text-sm text-white">{app.email}</span>
                          <span className="text-xs text-green-400">{app.status || "Applied"}</span>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* === TAB 2: JOBS MANAGER === */}
        {activeTab === "jobs" && (
          <div className="flex justify-center">
            {/* ADD FORM */}
            <Card className="bg-white/5 border-white/10 h-fit w-full max-w-2xl">
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

            {/* JOBS LIST HIDDEN AS PER USER REQUEST */}
            {/* <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4"> ... </div> */}
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
        {/* === TAB 4: DRIVE MANAGEMENT === */}
        {activeTab === "drives" && (
          <div className="flex justify-center">
            <Card className="bg-white/5 border-white/10 h-fit w-full max-w-2xl">
              <CardHeader><CardTitle className="text-white text-lg flex items-center gap-2"><TrendingUp size={18} /> Plan Upcoming Drive</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Company Name" value={newDrive.company} onChange={e => setNewDrive({ ...newDrive, company: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                  <Input placeholder="Total Hires (Expected)" type="number" value={newDrive.totalHires} onChange={e => setNewDrive({ ...newDrive, totalHires: parseInt(e.target.value) || 0 })} className="bg-black/40 border-white/20 text-white" />
                </div>
                <Input placeholder="Roles (e.g. SDE-1, QA)" value={newDrive.roles.join(", ")} onChange={e => setNewDrive({ ...newDrive, roles: e.target.value.split(",").map(sx => sx.trim()) })} className="bg-black/40 border-white/20 text-white" />
                <Input placeholder="Domains (e.g. Web, Cloud)" value={newDrive.domains.join(", ")} onChange={e => setNewDrive({ ...newDrive, domains: e.target.value.split(",").map(sx => sx.trim()) })} className="bg-black/40 border-white/20 text-white" />

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase ml-1">Eligibility Criteria</label>
                    <Input placeholder="e.g. 7.5+ CGPA, No Backlogs" value={newDrive.eligibility} onChange={e => setNewDrive({ ...newDrive, eligibility: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-gray-500 uppercase ml-1">Reg. Deadline</label>
                    <Input type="date" value={newDrive.deadline} onChange={e => setNewDrive({ ...newDrive, deadline: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 uppercase ml-1">Drive Date</label>
                  <Input type="date" value={newDrive.drive_date} onChange={e => setNewDrive({ ...newDrive, drive_date: e.target.value })} className="bg-black/40 border-white/20 text-white" />
                </div>

                <Button onClick={handlePostDrive} className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 mt-4">Broadcast Drive to Students</Button>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div >
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
