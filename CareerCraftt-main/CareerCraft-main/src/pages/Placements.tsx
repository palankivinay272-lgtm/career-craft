import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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

export default function Placements() {
  const [college, setCollege] = useState("ABC College");
  const [placementsData, setPlacementsData] = useState<Placement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPlacements = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/placements/${college}`
        );
        const data = await res.json();
        setPlacementsData(data);
      } catch (error) {
        console.error(error);
        setPlacementsData([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlacements();
  }, [college]);

  return (
    <div className="p-8 text-white space-y-10">

      {/* TITLE */}
      <div>
        <h1 className="text-3xl font-bold text-purple-400">
          College Placements
        </h1>
        <p className="text-white/60">Company-wise placement insights</p>
      </div>

      {/* COLLEGE SELECT */}
      <div className="max-w-xs">
        <Select value={college} onValueChange={setCollege}>
          <SelectTrigger>
            <SelectValue placeholder="Select College" />
          </SelectTrigger>
          <SelectContent>
            {COLLEGES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading && <p className="text-white/60">Loading placement data...</p>}

      {!loading && placementsData.length === 0 && (
        <p className="text-white/60">
          No placement data available for this college.
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

                <div className="mt-4">
                  <p className="text-sm text-white/70 mb-1">Expected Domains:</p>
                  <div className="flex flex-wrap gap-2">
                    {item.domains.map((domain) => (
                      <Badge key={domain} variant="secondary">
                        {domain}
                      </Badge>
                    ))}
                  </div>
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
