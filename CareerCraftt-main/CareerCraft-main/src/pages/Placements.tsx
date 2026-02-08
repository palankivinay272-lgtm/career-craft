import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Placement = {
  company: string;
  totalHires: number;
  domains: string[];
  roles: string[];
  eligibility?: string;
  deadline?: string;
  drive_date?: string;
};


export default function Placements() {
  const [college, setCollege] = useState(localStorage.getItem("college") || "");
  const [placementsData, setPlacementsData] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [studentProfile, setStudentProfile] = useState<any>(null);
  const [appliedDrives, setAppliedDrives] = useState<string[]>([]);



  useEffect(() => {
    // 🆕 Check if user has a stored college
    const storedCollege = localStorage.getItem("college");
    if (storedCollege) {
      setCollege(storedCollege);
    }

    // Load Student Profile
    import("@/lib/firebase").then(async ({ auth, db }) => {
      const { doc, getDoc } = await import("firebase/firestore");
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            const profileData = snap.data();
            console.log("👤 Student Profile Loaded:", profileData);
            setStudentProfile(profileData);
            if (profileData.college) {
              console.log("🏛️ Setting College from Profile:", profileData.college);
              setCollege(profileData.college);
              localStorage.setItem("college", profileData.college); // Sync back to localStorage
            }
          }
          setCheckingProfile(false);

          // 🆕 Fetch applied drives from backend for persistence
          try {
            console.log("📡 Fetching applications for:", user.uid);
            const appRes = await fetch(`http://localhost:8000/student/applications/${user.uid}`);
            const appData = await appRes.json();
            console.log("✅ Applied Drives:", appData);
            setAppliedDrives(appData);
          } catch (err) {
            console.error("Failed to load applied drives", err);
          }
        }
      });
    });
  }, []);

  useEffect(() => {
    const loadPlacements = async () => {
      if (!college) return;

      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:8000/placements/${encodeURIComponent(college)}`
        );
        const data = await res.json();
        setPlacementsData(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load placements data.");
        setPlacementsData([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlacements();
  }, [college]);

  const handleApply = async (company: string) => {
    import("@/lib/firebase").then(async ({ auth }) => {
      const user = auth.currentUser;
      if (!user) return toast.error("Please login to apply");

      try {
        const res = await fetch("http://localhost:8000/placements/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: user.uid,
            email: user.email,
            college: college,
            company: company
          })
        });
        const data = await res.json();
        if (data.success) {
          toast.success(data.message);
          setAppliedDrives([...appliedDrives, company]);
        } else {
          toast.error(data.error);
        }
      } catch (err) {
        toast.error("Failed to apply");
      }
    });
  };

  const checkEligibility = (eligibilityStr?: string) => {
    if (!eligibilityStr || !studentProfile) return { eligible: true, reason: "" };

    // Extract minimum CGPA from string (e.g., "7.5+ CGPA")
    const cgpaMatch = eligibilityStr.match(/(\d+(\.\d+)?)/);
    if (cgpaMatch && studentProfile.cgpa) {
      const minCgpa = parseFloat(cgpaMatch[1]);
      const studentCgpa = parseFloat(studentProfile.cgpa);
      if (studentCgpa < minCgpa) {
        return { eligible: false, reason: `Min ${minCgpa} CGPA required (You: ${studentCgpa})` };
      }
    }

    // Branch check (simple string search)
    if (studentProfile.branch && !eligibilityStr.toLowerCase().includes(studentProfile.branch.toLowerCase()) && eligibilityStr.toLowerCase().includes("branch")) {
      // Only warn if the eligibility string explicitly mentions specific branches
      // return { eligible: false, reason: `Branch not eligible` };
    }

    return { eligible: true, reason: "" };
  };

  return (
    <div className="p-8 text-white space-y-10">

      {/* COLLEGE TITLE */}
      <div className="max-w-xs space-y-2">
        <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
          <p className="text-sm text-gray-400">Viewing Insights for</p>
          <h2 className="text-xl font-bold text-white">{college}</h2>
        </div>
      </div>

      {/* LOADING STATES */}
      {(loading || checkingProfile) && <p className="text-white/60">Loading placement data...</p>}

      {!loading && !checkingProfile && !college && (
        <p className="text-white/60 bg-purple-500/5 p-4 rounded-lg border border-purple-500/10">
          📍 Please ensure your college is set in your Profile to view placement insights.
        </p>
      )}

      {!loading && !checkingProfile && college && placementsData.length === 0 && (
        <p className="text-white/60">
          No placement data available for "{college}".
        </p>
      )}

      {/* CHART */}
      {placementsData.length > 0 && (
        <Card className="bg-black/60 border border-white/10">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">
              Placements Overview
            </h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={placementsData}>
                  <XAxis dataKey="company" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="totalHires" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* COMPANY CARDS */}
      {placementsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placementsData.map((item) => (
            <Card key={item.company} className="bg-black/60 border border-white/10">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-cyan-400">
                  {item.company}
                </h2>

                <p className="mt-2 text-sm">
                  🎯 Jobs Offered:{" "}
                  <span className="text-purple-400 font-bold">
                    {item.totalHires}
                  </span>
                </p>

                <div className="mt-3 py-2 border-y border-white/5 space-y-1">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Eligibility</p>
                  <p className="text-sm text-gray-200">{item.eligibility || "Open for all"}</p>

                  <p className="text-[10px] text-red-400 uppercase font-bold mt-2">Deadline</p>
                  <p className="text-sm text-red-300 font-semibold">{item.deadline ? new Date(item.deadline).toLocaleDateString() : "Not set"}</p>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Expected Domains:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.domains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="bg-white/5 text-[10px]">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* APPLY BUTTON */}
                <div className="mt-6">
                  {appliedDrives.includes(item.company) ? (
                    <Button className="w-full bg-green-600/20 text-green-400 border border-green-600/50 cursor-default" disabled>
                      Applied Successfully ✅
                    </Button>
                  ) : (
                    (() => {
                      const { eligible, reason } = checkEligibility(item.eligibility);
                      return (
                        <div className="space-y-2">
                          <Button
                            className={`w-full ${eligible ? "bg-purple-600 hover:bg-purple-700" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
                            disabled={!eligible}
                            onClick={() => handleApply(item.company)}
                          >
                            {eligible ? "Register for Drive" : "Not Eligible"}
                          </Button>
                          {!eligible && <p className="text-[10px] text-red-500 text-center">{reason}</p>}
                        </div>
                      );
                    })()
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-sm text-white/70 mb-1">Job Roles:</p>
                  <ul className="list-disc list-inside text-sm">
                    {item.roles.map((role) => (
                      <li key={role}>{role}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
