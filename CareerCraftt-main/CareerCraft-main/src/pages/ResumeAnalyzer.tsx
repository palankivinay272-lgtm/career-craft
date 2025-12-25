import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  FileText,
  Loader2,
  Briefcase,
  History,
  Download
} from "lucide-react";
import { toast } from "sonner"; // Import toast
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface Result {
  score: number;
  missing: string[];
  suggestions: string[];
}

interface HistoryItem {
  score: number;
  date: string;
  job_role: string;
}

const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch History on Mount
  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (uid) {
      fetch(`http://127.0.0.1:8000/analysis-history/${uid}`)
        .then(res => res.json())
        .then(data => setHistory(data.reverse())) // Reverse for chart (oldest first)
        .catch(err => console.error(err));
    }
  }, [result]); // Refresh when result changes

  const handlePrint = () => {
    window.print();
  };

  /* ================= FILE UPLOAD ================= */

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    if (f.type !== "application/pdf") {
      alert("Please upload a PDF file");
      return;
    }

    setFile(f);
    // Note: We don't set 'resumeUploaded' here anymore. 
    // We wait until it is successfully sent to the backend.
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= BACKEND CALL ================= */

  const analyzeResume = async () => {
    if (!file) {
      toast.error("Please upload a resume first.");
      return;
    }

    // Default JD if none provided (allows uploading resume without analysis)
    const jdToSend = jobDescription.trim() || "General software engineering role";

    setLoading(true);

    // 👇 FIXED: Use "email" to match Login.tsx
    const email = localStorage.getItem("email") || "demo@user.com";
    const uid = localStorage.getItem("uid") || "demo-uid";

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jdToSend);
    formData.append("email", email);
    formData.append("uid", uid);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/analyze-resume",
        { method: "POST", body: formData }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();

      // Mark as uploaded so Job Matches knows
      localStorage.setItem("resumeUploaded", "true");
      toast.success("Resume uploaded & analyzed successfully!");

      setResult({
        score: data.ats_score,
        missing: data.missing_keywords || [],
        suggestions: data.suggestions || [],
      });
    } catch (err) {
      console.error(err);
      toast.error("Server error. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">

        {/* LEFT PANEL */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">

          <h1 className="text-2xl font-bold text-indigo-400">
            Resume Analyzer
          </h1>

          {/* UPLOAD */}
          <div>
            <h3 className="text-sm uppercase text-indigo-400 mb-2">
              1. Upload Resume (PDF)
            </h3>

            <div
              className="border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-indigo-500 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileUpload}
              />

              {file ? (
                <div className="flex items-center gap-3 text-green-400 justify-center">
                  <FileText />
                  <span className="font-medium">{file.name}</span>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <UploadCloud className="mx-auto text-indigo-400 h-10 w-10" />
                  <p className="text-gray-400">Click to upload PDF</p>
                </div>
              )}
            </div>

            {file && (
              <Button
                variant="ghost"
                className="text-red-400 mt-2 h-8 text-xs hover:text-red-300 hover:bg-red-900/20"
                onClick={clearFile}
              >
                Remove File
              </Button>
            )}
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <h3 className="text-sm uppercase text-indigo-400 mb-2">
              <Briefcase size={14} className="inline mr-2" />
              2. Job Description (Optional)
            </h3>

            <Textarea
              className="min-h-[160px] bg-black/50 border-gray-700 text-gray-300 focus:border-indigo-500"
              placeholder="Paste job description here to check ATS score..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <Button
            onClick={analyzeResume}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg font-semibold shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Processing...
              </span>
            ) : (
              "Upload & Check Score"
            )}
          </Button>
        </div>

        {/* RIGHT PANEL (RESULTS) */}
        {result ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-8 animate-in slide-in-from-right-4 print:border-none print:shadow-none">

            {/* HEADER & DOWNLOAD */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-white print:text-black">Analysis Report</h2>
                <p className="text-sm text-gray-400 print:text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
              </div>
              <Button variant="outline" size="sm" onClick={handlePrint} className="print:hidden border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-400">
                <Download size={16} className="mr-2" /> Download
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* 1. RADAR CHART */}
              <div className="h-[250px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={[
                    { subject: 'Keywords', A: result.score, fullMark: 100 },
                    { subject: 'Structure', A: Math.max(100 - (result.suggestions.filter(s => s.includes("section")).length * 25), 50), fullMark: 100 },
                    { subject: 'Impact', A: Math.max(100 - (result.suggestions.filter(s => s.includes("verbs")).length * 20), 40), fullMark: 100 },
                    { subject: 'Formatting', A: Math.max(100 - (result.suggestions.filter(s => s.includes("Missing")).length * 30), 60), fullMark: 100 },
                    { subject: 'Relevance', A: result.score, fullMark: 100 },
                  ]}>
                    <PolarGrid stroke="#374151" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="My Resume" dataKey="A" stroke="#818cf8" fill="#818cf8" fillOpacity={0.3} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', color: '#fff' }} itemStyle={{ color: '#818cf8' }} />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center mt-20">
                    <p className="text-3xl font-bold text-white drop-shadow-lg">{result.score}%</p>
                  </div>
                </div>
              </div>

              {/* 2. TEXT REPORT */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-red-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    🚫 Missing Keywords
                  </h3>
                  {result.missing.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {result.missing.map((k) => (
                        <span key={k} className="px-2 py-1 text-xs bg-red-950/30 border border-red-500/20 rounded text-red-300 font-mono">
                          {k}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-green-400 text-xs">All keywords matched!</p>
                  )}
                </div>

                <div>
                  <h3 className="text-yellow-400 text-sm font-semibold mb-2 flex items-center gap-2">
                    💡 Professional Tips
                  </h3>
                  <div className="space-y-2">
                    {result.suggestions.length > 0 ? (
                      result.suggestions.map((s, i) => (
                        <div key={i} className="flex gap-2 text-xs text-gray-300 bg-gray-800/30 p-2 rounded border border-gray-700/50">
                          <span>•</span>
                          <span>{s}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-green-400 text-xs">Perfect structure!</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. HISTORY CHART */}
            {history.length > 1 && (
              <div className="pt-6 border-t border-gray-800 print:hidden">
                <h3 className="text-indigo-400 text-sm font-bold mb-4 flex items-center gap-2">
                  <History size={16} /> Progress History
                </h3>
                <div className="h-[200px] w-full bg-black/20 rounded-xl border border-gray-800 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#6B7280' }} tickFormatter={(val) => val.split(' ')[0]} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#6B7280' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', borderColor: '#374151' }}
                        labelStyle={{ color: '#9CA3AF', fontSize: '12px' }}
                      />
                      <Area type="monotone" dataKey="score" stroke="#818cf8" fillOpacity={1} fill="url(#colorScore)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

          </div>
        ) : (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-500 p-10 bg-gray-900/50">
            <div className="bg-gray-800 p-4 rounded-full mb-4">
              <UploadCloud size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium">Ready to scan</p>
            <p className="text-sm text-gray-600 mt-2">Upload a resume to see your score and unlock Job Matches.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;