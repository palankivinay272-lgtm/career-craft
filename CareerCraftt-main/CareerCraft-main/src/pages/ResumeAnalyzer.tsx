import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  UploadCloud,
  FileText,
  Loader2,
  Briefcase,
} from "lucide-react";

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
    localStorage.setItem("resumeUploaded", "true");
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    localStorage.removeItem("resumeUploaded");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ================= BACKEND CALL ================= */

  const analyzeResume = async () => {
    if (!file || !jobDescription.trim()) {
      alert("Upload resume & paste job description");
      return;
    }

    setLoading(true);

    const email =
      localStorage.getItem("userEmail") || "demo@user.com";

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);
    formData.append("email", email);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/analyze-resume",
        { method: "POST", body: formData }
      );

      const data = await res.json();

      setResult({
        score: data.ats_score,
        missing: data.missing_keywords || [
          "react",
          "node",
          "rest",
          "sql",
          "git",
        ],
      });
    } catch (err) {
      alert("Backend not running");
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
              className="border-2 border-dashed border-gray-700 rounded-xl p-6 cursor-pointer hover:border-indigo-500"
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
                <div className="flex items-center gap-3 text-green-400">
                  <FileText />
                  {file.name}
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <UploadCloud className="mx-auto text-indigo-400" />
                  <p className="text-gray-400">Click to upload PDF</p>
                </div>
              )}
            </div>

            {file && (
              <Button
                variant="ghost"
                className="text-red-400 mt-2"
                onClick={clearFile}
              >
                Remove
              </Button>
            )}
          </div>

          {/* JOB DESCRIPTION */}
          <div>
            <h3 className="text-sm uppercase text-indigo-400 mb-2">
              <Briefcase size={14} className="inline mr-2" />
              2. Job Description
            </h3>

            <Textarea
              className="min-h-[160px] bg-black/50 border-gray-700"
              placeholder="Paste job description here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {/* BUTTON */}
          <Button
            onClick={analyzeResume}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 text-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                Analyzing...
              </span>
            ) : (
              "Check ATS Score"
            )}
          </Button>
        </div>

        {/* RIGHT PANEL */}
        {result ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 grid md:grid-cols-2 gap-6">

            {/* ATS CIRCLE */}
            <div className="flex flex-col items-center justify-center">
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
                  />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-3xl font-bold">
                    {result.score}%
                  </p>
                  <p className="text-xs text-gray-400">
                    ATS
                  </p>
                </div>
              </div>

              <p
                className={`mt-4 font-semibold ${
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
              <h2 className="text-xl font-semibold">
                ATS Analysis Report
              </h2>

              <p className="text-gray-400 text-sm">
                Resume vs Job Description match
              </p>

              <div>
                <h3 className="text-red-400 text-sm font-semibold mb-2">
                  Missing Keywords
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.missing.map((k) => (
                    <span
                      key={k}
                      className="px-3 py-1 text-xs bg-red-500/10 border border-red-500/20 rounded-full text-red-400"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-sm text-indigo-300">
                💡 Tip: Add missing keywords naturally in projects or experience.
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-500">
            Ready to scan
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
