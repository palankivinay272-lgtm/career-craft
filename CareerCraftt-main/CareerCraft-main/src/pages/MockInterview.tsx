import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import TextInterview from "../components/TextInterview";
import VideoInterview from "../components/VideoInterview";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, ArrowLeft, Video } from "lucide-react";

const MockInterview = () => {
  const [searchParams] = useSearchParams();
  const initialDomain = searchParams.get("domain") || "";
  const [mode, setMode] = useState<"menu" | "text" | "video">(initialDomain ? "text" : "menu");

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col">
      {mode === "menu" ? (
        <div className="max-w-6xl mx-auto w-full space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 mt-10">

          {/* Header Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-400 to-purple-600 bg-clip-text text-transparent">
              Mock Interview
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Select your interview style to sharpen your technical skills.
            </p>
          </div>

          {/* Cards Section */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">

            {/* 1. Text Quiz Card */}
            <Card
              onClick={() => setMode("text")}
              className="group relative overflow-hidden p-8 bg-gray-900 border-gray-800 hover:border-indigo-500 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Bot size={140} />
              </div>

              <div className="relative z-10 space-y-6 text-center flex flex-col items-center">
                <div className="p-4 bg-indigo-500/20 rounded-full border border-indigo-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Bot className="text-indigo-400" size={40} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Technical Quiz</h3>
                  <p className="text-gray-400">
                    Test your knowledge across 10+ domains including AI, Web Dev, and DSA with instant feedback.
                  </p>
                </div>

                <div className="w-full pt-4">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 text-lg rounded-xl">
                    Start Quiz
                  </Button>
                </div>
              </div>
            </Card>

            {/* 2. Video Interview Card */}
            <Card
              onClick={() => setMode("video")}
              className="group relative overflow-hidden p-8 bg-gray-900 border-gray-800 hover:border-purple-500 transition-all duration-300 cursor-pointer hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Video size={140} />
              </div>

              <div className="relative z-10 space-y-6 text-center flex flex-col items-center">
                <div className="p-4 bg-purple-500/20 rounded-full border border-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                  <Video className="text-purple-400" size={40} />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white">Video Interview</h3>
                  <p className="text-gray-400">
                    Experience a real-time AI interview with speech-to-text questions and video recording.
                  </p>
                </div>

                <div className="w-full pt-4">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-6 text-lg rounded-xl">
                    Start Interview
                  </Button>
                </div>
              </div>
            </Card>

          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto w-full">
          <Button
            variant="ghost"
            onClick={() => setMode("menu")}
            className="mb-6 text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Menu
          </Button>

          {/* Render Component based on mode */}
          {mode === "text" ? (
            <TextInterview key={initialDomain} initialDomain={initialDomain} />
          ) : (
            <VideoInterview key={initialDomain} initialDomain={initialDomain} />
          )}
        </div>
      )}
    </div>
  );
};

export default MockInterview;