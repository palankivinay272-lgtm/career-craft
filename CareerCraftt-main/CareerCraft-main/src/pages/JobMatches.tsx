import { useEffect, useState } from "react";
import { MapPin, DollarSign, Building, Briefcase, X, CheckCircle2, UploadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface Job {
  role: string;
  company: string;
  match: number;
  location?: string;
  salary?: string;
  url?: string;     // URL to apply (LinkedIn)
  source?: string;  // "LinkedIn" or "CareerCraft"
  posted_at?: string; // ISO date
  description?: string; // Auto-generated or fetched
}

const JobMatching = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applicationStep, setApplicationStep] = useState<"details" | "form">("details");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: "",
    coverLetter: ""
  });

  useEffect(() => {
    const uid = localStorage.getItem("uid");
    if (!uid) return;

    fetch(`http://localhost:8000/job-matches/${uid}`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  const handleOpenJob = (job: Job) => {
    setSelectedJob(job);
    setApplicationStep("details"); // Reset to details view
  };

  const handleApplyClick = () => {
    // If it has an external URL (LinkedIn, Naukri, Indeed, etc.), open in new tab
    if (selectedJob?.url) {
      window.open(selectedJob.url, "_blank");
      toast.success(`Opening job on ${selectedJob.source || "External Site"}...`);
      return;
    }
    // Else, internal apply
    setApplicationStep("form");
  };

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend call
    setTimeout(() => {
      toast.success(`Application sent to ${selectedJob?.company}! 🚀`);
      setSelectedJob(null);
      setApplicationStep("details");
      setFormData({ name: "", email: "", phone: "", resume: "", coverLetter: "" });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text text-transparent mb-2">
          Recommended Jobs for You
        </h1>
        <p className="text-gray-400 mb-8">
          Based on your resume skills and experience.
        </p>

        {jobs.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-xl">
            <Briefcase size={48} className="mx-auto text-gray-600 mb-4" />
            <p className="text-gray-400 text-lg">
              Upload a resume in the "Analyzer" tab to see job matches!
            </p>
          </div>
        ) : (
          <div className="space-y-12">

            {/* SECTION 1: ON-CAMPUS DRIVES */}
            {jobs.some(j => j.location?.includes("On-Campus")) && (
              <div className="space-y-6 animate-in slide-in-from-left-4 fade-in duration-500">
                <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                  <Building className="text-yellow-400 h-6 w-6" />
                  <div>
                    <h2 className="text-2xl font-bold text-white">On-Campus Drives</h2>
                    <p className="text-sm text-gray-400">Exclusive placement opportunities from your college</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {jobs.filter(j => j.location?.includes("On-Campus")).map((job, index) => (
                    <div
                      key={`placement-${index}`}
                      className="group bg-gray-900/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 transition-all hover:shadow-lg hover:shadow-yellow-900/10 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-2 bg-yellow-500/10 rounded-bl-xl border-b border-l border-yellow-500/20 text-yellow-500 text-xs font-bold">
                        CAMPUS DRIVE
                      </div>

                      <div className="flex justify-between items-start mb-4 mt-2">
                        <div className="bg-gray-800 p-3 rounded-lg group-hover:bg-yellow-500/10 transition-colors">
                          <Building size={24} className="text-yellow-400" />
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          {job.match}% Match
                        </span>
                      </div>

                      <h2 className="text-xl font-semibold text-white mb-1">{job.role}</h2>
                      <p className="text-gray-400 text-sm mb-4">{job.company}</p>

                      <div className="space-y-2 text-sm text-gray-500 mb-6">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-yellow-500" />
                          <span className="text-gray-300">{job.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign size={14} />
                          {job.salary || "Placement Drive"}
                        </div>
                      </div>

                      <Button
                        className="w-full bg-gray-800 hover:bg-yellow-600 hover:text-black text-gray-300 transition-colors border border-gray-700 hover:border-yellow-500"
                        onClick={() => handleOpenJob(job)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 2: REGULAR RECOMMENDATIONS */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-gray-800 pb-4">
                <Briefcase className="text-emerald-400 h-6 w-6" />
                <div>
                  <h2 className="text-2xl font-bold text-white">Recommended Jobs</h2>
                  <p className="text-sm text-gray-400">Fresh opportunities posted in the <b>last 3 days</b></p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.filter(j => !j.location?.includes("On-Campus")).map((job, index) => (
                  <div
                    key={`regular-${index}`}
                    className="group bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all hover:shadow-lg hover:shadow-emerald-900/20"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-gray-800 p-3 rounded-lg group-hover:bg-emerald-500/10 transition-colors">
                        <Building size={24} className="text-emerald-400" />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${job.match > 70
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : job.match > 40
                            ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                      >
                        {job.match}% Match
                      </span>
                    </div>

                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-xl font-semibold text-white">
                        {job.role}
                      </h2>
                      {job.source && job.source !== "CareerCraft" && (
                        <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider border ${job.source === "LinkedIn" ? "bg-[#0077b5]/20 text-[#0077b5] border-[#0077b5]/30"
                          : job.source === "Indeed" ? "bg-[#2164f3]/20 text-[#2164f3] border-[#2164f3]/30"
                            : job.source === "Naukri" ? "bg-[#FF7555]/20 text-[#FF7555] border-[#FF7555]/30"
                              : job.source === "Glassdoor" ? "bg-[#0CAA41]/20 text-[#0CAA41] border-[#0CAA41]/30"
                                : job.source === "Apna" ? "bg-[#be5cff]/20 text-[#be5cff] border-[#be5cff]/30"
                                  : job.source === "Official Site" ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                    : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                          }`}>
                          {job.source}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{job.company}</p>

                    <div className="space-y-2 text-sm text-gray-500 mb-6">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} />
                        {job.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign size={14} />
                        {job.salary || "Competitive Salary"}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-gray-800 hover:bg-emerald-600 hover:text-white text-gray-300 transition-colors border border-gray-700"
                      onClick={() => handleOpenJob(job)}
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>

      {/* --- JOB DETAILS / APPLICATION MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400 z-10"
            >
              <X size={20} />
            </button>

            {/* STEP 1: JOB DETAILS */}
            {applicationStep === "details" && (
              <>
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-white max-w-[80%]">{selectedJob.role}</h2>
                    <span className="text-emerald-400 text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded whitespace-nowrap">
                      {selectedJob.match}% MATCH
                    </span>
                  </div>
                  <p className="text-lg text-gray-400 flex items-center gap-2">
                    <Building size={18} className="text-emerald-500" /> {selectedJob.company}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-xs uppercase mb-1">Salary</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <DollarSign size={14} className="text-green-400" /> {selectedJob.salary || "$100k - $130k"}
                    </p>
                  </div>
                  <div className="p-4 bg-black/40 rounded-xl border border-gray-800">
                    <p className="text-gray-500 text-xs uppercase mb-1">Location</p>
                    <p className="text-white font-medium flex items-center gap-1">
                      <MapPin size={14} className="text-blue-400" /> {selectedJob.location || "Remote"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <h3 className="text-sm font-semibold text-gray-300 uppercase">Description</h3>
                  <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedJob.description ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedJob.description.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br />') }} />
                    ) : (
                      <p>
                        We are looking for a talented <b>{selectedJob.role}</b> to join our team at {selectedJob.company}.
                        You will be working on cutting-edge technologies and scaling our products to millions of users.
                        Your skills in Python, React, and Cloud infrastructure match our requirements perfectly.
                      </p>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-300 uppercase">Requirements</h3>
                  <ul className="text-sm text-gray-400 space-y-2">
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> 3+ years of experience in related field</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Strong problem-solving skills</li>
                    <li className="flex gap-2"><CheckCircle2 size={16} className="text-emerald-500" /> Experience with Agile methodologies</li>
                  </ul>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => setSelectedJob(null)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20"
                    onClick={handleApplyClick}
                  >
                    Apply Now {selectedJob.source ? `on ${selectedJob.source} ↗` : "🚀"}
                  </Button>
                </div>
              </>
            )}

            {/* STEP 2: APPLICATION FORM */}
            {applicationStep === "form" && (
              <form onSubmit={handleSubmitApplication} className="animate-in fade-in slide-in-from-right-4">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white">Apply for {selectedJob.role}</h2>
                  <p className="text-gray-400 text-sm">at {selectedJob.company}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Full Name</label>
                    <Input
                      required
                      placeholder="John Doe"
                      className="bg-black/50 border-gray-700 focus:border-emerald-500"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Email</label>
                      <Input
                        required
                        type="email"
                        placeholder="john@example.com"
                        className="bg-black/50 border-gray-700 focus:border-emerald-500"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm text-gray-400">Phone</label>
                      <Input
                        required
                        type="tel"
                        placeholder="+1 234 567 890"
                        className="bg-black/50 border-gray-700 focus:border-emerald-500"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Resume</label>
                    <div
                      className="border-2 border-dashed border-gray-700 rounded-lg p-6 text-center hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer relative"
                    >
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            toast.success(`Selected: ${file.name}`);
                            setFormData(prev => ({ ...prev, resume: file.name }));
                          }
                        }}
                      />
                      <UploadCloud className="mx-auto h-8 w-8 text-gray-500 mb-2" />
                      <p className="text-sm text-gray-400">
                        {formData.resume || "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">PDF, DOCX up to 5MB</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">Cover Letter (Optional)</label>
                    <Textarea
                      placeholder="Why are you a good fit for this role?"
                      className="bg-black/50 border-gray-700 focus:border-emerald-500 min-h-[100px]"
                      value={formData.coverLetter}
                      onChange={(e) => handleInputChange("coverLetter", e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-800">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-gray-700 hover:bg-gray-800 text-white"
                    onClick={() => setApplicationStep("details")}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-900/20"
                  >
                    Submit Application
                  </Button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}
    </div>
  );
};


export default JobMatching;