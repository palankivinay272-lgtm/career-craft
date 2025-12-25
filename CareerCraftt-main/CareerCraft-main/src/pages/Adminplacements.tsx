import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type Placement = {
  company: string;
  totalHires: number;
  domains: string[];
  roles: string[];
};

const COLLEGES = [
  "ABC College",
  "XYZ University",
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "NIT Trichy",
  "NIT Warangal",
  "NIT Surathkal",
  "BITS Pilani",
  "VIT Vellore",
  "SRM University",
  "Amity University",
  "Anna University",
  "JNTU Hyderabad",
  "Osmania University",
  "Manipal University",
  "PES University",
  "Christ University",
  "Lovely Professional University",
  "SASTRA University",
];

export default function AdminPlacements() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // 🔑 FIX: college is now editable but locked for specific admins
  const [college, setCollege] = useState("ABC College");
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  const [company, setCompany] = useState("");
  const [totalHires, setTotalHires] = useState(0);
  const [domains, setDomains] = useState("");
  const [roles, setRoles] = useState("");
  const [placements, setPlacements] = useState<Placement[]>([]);

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

  // 🔄 Reload placements when college changes
  useEffect(() => {
    if (loggedIn) loadPlacements();
  }, [college, loggedIn]);

  const login = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminCollege", data.college); // Store the college

        setLoggedIn(true);
        if (data.college !== "SUPER_ADMIN") {
          setCollege(data.college);
          setIsSuperAdmin(false);
        } else {
          setIsSuperAdmin(true);
        }
      } else {
        alert("Wrong credentials");
      }
    } catch (err) {
      console.error(err);
      alert("Login failed");
    }
  };

  const loadPlacements = async () => {
    const res = await fetch(
      `http://127.0.0.1:8000/placements/${college}`
    );
    setPlacements(await res.json());
  };

  const addPlacement = async () => {
    if (!company || !totalHires) {
      alert("Please enter Company and Hires");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/admin/placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          college,
          company,
          totalHires,
          domains: domains.split(",").map(d => d.trim()),
          roles: roles.split(",").map(r => r.trim()),
        }),
      });

      if (res.ok) {
        alert("Placement added successfully!");
        // Clear inputs
        setCompany("");
        setTotalHires(0);
        setDomains("");
        setRoles("");
        loadPlacements();
      } else {
        alert("Failed to add placement");
      }
    } catch (e) {
      console.error(e);
      alert("Error connecting to server");
    }
  };

  const deletePlacement = async (i: number) => {
    await fetch(
      `http://127.0.0.1:8000/admin/placements/${college}/${i}`,
      { method: "DELETE" }
    );
    loadPlacements();
  };

  if (!loggedIn) {
    return (
      <div className="p-8 max-w-sm text-white">
        <h1 className="text-2xl mb-4">Admin Login</h1>
        <Input placeholder="Username" onChange={e => setUsername(e.target.value)} />
        <Input
          type="password"
          className="mt-3"
          placeholder="Password"
          onChange={e => setPassword(e.target.value)}
        />
        <Button className="mt-4 w-full" onClick={login}>
          Login
        </Button>
      </div>
    );
  }

  return (
    <div className="p-8 text-white space-y-4">
      <h1 className="text-3xl text-purple-400">Admin Panel</h1>

      {/* 🏫 COLLEGE SELECTOR */}
      {/* 🏫 COLLEGE SELECTOR */}
      <select
        value={college}
        disabled={!isSuperAdmin}
        onChange={(e) => setCollege(e.target.value)}
        className={`w-full p-2 bg-black border border-white/20 rounded ${!isSuperAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {COLLEGES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {/* ➕ ADD PLACEMENT */}
      <Card className="bg-black/60">
        <CardContent className="space-y-2 p-4">
          <Input placeholder="Company" onChange={e => setCompany(e.target.value)} />
          <Input type="number" placeholder="Total Hires"
            onChange={e => setTotalHires(+e.target.value)} />
          <Input placeholder="Domains (comma separated)"
            onChange={e => setDomains(e.target.value)} />
          <Input placeholder="Roles (comma separated)"
            onChange={e => setRoles(e.target.value)} />
          <Button onClick={addPlacement}>Add Placement</Button>
        </CardContent>
      </Card>

      {/* 📋 LIST */}
      {placements.map((p, i) => (
        <Card key={i} className="bg-black/60">
          <CardContent className="flex justify-between p-4">
            <div>{p.company} ({p.totalHires})</div>
            <Button
              variant="destructive"
              onClick={() => deletePlacement(i)}
            >
              Delete
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
