import { useParams, Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare, Video, Mic, CheckCircle, HelpCircle } from "lucide-react";

const topicData: Record<string, {
    title: string;
    description: string;
    icon: any;
    color: string;
    content: {
        sectionTitle: string;
        items: { title: string; text: string }[];
    }[];
}> = {
    "common-questions": {
        title: "Common Questions",
        description: "Top 50 behavioral and technical questions expected in 2025.",
        icon: MessageSquare,
        color: "purple",
        content: [
            {
                sectionTitle: "Behavioral Questions",
                items: [
                    { title: "Tell me about yourself.", text: "Keep it professional. briefly discuss your current role, background, and why you are interested in this position." },
                    { title: "Describe a challenge you overcame.", text: "Use the STAR method (Situation, Task, Action, Result). Focus on your specific contribution and the positive outcome." },
                    { title: "Why do you want to work here?", text: "Mention specific company values, products, or achievements. Align them with your career goals." },
                    { title: "Describe a time you failed.", text: "Be honest but focus on what you learned from the experience and how you improved for the future." },
                    { title: "How do you handle conflict with a coworker?", text: "Focus on communication, empathy, and finding a resolution that benefits the team." },
                    { title: "What is your greatest strength?", text: "Choose a strength relevant to the role and back it up with a specific example." },
                    { title: "What is your greatest weakness?", text: "Choose a real weakness but explain how you are working to improve it." },
                    { title: "Describe a time you showed leadership.", text: "It doesn't have to be a manager role. Talk about taking initiative or mentoring others." },
                    { title: "How do you handle pressure?", text: "Give examples of staying organized, prioritizing, or keeping calm during tight deadlines." }
                ]
            },
            {
                sectionTitle: "Technical Questions (General)",
                items: [
                    { title: "Explain a complex technical concept to a non-technical person.", text: "Focus on clarity and analogies. Avoid jargon." },
                    { title: "How do you handle debugging?", text: "Describe your systematic process: reproducing the error, isolating variables, checking logs, and testing fixes." },
                    { title: "What is your preferred programming language and why?", text: "Highlight functionality, ecosystem, and personal productivity. Mention trade-offs." },
                    { title: "How do you stay updated with tech trends?", text: "Mention specific blogs, newsletters, communities, or projects you follow." },
                    { title: "Explain RESTful APIs.", text: "Discuss resources, HTTP methods (GET, POST, etc.), and statelessness." },
                    { title: "What is the difference between TCP and UDP?", text: "Highlight reliability vs. speed and give use cases (e.g., file transfer vs. video streaming)." },
                    { title: "How do you optimize code for performance?", text: "Talk about profiling, algorithms (Big O), and database indexing." },
                    { title: "Explain the concept of CI/CD.", text: "Discuss automating integration and deployment to ensure code quality and faster delivery." }
                ]
            },
            {
                sectionTitle: "Situational Questions",
                items: [
                    { title: "What would you do if you couldn't meet a deadline?", text: "Communicate early, explain the blockers, and propose a revised timeline or scope adjustment." },
                    { title: "How do you prioritize multiple urgent tasks?", text: "Assess impact and effort. Communicate with stakeholders to align on expectations." },
                    { title: "What would you do if you disagreed with your manager?", text: "Explain how you would have a respectful, private conversation to understand their perspective and share yours." },
                    { title: "How would you handle a team member not pulling their weight?", text: "Talk about addressing the issue privately and offering support before escalating." },
                    { title: "What if you found a bug in production?", text: "Assess severity, hotfix if critical, communicate with users, and implement a long-term fix." }
                ]
            },
            {
                sectionTitle: "Questions to Ask the Interviewer",
                items: [
                    { title: "What does success look like in this role?", text: "Shows you are goal-oriented and want to align with expectations." },
                    { title: "Can you describe the team culture?", text: "Helps you assess if you will fit in and enjoy working there." },
                    { title: "What are the biggest challenges the team is facing?", text: "Shows you are interested in problem-solving and helping the team." },
                    { title: "How does the company support professional growth?", text: "Demonstrates that you are ambitious and want to learn." }
                ]
            }
        ]
    },
    "video-prep": {
        title: "Video Interview Prep",
        description: "How to set up your lighting and background for success.",
        icon: Video,
        color: "blue",
        content: [
            {
                sectionTitle: "Environment Setup",
                items: [
                    { title: "Lighting", text: "Face a window or use a soft lamp. Avoid backlighting which turns you into a silhouette." },
                    { title: "Background", text: "Choose a neutral, clutter-free background. Blur your background if you can't find a clean spot." },
                    { title: "Camera Angle", text: "Position the camera at eye level. Look at the camera lens, not the screen, to simulate eye contact." }
                ]
            },
            {
                sectionTitle: "Tech Check",
                items: [
                    { title: "Internet Connection", text: "Use a wired connection if possible. Close unnecessary bandwidth-heavy apps." },
                    { title: "Audio", text: "Use headphones with a microphone to reduce echo and background noise." }
                ]
            }
        ]
    },
    "communication": {
        title: "Communication Skills",
        description: "Tips to speak clearly and confidently under pressure.",
        icon: Mic,
        color: "orange",
        content: [
            {
                sectionTitle: "Verbal Tips",
                items: [
                    { title: "Pacing", text: "Speak slightly slower than your normal conversation speed. Pausing is better than using filler words like 'um' or 'like'." },
                    { title: "Clarity", text: "Structure your answers. Start with a direct answer, explain your reasoning, and conclude with a summary." }
                ]
            },
            {
                sectionTitle: "Non-Verbal Cues",
                items: [
                    { title: "Posture", text: "Sit up straight. Leaning forward slightly shows engagement." },
                    { title: "Hand Gestures", text: "Use natural hand gestures to emphasize points, but keep them within the frame." }
                ]
            }
        ]
    }
};

const InterviewTopicDetail = () => {
    const { topicId } = useParams();
    const topic = topicData[topicId || ""];

    if (!topic) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black/50 text-white">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Topic not found</h1>
                    <Link to="/interview-tips">
                        <Button variant="outline">Go Back</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const Icon = topic.icon;

    return (
        <div className="min-h-screen p-8 bg-black/50 text-white">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header */}
                <div className="space-y-4">
                    <Link to="/interview-tips">
                        <Button variant="ghost" className="pl-0 hover:bg-transparent hover:text-purple-400">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tips
                        </Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl bg-${topic.color}-500/10 text-${topic.color}-400`}>
                            <Icon size={32} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{topic.title}</h1>
                            <p className="text-gray-400">{topic.description}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="grid gap-8">
                    {topic.content.map((section, idx) => (
                        <Card key={idx} className="glass-card p-8 border-white/5">
                            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <div className={`w-1 h-6 bg-${topic.color}-500 rounded-full`} />
                                {section.sectionTitle}
                            </h2>
                            <div className="space-y-6">
                                {section.items.map((item, itemIdx) => (
                                    <div key={itemIdx} className="bg-white/5 rounded-lg p-5 border border-white/5 hover:border-white/10 transition-colors">
                                        <h3 className="font-semibold text-lg text-white mb-2 flex items-start gap-2">
                                            <CheckCircle className={`w-5 h-5 text-${topic.color}-500 mt-1 shrink-0`} />
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-400 ml-7 leading-relaxed">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Pro Tip Box */}
                <Card className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border-purple-500/20 p-6 flex gap-4 items-start">
                    <HelpCircle className="w-6 h-6 text-purple-400 shrink-0" />
                    <div>
                        <h3 className="font-semibold text-purple-300 mb-1">CareerCraft Pro Tip</h3>
                        <p className="text-sm text-gray-400">
                            Want personalized feedback? Try our AI Mock Interview tool to practice these exact scenarios and get real-time scoring.
                        </p>
                        <Link to="/interview">
                            <Button size="sm" className="mt-4 bg-purple-600 hover:bg-purple-700">Practice Now</Button>
                        </Link>
                    </div>
                </Card>

            </div>
        </div>
    );
};

export default InterviewTopicDetail;
