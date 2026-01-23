import { useState, useMemo, useEffect } from "react";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Loader2, Trophy, ArrowRight, CheckCircle, XCircle, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";

export type Question = {
  q: string;
  options: string[];
  correct: number;
  exp: string;
};

const COLORS = ["#10B981", "#EF4444"]; // Emerald-500, Red-500
const DOMAINS = [
  "AI / ML", "Web Development", "Java", "Python", "Data Structures",
  "Database / SQL", "Operating Systems", "Computer Networks", "Cyber Security", "Cloud Computing", "Blockchain",
  "Frontend Development", "Backend Development", "Full Stack Development", "DevOps", "React Native"
];

const TextInterview = ({ initialDomain }: { initialDomain?: string }) => {
  // --- STATE ---
  const [step, setStep] = useState<"setup" | "quiz" | "result">("setup");
  const [domain, setDomain] = useState(initialDomain || "");
  const [level, setLevel] = useState("easy");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // --- EFFECT: Fetch Questions ---
  useEffect(() => {
    if (step === "quiz") {
      const fetchQuestions = async (retryInfo = { canRetry: true }) => {
        setLoading(true);
        try {
          const res = await fetch(`http://localhost:8000/interview-questions?domain=${encodeURIComponent(domain)}&level=${level}&limit=10`);
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();

          if (data.length === 0 && retryInfo.canRetry) {
            console.log("Empty DB detected. Attempting to seed...");
            await fetch("http://localhost:8000/seed-questions", { method: "POST" });
            return fetchQuestions({ canRetry: false });
          }

          const adapted = data.map((d: any) => ({
            q: d.question,
            options: d.options,
            correct: d.correct_index,
            exp: d.explanation
          }));

          setQuestions(adapted);
        } catch (error) {
          console.error(error);
          alert("Failed to load questions. Please check backend connection.");
          setStep("setup");
        } finally {
          setLoading(false);
        }
      };
      fetchQuestions();
    }
  }, [step, domain, level]);

  // --- LOGIC ---
  const currentQuestionData = useMemo(() => {
    if (questions.length === 0 || !questions[currentQIndex]) return null;
    const q = questions[currentQIndex];
    // Create new shuffle if it doesn't exist (using state approach usually better, but memo works if index changes)
    // Note: In strict mode, memo might run twice. For a real app, storing shuffled order in state is safer.
    // For this demo, we'll keep it simple but ensure distinct logic.
    const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
    return {
      ...q,
      shuffledOptions: shuffledIndices.map(idx => q.options[idx]),
      correctOriginalIndex: q.correct,
      shuffledIndices: shuffledIndices
    };
  }, [currentQIndex, questions]);

  const handleOptionClick = (shuffledIndex: number) => {
    if (selectedOption !== null) return;

    setSelectedOption(shuffledIndex);
    setShowExplanation(true);

    const originalIndex = currentQuestionData!.shuffledIndices[shuffledIndex];
    if (originalIndex === currentQuestionData!.correctOriginalIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setStep("result");
      triggerConfetti();
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  // --- SAVE RESULT ---
  useEffect(() => {
    if (step === "result") {
      const saveToBackend = async () => {
        const uid = localStorage.getItem("uid");
        if (!uid) return;
        try {
          await fetch("http://localhost:8000/interview/complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ uid, domain, score, total: questions.length })
          });
        } catch (e) {
          console.error("Failed to save", e);
        }
      };
      saveToBackend();
    }
  }, [step]);

  const resetQuiz = () => {
    setStep("setup");
    if (!initialDomain) setDomain("");
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuestions([]);
  };

  // --- RENDER HELPERS ---
  const progressPercentage = questions.length > 0 ? ((currentQIndex + 1) / questions.length) * 100 : 0;

  // 1. SETUP SCREEN
  if (step === "setup") {
    return (
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
            <Sparkles className="w-10 h-10 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Interview Setup</h2>
          <p className="text-gray-400">Configure your session to match your skills</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Select Domain</label>
            <div className="relative">
              <select
                className="w-full p-4 bg-gray-900/50 text-white rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                disabled={!!initialDomain}
              >
                <option value="" disabled>Choose a Domain</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 ml-1">Select Difficulty</label>
            <div className="relative">
              <select
                className="w-full p-4 bg-gray-900/50 text-white rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors focus:ring-2 focus:ring-indigo-500/50 outline-none appearance-none"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                {["easy", "medium", "hard"].map(l => (
                  <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
            </div>
          </div>

          <Button
            className="w-full py-7 text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            disabled={!domain || !level}
            onClick={() => setStep("quiz")}
          >
            Start Quiz <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    );
  }

  // 2. RESULTS SCREEN
  if (step === "result") {
    const data = [
      { name: "Correct", value: score },
      { name: "Wrong", value: questions.length - score },
    ];
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-700">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center space-y-8 relative overflow-hidden">

          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-indigo-500/20 blur-[100px] rounded-full pointer-events-none" />

          <div className="relative">
            <div className="inline-flex items-center justify-center p-4 bg-yellow-500/10 rounded-full border border-yellow-500/20 mb-4 ring-4 ring-yellow-500/5">
              <Trophy className="w-12 h-12 text-yellow-400" />
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-2">Quiz Completed!</h2>
            <p className="text-gray-400 text-lg">You scored {percentage}%</p>
          </div>

          <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 flex justify-center">
            <PieChart width={200} height={200}>
              <Pie
                data={data}
                innerRadius={65}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-emerald-400">{score}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Correct</div>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
              <div className="text-3xl font-bold text-red-400">{questions.length - score}</div>
              <div className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Incorrect</div>
            </div>
          </div>

          <Button
            onClick={resetQuiz}
            className="w-full py-6 text-lg bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Take Another Quiz
          </Button>
        </div>
      </div>
    );
  }

  // 3. QUIZ LOAD
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full" />
          <Loader2 className="w-16 h-16 text-indigo-400 animate-spin relative z-10" />
        </div>
        <p className="text-xl font-medium text-gray-300 animate-pulse">Generative AI is creating your questions...</p>
      </div>
    );
  }

  if (!currentQuestionData) return (
    <div className="text-center p-8 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 max-w-md mx-auto">
      Error loading questions. Please try again.
      <Button onClick={resetQuiz} variant="secondary" className="mt-4 w-full">Go Back</Button>
    </div>
  );

  // 4. QUIZ PLAY
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

      {/* Top Bar */}
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-lg font-semibold text-white tracking-tight">{domain}</h2>
            <p className="text-sm text-gray-400 capitalize">{level} Difficulty</p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-indigo-400">{currentQIndex + 1}</span>
            <span className="text-gray-500 text-lg">/{questions.length}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 w-full bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Main Card */}
      <div className="group relative">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
        <div className="relative p-8 md:p-10 bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl">
          <h3 className="text-2xl md:text-3xl font-medium text-white leading-relaxed">
            {currentQuestionData.q}
          </h3>
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {currentQuestionData.shuffledOptions.map((opt, idx) => {
          const originalIdx = currentQuestionData.shuffledIndices[idx];
          const isCorrect = originalIdx === currentQuestionData.correctOriginalIndex;
          const isSelected = selectedOption === idx;
          const showResult = selectedOption !== null;

          let cardClass = "bg-gray-900/50 border-gray-800 hover:border-indigo-500 hover:bg-gray-800 text-gray-200";

          if (showResult) {
            if (isCorrect) cardClass = "bg-emerald-500/10 border-emerald-500 text-emerald-100 ring-1 ring-emerald-500/50";
            else if (isSelected) cardClass = "bg-red-500/10 border-red-500 text-red-100";
            else cardClass = "bg-gray-900/30 border-gray-800 text-gray-500 opacity-50";
          }

          return (
            <button
              key={idx}
              disabled={showResult}
              onClick={() => handleOptionClick(idx)}
              className={`relative p-6 rounded-2xl border-2 text-left transition-all duration-300 transform ${showResult ? '' : 'hover:scale-[1.01] hover:shadow-lg'} ${cardClass}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium">{opt}</span>
                {showResult && isCorrect && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                {showResult && isSelected && !isCorrect && <XCircle className="w-6 h-6 text-red-500" />}
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation & Next */}
      {showExplanation && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-l-4 border-indigo-500 rounded-r-xl shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg shrink-0">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-indigo-400 font-semibold mb-1 uppercase tracking-wide text-xs">AI Explanation</h4>
                <p className="text-gray-300 leading-relaxed text-lg">{currentQuestionData.exp}</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleNext}
            className="w-full py-7 text-xl font-bold bg-white text-black hover:bg-indigo-50 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all hover:-translate-y-1 hover:shadow-2xl"
          >
            {currentQIndex === questions.length - 1 ? (
              <span className="flex items-center">Finish Quiz <Trophy className="ml-2 w-6 h-6 text-yellow-500" /></span>
            ) : (
              <span className="flex items-center">Next Question <ArrowRight className="ml-2 w-6 h-6" /></span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TextInterview;