import { useEffect, useState } from "react";
import { MapPin, DollarSign, Building } from "lucide-react";
import { Button } from "@/components/ui/button";

const JobMatching = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    // 🧠 check if resume exists
    if (!localStorage.getItem("resumeUploaded")) return;

    const email =
      localStorage.getItem("userEmail") || "demo@user.com";

    fetch(`http://127.0.0.1:8000/job-matches/${email}`)
      .then((res) => res.json())
      .then((data) => setJobs(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">
        Recommended Jobs
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-400">
          Upload a resume to see job matches
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job, index) => (
            <div
              key={index}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold">
                {job.role}
              </h2>
              <p className="text-gray-400 mb-2">
                <Building size={14} className="inline mr-1" />
                {job.company}
              </p>

              <p className="text-emerald-400 font-bold mt-3">
                Match: {job.match}%
              </p>

              <Button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700">
                View Details
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatching;
