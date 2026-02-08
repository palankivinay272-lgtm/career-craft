import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Webcam from "react-webcam";
import { Button } from "../components/ui/button";
import { Loader2, Mic, Video, AlertCircle, Play, Square, ArrowRight, Volume2, Camera } from "lucide-react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

// Types
type Question = {
    q: string;
    options: string[];
    correct: number;
    exp: string;
};

const DOMAINS = [
    "AI / ML", "Web Development", "Java", "Python", "Data Structures",
    "Frontend Development", "Backend Development", "Full Stack Development", "DevOps"
];

// --- AVATAR COMPONENT ---
const AIAvatar = ({ isSpeaking }: { isSpeaking: boolean }) => {
    return (
        <div className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'scale-110 shadow-[0_0_50px_rgba(99,102,241,0.6)]' : 'shadow-xl'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            <div className="relative z-10 text-8xl transition-transform duration-200" style={{ transform: isSpeaking ? 'scale(1.1)' : 'scale(1)' }}>
                {isSpeaking ? "🗣️" : "🤖"}
            </div>
            {/* Sound Waves */}
            {isSpeaking && (
                <>
                    <div className="absolute inset-0 border-4 border-indigo-400/30 rounded-full animate-ping"></div>
                    <div className="absolute -inset-4 border-2 border-purple-400/20 rounded-full animate-ping delay-75"></div>
                </>
            )}
        </div>
    );
};

const VideoInterview = ({ initialDomain }: { initialDomain?: string }) => {
    // --- STATE ---
    const [step, setStep] = useState<"setup" | "permissions" | "interview" | "result">("setup");
    const [domain, setDomain] = useState(initialDomain || "");
    const [level, setLevel] = useState("easy");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [loading, setLoading] = useState(false);
    const [cameraAllowed, setCameraAllowed] = useState(false);
    const [micAllowed, setMicAllowed] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Analysis State
    const [analyzing, setAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState<{ score: number, feedback: string, suggested_answer: string } | null>(null);

    const webcamRef = useRef<Webcam>(null);

    // --- SPEECH RECOGNITION ---
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    if (!browserSupportsSpeechRecognition) {
        // Fallback or alert if browser doesn't support it
        // console.warn("Browser does not support speech recognition.");
    }

    // --- TTS LOGIC (Improved) ---
    const speak = (text: string) => {
        if (!window.speechSynthesis) return;

        // Cancel any previous speech to avoid queue buildup
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 1.0;
        utterance.volume = 1.0;

        // Try to select a better voice
        const voices = window.speechSynthesis.getVoices();
        const preferredVoice = voices.find(v => v.name.includes("Google") || v.name.includes("Samantha")) || voices[0];
        if (preferredVoice) utterance.voice = preferredVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            setIsSpeaking(false);
        }

        try {
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.error("Speech Synthesis Failed", e);
        }
    };

    // Ensure voices are loaded (Chrome often loads async)
    useEffect(() => {
        window.speechSynthesis.getVoices();
    }, []);

    // --- FETCH QUESTIONS ---
    useEffect(() => {
        if (step === "interview" && questions.length === 0) {
            const fetchQuestions = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`http://localhost:8000/interview-questions?domain=${encodeURIComponent(domain)}&level=${level}&limit=5`);
                    if (!res.ok) throw new Error("Failed to fetch");
                    const data = await res.json();

                    const adapted = data.map((d: any) => ({
                        q: d.question,
                        options: d.options,
                        correct: d.correct_index,
                        exp: d.explanation
                    }));

                    setQuestions(adapted);

                    // Auto-speak after a delay to ensure component is ready
                    setTimeout(() => {
                        if (adapted.length > 0) speak(adapted[0].q);
                    }, 1000);

                } catch (error) {
                    console.error(error);
                    toast.error("Failed to load questions.");
                    setStep("setup");
                } finally {
                    setLoading(false);
                }
            };
            fetchQuestions();
        }
    }, [step, domain, level]);

    // --- PERMISSIONS ---
    const checkPermissions = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setCameraAllowed(true);
            setMicAllowed(true);
            stream.getTracks().forEach(track => track.stop());
        } catch (e) {
            console.error("Permission denied", e);
            toast.warning("Please allow camera and microphone access to proceed.");
        }
    };

    // --- ANALYSIS HANDLER ---
    const handleAnalyze = async () => {
        if (!transcript || transcript.length < 5) return;

        setAnalyzing(true);
        setFeedback(null);

        try {
            const res = await fetch("http://localhost:8000/analyze-answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: questions[currentQIndex].q,
                    answer: transcript,
                    domain: domain
                })
            });

            const data = await res.json();
            setFeedback(data);
        } catch (error) {
            console.error("Analysis Failed", error);
        } finally {
            setAnalyzing(false);
        }
    };

    // --- HANDLERS ---
    const handleNextQuestion = () => {
        // Stop recording/listening
        setIsRecording(false);
        SpeechRecognition.stopListening();
        resetTranscript();
        setFeedback(null); // Clear feedback

        if (currentQIndex < questions.length - 1) {
            const nextIndex = currentQIndex + 1;
            setCurrentQIndex(nextIndex);
            // Speak next question
            speak(questions[nextIndex].q);
        } else {
            setStep("result");
            const endMsg = "Thank you for completing the interview. You can review your performance in the dashboard.";
            speak(endMsg);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            // Stop
            setIsRecording(false);
            SpeechRecognition.stopListening();
        } else {
            // Start
            setIsRecording(true);
            setFeedback(null); // Clear previous feedback
            resetTranscript(); // Clear previous answer
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    // --- RENDER HELPERS ---

    // 1. SETUP
    if (step === "setup") {
        return (
            <div className="max-w-md mx-auto p-8 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl space-y-8 animate-in zoom-in-95">
                <div className="text-center">
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                        <Video className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Video Interview</h2>
                    <p className="text-gray-400 mt-2">AI-driven mock interview with real-time feedback</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-300 ml-1">Domain</label>
                        <select
                            className="w-full p-4 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            disabled={!!initialDomain}
                        >
                            <option value="" disabled>Select Domain</option>
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-300 ml-1">Difficulty</label>
                        <select
                            className="w-full p-4 bg-gray-800 text-white rounded-xl border border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500"
                            value={level}
                            onChange={(e) => setLevel(e.target.value)}
                        >
                            <option value="easy">Easy</option>
                            <option value="medium">Medium</option>
                            <option value="hard">Hard</option>
                        </select>
                    </div>
                </div>

                <Button
                    className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-xl"
                    disabled={!domain}
                    onClick={() => setStep("permissions")}
                >
                    Proceed to Setup
                </Button>
            </div>
        );
    }

    // 2. PERMISSIONS
    if (step === "permissions") {
        return (
            <div className="max-w-2xl mx-auto p-8 bg-gray-900 rounded-3xl border border-gray-800 shadow-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-3xl font-bold text-white">System Check</h2>
                <p className="text-gray-400">We need access to your camera and microphone to simulate a real interview.</p>

                <div className="flex justify-center gap-8">
                    <div className={`p-6 rounded-2xl border-2 ${cameraAllowed ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800'} flex flex-col items-center w-40 transition-all`}>
                        <Camera className={`w-10 h-10 mb-2 ${cameraAllowed ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={cameraAllowed ? 'text-green-400' : 'text-gray-400'}>Camera</span>
                    </div>
                    <div className={`p-6 rounded-2xl border-2 ${micAllowed ? 'border-green-500 bg-green-500/10' : 'border-gray-700 bg-gray-800'} flex flex-col items-center w-40 transition-all`}>
                        <Mic className={`w-10 h-10 mb-2 ${micAllowed ? 'text-green-500' : 'text-gray-400'}`} />
                        <span className={micAllowed ? 'text-green-400' : 'text-gray-400'}>Microphone</span>
                    </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-200 text-sm flex items-start gap-3 text-left">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>Ensure you are in a quiet environment with good lighting. The AI will ask questions audibly, so turn up your volume.</p>
                </div>

                {!cameraAllowed || !micAllowed ? (
                    <Button onClick={checkPermissions} className="w-full py-6 text-lg bg-white text-black hover:bg-gray-200 rounded-xl">
                        Check Permissions
                    </Button>
                ) : (
                    <Button onClick={() => setStep("interview")} className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white rounded-xl">
                        Start Interview
                    </Button>
                )}
            </div>
        );
    }

    // 3. INTERVIEW
    if (step === "interview") {
        if (loading) return (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-gray-400">Preparing interview room...</p>
            </div>
        );

        const currentQ = questions[currentQIndex];

        return (
            <div className="grid md:grid-cols-3 gap-6 min-h-[80vh] mb-24 max-w-7xl mx-auto">
                {/* Left: AI Interviewer & Question */}
                <div className="md:col-span-1 space-y-6 flex flex-col">
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex-1 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">

                        {/* ANIMATED AVATAR */}
                        <AIAvatar isSpeaking={isSpeaking} />

                        <h3 className="text-white text-xl font-bold mt-8 mb-2">AI Interviewer</h3>
                        <p className="text-gray-400 text-center text-sm px-4">
                            {isSpeaking ? "Speaking..." : "Listening..."}
                        </p>
                    </div>

                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl">
                        <span className="text-indigo-400 text-sm font-bold uppercase tracking-wider mb-2 block">Question {currentQIndex + 1}/{questions.length}</span>
                        <p className="text-white text-lg font-medium leading-relaxed">
                            {currentQ ? currentQ.q : "Loading question..."}
                        </p>
                        <Button
                            onClick={() => speak(currentQ.q)}
                            variant="ghost"
                            size="sm"
                            className="mt-4 text-gray-400 hover:text-white"
                        >
                            <Volume2 className="w-4 h-4 mr-2" /> Replay Audio
                        </Button>
                    </div>

                    {/* Live Transcript Display */}
                    <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-xl flex-1 max-h-[300px] overflow-y-auto">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-500 text-xs uppercase tracking-wider font-bold">Your Response (Live)</span>
                            {listening && <span className="text-red-400 text-xs animate-pulse">● Listening</span>}
                        </div>
                        <p className="text-gray-300 text-sm whitespace-pre-wrap">
                            {transcript || <span className="text-gray-600 italic">Start answering to see your text here...</span>}
                        </p>

                        {/* FEEDBACK CARD */}
                        {feedback && (
                            <div className="mt-4 pt-4 border-t border-gray-700 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-indigo-400 text-xs font-bold uppercase">AI Feedback</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${feedback.score >= 7 ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                        Score: {feedback.score}/10
                                    </span>
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{feedback.feedback}</p>
                                <div className="bg-gray-800 p-3 rounded-lg">
                                    <span className="text-gray-500 text-xs font-bold block mb-1">Suggested Answer:</span>
                                    <p className="text-gray-400 text-xs italic">{feedback.suggested_answer}</p>
                                </div>
                            </div>
                        )}

                    </div>
                </div>

                {/* Right: User Video & Controls */}
                <div className="md:col-span-2 flex flex-col gap-6">
                    <div className="flex-1 bg-black rounded-3xl border border-gray-800 overflow-hidden relative shadow-2xl group">
                        <Webcam
                            ref={webcamRef}
                            audio={false} // Audio is handled by speech recognition, prevent echo
                            className="w-full h-full object-cover"
                            mirrored={true}
                        />

                        {/* Recording Indicator */}
                        {isRecording && (
                            <div className="absolute top-6 right-6 flex items-center gap-2 bg-red-500/20 backdrop-blur-md border border-red-500/30 px-4 py-2 rounded-full">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-red-200 font-medium text-sm">Recording Answer</span>
                            </div>
                        )}

                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button variant="secondary" className="rounded-full w-12 h-12 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10">
                                <Mic className="w-5 h-5 text-white" />
                            </Button>
                            <Button variant="secondary" className="rounded-full w-12 h-12 p-0 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/10 checkbox">
                                <Video className="w-5 h-5 text-white" />
                            </Button>
                        </div>
                    </div>

                    <div className="h-24 bg-gray-900 border border-gray-800 rounded-2xl p-4 flex items-center justify-between px-8 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className={`w-3 h-3 rounded-full ${isSpeaking ? 'bg-indigo-500 animate-bounce' : 'bg-gray-600'}`} />
                            <span className="text-gray-400 font-medium">
                                {isSpeaking ? "AI is speaking..." : isRecording ? "Listening & Transcribing..." : analyzing ? "Analyzing Answer..." : "Waiting for response"}
                            </span>
                        </div>

                        <div className="flex gap-4">
                            {!browserSupportsSpeechRecognition && (
                                <div className="text-red-400 text-xs self-center mr-4">
                                    Browser not supported for Speech-to-Text
                                </div>
                            )}

                            {/* ANALYZE BUTTON */}
                            {!isRecording && transcript && !feedback && (
                                <Button
                                    onClick={handleAnalyze}
                                    disabled={analyzing}
                                    className="px-6 py-6 text-lg rounded-xl font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all"
                                >
                                    {analyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze Answer"}
                                </Button>
                            )}

                            <Button
                                onClick={toggleRecording}
                                disabled={analyzing}
                                className={`px-8 py-6 text-lg rounded-xl font-semibold transition-all ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-white text-black hover:bg-gray-200'}`}
                            >
                                {isRecording ? (
                                    <><Square className="w-5 h-5 mr-2 fill-current" /> Stop Answer</>
                                ) : (
                                    <><Play className="w-5 h-5 mr-2 fill-current" /> {transcript ? "Retake Answer" : "Start Answer"}</>
                                )}
                            </Button>

                            {!isRecording && (
                                <Button onClick={handleNextQuestion} variant="secondary" className="px-8 py-6 text-lg rounded-xl">
                                    Next <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // 4. RESULT
    if (step === "result") {
        return (
            <div className="max-w-xl mx-auto text-center space-y-8 py-20 animate-in fade-in zoom-in-95">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto border border-green-500/30">
                    <AlertCircle className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-bold text-white">Interview Completed!</h2>
                <p className="text-gray-400 text-lg leading-relaxed">
                    Great job! You have successfully completed the video mock interview. Since this is a demo, your video responses were not stored on the server.
                </p>
                <Button onClick={() => setStep("setup")} className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-lg rounded-xl">
                    Start New Interview
                </Button>
            </div>
        );
    }

    return null;
};

export default VideoInterview;
