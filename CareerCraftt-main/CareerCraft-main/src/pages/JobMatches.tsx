import { useEffect, useState } from "react";
import { MapPin, DollarSign, Building, Briefcase, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Job {
  role: string;
  company: string;
  match: number;
  location?: string; // New fields from backend
  salary?: string;
}

const JobMatching = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null); // For the modal

  useEffect(() => {
    // Check if resume exists (Mock check for now)
    // if (!localStorage.getItem("resumeUploaded")) return;

    const uid = localStorage.getItem("uid"); // Use UID for Firebase lookup
    if (!uid) return;

    fetch(`http://localhost:8000/job-matches/${uid}`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  const handleApply = () => {
    toast.success(`Application sent to ${selectedJob?.company}! 🚀`);
    setSelectedJob(null);
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job, index) => (
              <div
                key={index}
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

                <h2 className="text-xl font-semibold text-white mb-1">
                  {job.role}
                </h2>
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
                  onClick={() => setSelectedJob(job)}
                >
                  View Details
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- JOB DETAILS MODAL --- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-gray-900 border border-gray-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-2 bg-gray-800 rounded-full hover:bg-gray-700 text-gray-400"
            >
              <X size={20} />
            </button>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{selectedJob.role}</h2>
                <span className="text-emerald-400 text-xs font-mono border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 rounded">
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
              <p className="text-gray-400 text-sm leading-relaxed">
                We are looking for a talented <b>{selectedJob.role}</b> to join our team at {selectedJob.company}.
                You will be working on cutting-edge technologies and scaling our products to millions of users.
                Your skills in Python, React, and Cloud infrastructure match our requirements perfectly.
              </p>

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
                onClick={handleApply}
              >
                Apply Now 🚀
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobMatching;