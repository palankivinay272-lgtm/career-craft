import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { CheckCircle2, XCircle, MessageSquare, Video, Mic } from "lucide-react";

const InterviewTips = () => {
    return (
        <div className="min-h-screen p-8 bg-black/50">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        Interview Tips
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Master the art of interviewing with our curated guides.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Dos */}
                    <Card className="glass-card p-8 border-green-500/20">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                            <CheckCircle2 className="text-green-500" />
                            Do's
                        </h2>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                <p>Research the company thoroughly before the interview.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                <p>Prepare specific examples using the STAR method (Situation, Task, Action, Result).</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                <p>Ask thoughtful questions about the team and company culture.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                                <p>Test your audio and video equipment for virtual interviews.</p>
                            </li>
                        </ul>
                    </Card>

                    {/* Don'ts */}
                    <Card className="glass-card p-8 border-red-500/20">
                        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                            <XCircle className="text-red-500" />
                            Don'ts
                        </h2>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                <p>Don't speak negatively about past employers or colleagues.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                <p>Don't arrive late. Join the call or arrive 5-10 minutes early.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                <p>Don't memorize answers verbatim; it sounds robotic.</p>
                            </li>
                            <li className="flex gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2" />
                                <p>Don't forget to follow up with a thank-you note.</p>
                            </li>
                        </ul>
                    </Card>
                </div>

                {/* Resources */}
                <h2 className="text-2xl font-semibold text-white mt-12">Preparation Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                    <Link to="/interview-tips/common-questions">
                        <Card className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors cursor-pointer h-full">
                            <MessageSquare className="w-10 h-10 text-purple-400 mb-4" />
                            <h3 className="font-semibold text-white mb-2">Common Questions</h3>
                            <p className="text-sm text-gray-400">Top 50 behavioral and technical questions expected in 2025.</p>
                        </Card>
                    </Link>
                    <Link to="/interview-tips/video-prep">
                        <Card className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors cursor-pointer h-full">
                            <Video className="w-10 h-10 text-blue-400 mb-4" />
                            <h3 className="font-semibold text-white mb-2">Video Prep</h3>
                            <p className="text-sm text-gray-400">How to set up your lighting and background for success.</p>
                        </Card>
                    </Link>
                    <Link to="/interview-tips/communication">
                        <Card className="glass-card p-6 border-white/5 hover:bg-white/5 transition-colors cursor-pointer h-full">
                            <Mic className="w-10 h-10 text-orange-400 mb-4" />
                            <h3 className="font-semibold text-white mb-2">Communication</h3>
                            <p className="text-sm text-gray-400">Tips to speak clearly and confidently under pressure.</p>
                        </Card>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InterviewTips;
