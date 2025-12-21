import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  FileText,
  Loader2,
  Briefcase,
} from "lucide-react";
import { toast } from "sonner"; // Import toast

interface Result {
  score: number;
  missing: string[];
}

const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jdToSend);
    formData.append("email", email);

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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 grid md:grid-cols-2 gap-6 animate-in slide-in-from-right-4">

            {/* ATS CIRCLE */}
            <div className="flex flex-col items-center justify-center p-4 bg-black/20 rounded-xl border border-gray-800">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#1f2937"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke={
                      result.score >= 70
                        ? "#22c55e"
                        : result.score >= 40
                        ? "#facc15"
                        : "#ef4444"
                    }
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="440"
                    strokeDashoffset={
                      440 - (440 * result.score) / 100
                    }
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold text-white">
                    {result.score}%
                  </p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">
                    Match
                  </p>
                </div>
              </div>

              <p
                className={`mt-4 font-bold text-lg ${
                  result.score >= 70
                    ? "text-green-400"
                    : result.score >= 40
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {result.score >= 70
                  ? "Strong Match"
                  : result.score >= 40
                  ? "Moderate Match"
                  : "Low Match"}
              </p>
            </div>

            {/* REPORT */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-white border-b border-gray-800 pb-2">
                Analysis Report
              </h2>

              <div>
                <h3 className="text-red-400 text-sm font-semibold mb-3 flex items-center gap-2">
                  Missing Keywords
                </h3>

                {result.missing.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((k) => (
                      <span
                        key={k}
                        className="px-3 py-1 text-xs bg-red-500/10 border border-red-500/20 rounded-md text-red-300 font-mono"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-green-400 text-sm">No missing keywords found! Great job.</p>
                )}
              </div>

              <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl text-sm text-indigo-300 leading-relaxed">
                💡 <b>Tip:</b> Try to include these keywords naturally in your "Skills" or "Work Experience" sections to improve your ATS ranking.
              </div>
            </div>
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