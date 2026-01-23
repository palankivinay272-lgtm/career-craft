import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Upload, CheckCircle, AlertCircle, Loader2, Award, Briefcase, FileText, Layout, PenTool, Sparkles, TrendingUp, BarChart2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { auth } from "@/lib/firebase"; // Using alias if available, else ../lib/firebase
import { ProgressChart } from "@/components/ProgressChart";
import { AnalysisRadarChart } from "@/components/RadarChart";

interface FeedbackTip {
  type: "good" | "improve";
  tip: string;
  explanation?: string;
}

interface AnalysisResult {
  overallScore: number;
  ATS: {
    score: number;
    tips: FeedbackTip[];
  };
  toneAndStyle: {
    score: number;
    tips: FeedbackTip[];
  };
  content: {
    score: number;
    tips: FeedbackTip[];
  };
  structure: {
    score: number;
    tips: FeedbackTip[];
  };
  skills: {
    score: number;
    tips: FeedbackTip[];
  };
  skills: {
    score: number;
    tips: FeedbackTip[];
  };
}

interface InsightsResult {
  match_probability: {
    score: number;
    reasoning: string;
  };
  skill_gap: {
    missing_hard_skills: string[];
    missing_soft_skills: string[];
    present_skills: string[];
  };
  interview_prediction: {
    technical_questions: { question: string; context: string }[];
    behavioral_questions: { question: string; context: string }[];
  };
  market_insights: {
    estimated_level: string;
    key_responsibilities: string[];
  };
}

const ResumeAnalyzer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [insights, setInsights] = useState<InsightsResult | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUid(user.uid);
        fetchHistory(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchHistory = async (userId: string) => {
    try {
      const res = await fetch(`http://localhost:8000/analysis-history/${userId}`);
      if (res.ok) {
        const data = await res.json();
        // Reverse to show oldest to newest for graph if needed, or backend handles it
        // Backend sorts DESC (newest first). Recharts needs chronological usually? 
        // Let's reverse for chronological line chart
        setHistory(data.reverse());
      }
    } catch (e) {
      console.error("Failed to fetch history:", e);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !jobTitle || !jobDescription) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and upload a resume.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_title", jobTitle);
    formData.append("job_description", jobDescription);
    if (uid) formData.append("uid", uid);
    // Backend expects 'job_description' and 'job_title'
    // company_name is not strictly used by backend AI currently but good to have in form

    try {
      const response = await fetch("http://localhost:8000/analyze-resume-ai", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Analysis failed");
      }

      const data = await response.json();
      setResult(data);
      if (uid) fetchHistory(uid); // Refresh history

      // 2. Fetch Deep Insights (Parallel or Sequential)
      setIsInsightsLoading(true);
      const insightsFormData = new FormData();
      insightsFormData.append("resume", file);
      insightsFormData.append("job_title", jobTitle);
      insightsFormData.append("job_description", jobDescription);

      try {
        const insightRes = await fetch("http://localhost:8000/analyze-insights", {
          method: "POST",
          body: insightsFormData
        });
        if (insightRes.ok) {
          const insightData = await insightRes.json();
          setInsights(insightData);
        }
      } catch (err) {
        console.error("Insights error", err);
      } finally {
        setIsInsightsLoading(false);
      }

      toast({
        title: "Analysis Complete",
        description: "Your resume has been analyzed successfully.",
      });
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const ScoreRing = ({ score, label, icon: Icon }: { score: number, label: string, icon: any }) => (
    <div className="flex flex-col items-center p-4 bg-white/5 rounded-xl border border-white/10 hover:border-sidebar-accent transition-all">
      <div className="relative flex items-center justify-center w-24 h-24 rounded-full border-4 border-sidebar-border mb-3">
        <Icon className="absolute w-8 h-8 text-gray-400 opacity-20" />
        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
      </div>
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </div>
  );

  const FeedbackSection = ({ title, data }: { title: string, data: { score: number, tips: FeedbackTip[] } }) => (
    <div className="bg-white/5 rounded-xl border border-white/10 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <span className={`text-lg font-bold ${getScoreColor(data.score)}`}>{data.score}/100</span>
      </div>
      <div className="space-y-4">
        {data.tips.map((tip, idx) => (
          <div key={idx} className={`p-4 rounded-lg flex gap-3 items-start ${tip.type === 'good' ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
            {tip.type === 'good' ? <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />}
            <div>
              <p className={`font-medium ${tip.type === 'good' ? 'text-green-400' : 'text-yellow-400'}`}>{tip.tip}</p>
              {tip.explanation && <p className="text-sm text-gray-400 mt-1">{tip.explanation}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-app-dark text-white font-outfit">

      <div className="max-w-4xl mx-auto px-6 py-12">
        {!result ? (
          <>
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                AI Resume Analyzer
              </h1>
              <p className="text-lg text-gray-400">
                Get instant, detailed feedback on your resume tailored to your dream job.
              </p>
            </div>

            {/* Progress History Chart */}
            {history.length > 0 && (
              <div className="glass-card p-6 rounded-2xl border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex items-center gap-2 mb-6">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold text-white">Progress History</h3>
                </div>
                <ProgressChart data={history} />
              </div>
            )}

            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Company Name</label>
                    <input
                      type="text"
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sidebar-accent"
                      placeholder="e.g. Google"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Job Title <span className="text-red-400">*</span></label>
                    <input
                      type="text"
                      required
                      className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sidebar-accent"
                      placeholder="e.g. Frontend Developer"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Job Description <span className="text-red-400">*</span></label>
                  <textarea
                    required
                    rows={6}
                    className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-sidebar-accent resize-none"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Upload Resume (PDF/DOCX) <span className="text-red-400">*</span></label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-sidebar-accent transition-colors">
                    <input
                      type="file"
                      required
                      accept=".pdf,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <span className="text-gray-300 font-medium">Click to upload or drag and drop</span>
                      <span className="text-sm text-gray-500">{file ? file.name : "PDF or DOCX files"}</span>
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Analyze Resume
                    </div>
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="animate-in fade-in duration-700">
            <Button
              variant="ghost"
              onClick={() => setResult(null)}
              className="mb-8 hover:bg-white/5 text-gray-400 hover:text-white"
            >
              ← Analyze Another
            </Button>

            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-2">Analysis Results</h2>
              <p className="text-gray-400">Here's how your resume stacks up against the job description</p>
            </div>

            {/* Overall Score */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 mb-8 flex flex-col items-center">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Simple SVG Circle for visual flair */}
                <svg className="absolute w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    className="text-gray-800"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="currentColor"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={440}
                    strokeDashoffset={440 - (440 * result.overallScore) / 100}
                    className={`${getScoreColor(result.overallScore)} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="text-center">
                  <span className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>{result.overallScore}</span>
                  <p className="text-sm text-gray-400">Overall</p>
                </div>
              </div>
            </div>

            {/* Radar Chart */}
            <div className="w-full h-[300px] mt-4">
              <AnalysisRadarChart data={[
                { subject: 'ATS', A: result.ATS.score, fullMark: 100 },
                { subject: 'Content', A: result.content.score, fullMark: 100 },
                { subject: 'Structure', A: result.structure.score, fullMark: 100 },
                { subject: 'Tone', A: result.toneAndStyle.score, fullMark: 100 },
                { subject: 'Skills', A: result.skills.score, fullMark: 100 },
              ]} />
            </div>


            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              <ScoreRing score={result.ATS.score} label="ATS" icon={Target} />
              <ScoreRing score={result.content.score} label="Content" icon={FileText} />
              <ScoreRing score={result.structure.score} label="Structure" icon={Layout} />
              <ScoreRing score={result.toneAndStyle.score} label="Tone" icon={PenTool} />
              <ScoreRing score={result.skills.score} label="Skills" icon={Award} />
            </div>

            {/* Detailed Feedback Sections */}
            <div className="space-y-2">
              <FeedbackSection title="ATS Compatibility" data={result.ATS} />
              <FeedbackSection title="Content Quality" data={result.content} />
              <FeedbackSection title="Structure & Layout" data={result.structure} />
              <FeedbackSection title="Tone & Style" data={result.toneAndStyle} />
              <FeedbackSection title="Skills Match" data={result.skills} />
            </div>


            {/* MARKET INTELLIGENCE SECTION */}
            {insights && (
              <div className="mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <h2 className="text-3xl font-bold text-white mb-6 flex items-center gap-3">
                  <Sparkles className="text-purple-400" />
                  Market Intelligence
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Match Probability */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-2">Match Probability</h3>
                    <div className="flex items-end gap-2 mb-2">
                      <span className="text-4xl font-bold text-purple-400">{insights.match_probability.score}%</span>
                      <span className="text-gray-400 mb-1">Fit</span>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{insights.match_probability.reasoning}</p>
                  </div>

                  {/* Role Insights */}
                  <div className="glass-card p-6 rounded-2xl border border-white/10">
                    <h3 className="text-xl font-semibold text-white mb-2">Role Analysis</h3>
                    <div className="mb-3">
                      <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/30">
                        {insights.market_insights.estimated_level} Level
                      </span>
                    </div>
                    <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
                      {insights.market_insights.key_responsibilities.slice(0, 3).map((resp, i) => (
                        <li key={i}>{resp}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Skill Gaps */}
                <div className="mt-6 glass-card p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertCircle className="text-red-400 w-5 h-5" />
                    Critical Skill Gaps
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.skill_gap.missing_hard_skills.map((skill, i) => (
                      <span key={i} className="bg-red-500/10 text-red-300 px-3 py-1.5 rounded-lg text-sm border border-red-500/20">
                        {skill}
                      </span>
                    ))}
                    {insights.skill_gap.missing_hard_skills.length === 0 && (
                      <p className="text-green-400 text-sm">No critical hard skill gaps found! 🎉</p>
                    )}
                  </div>
                </div>

                {/* Interview Predictor */}
                <div className="mt-6 glass-card p-6 rounded-2xl border border-white/10">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Briefcase className="text-blue-400 w-5 h-5" />
                    Interview Predictor
                  </h3>
                  <div className="space-y-4">
                    {insights.interview_prediction.technical_questions.map((q, i) => (
                      <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <p className="text-white font-medium mb-1">Q{i + 1}: {q.question}</p>
                        <p className="text-sm text-gray-400 italic">Context: {q.context}</p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
            {isInsightsLoading && !insights && (
              <div className="mt-8 text-center text-gray-400 flex flex-col items-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                <p>Generating deep market insights...</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div >
  );
};

// Fix Icon reference
const Target = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
)

export default ResumeAnalyzer;