import { useState, useMemo, useEffect } from "react";
import { Button } from "../components/ui/button";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { Loader2 } from "lucide-react";

export type Question = {
  q: string;
  options: string[];
  correct: number;
  exp: string;
};

const COLORS = ["#22c55e", "#ef4444"]; // Green, Red
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
            // Auto-seed if empty
            await fetch("http://localhost:8000/seed-questions", { method: "POST" });
            // Retry once
            return fetchQuestions({ canRetry: false });
          }

          // Adapt Backend Response to Frontend Interface
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

  // 2. Shuffle Options Logic
  const currentQuestionData = useMemo(() => {
    if (questions.length === 0 || !questions[currentQIndex]) return null;

    const q = questions[currentQIndex];

    // Create an array of indices [0, 1, 2, 3] and shuffle them
    const shuffledIndices = [0, 1, 2, 3].sort(() => Math.random() - 0.5);

    return {
      ...q,
      shuffledOptions: shuffledIndices.map(idx => q.options[idx]),
      correctOriginalIndex: q.correct,
      shuffledIndices: shuffledIndices // We need this to map back to the original index
    };
  }, [currentQIndex, questions]);

  const handleOptionClick = (shuffledIndex: number) => {
    if (selectedOption !== null) return; // Prevent clicking twice

    setSelectedOption(shuffledIndex);
    setShowExplanation(true);

    // Check if the clicked shuffled option maps to the correct original index
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
    }
  };

  const resetQuiz = () => {
    setStep("setup");
    // Keep domain if passed as prop, else clear? User might want to change.
    if (!initialDomain) setDomain("");
    setCurrentQIndex(0);
    setScore(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setQuestions([]);
  };

  // --- RENDERS ---

  // 1. SETUP SCREEN
  if (step === "setup") {
    return (
      <div className="w-full max-w-md mx-auto p-6 bg-gray-900 rounded-xl border border-gray-800 shadow-xl space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">Interview Setup</h2>

        <div className="space-y-2">
          <label className="text-gray-400">Select Domain</label>
          <select
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            disabled={!!initialDomain}
          >
            <option value="" disabled>Choose a Domain</option>
            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-gray-400">Select Difficulty</label>
          <select
            className="w-full p-3 bg-gray-800 text-white rounded-lg border border-gray-700"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            {["easy", "medium", "hard"].map(l => (
              <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
            ))}
          </select>
        </div>

        <Button
          className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700"
          disabled={!domain || !level}
          onClick={() => setStep("quiz")}
        >
          Start Quiz
        </Button>
      </div>
    );
  }

  // 2. RESULTS SCREEN
  if (step === "result") {
    const data = [
      { name: "Correct", value: score },
      { name: "Wrong", value: questions.length - score },
    ];
    return (
      <div className="flex flex-col items-center space-y-8 text-white">
        <h2 className="text-3xl font-bold">Quiz Completed!</h2>
        <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800 flex flex-col items-center">
          <PieChart width={250} height={250}>
            <Pie data={data} innerRadius={60} outerRadius={90} dataKey="value" stroke="none">
              {data.map((_, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
          <p className="text-xl mt-4">Score: {score} / {questions.length}</p>
        </div>
        <Button onClick={resetQuiz} className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700">
          Take Another Quiz
        </Button>
      </div>
    );
  }

  // 3. QUIZ SCREEN
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-gray-400">Generating Interview Questions...</p>
      </div>
    )
  }

  if (!currentQuestionData) return <div className="text-white text-center">No questions found for this category.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center text-white">
        <span className="text-lg text-gray-400">
          Question {currentQIndex + 1} / {questions.length}
        </span>
        <span className="px-3 py-1 bg-gray-800 rounded-full text-sm">
          {domain} • {level}
        </span>
      </div>

      {/* Question Card */}
      <div className="p-8 bg-gradient-to-br from-indigo-900 to-gray-900 text-white text-2xl font-semibold rounded-2xl border border-indigo-500/30 shadow-lg">
        {currentQuestionData.q}
      </div>

      {/* Options */}
      <div className="grid md:grid-cols-2 gap-4">
        {currentQuestionData.shuffledOptions.map((opt, idx) => {
          // Determine color based on state
          const originalIdx = currentQuestionData.shuffledIndices[idx];
          const isCorrect = originalIdx === currentQuestionData.correctOriginalIndex;
          const isSelected = selectedOption === idx;

          let btnClass = "bg-white text-black hover:bg-gray-100";

          if (selectedOption !== null) {
            if (isCorrect) btnClass = "bg-green-500 text-white border-green-600"; // Always show green for correct
            else if (isSelected) btnClass = "bg-red-500 text-white border-red-600"; // Show red if you picked wrong
            else btnClass = "bg-gray-200 text-gray-400 opacity-50"; // Fade others
          }

          return (
            <button
              key={idx}
              disabled={selectedOption !== null}
              onClick={() => handleOptionClick(idx)}
              className={`p-4 rounded-xl text-lg font-medium transition-all duration-200 border-2 border-transparent ${btnClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation Box (Appears after selection) */}
      {showExplanation && (
        <div className="p-6 bg-black border border-gray-700 text-white rounded-xl flex items-start space-x-3 animate-in fade-in slide-in-from-top-2">
          <span className="text-2xl">💡</span>
          <div>
            <span className="font-bold block mb-1 text-indigo-400">Explanation:</span>
            <span className="text-gray-300">{currentQuestionData.exp}</span>
          </div>
        </div>
      )}

      {/* Next Button */}
      {selectedOption !== null && (
        <Button
          onClick={handleNext}
          className="w-full py-6 text-lg bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg mt-4"
        >
          {currentQIndex === questions.length - 1 ? "View Results" : "Next Question"}
        </Button>
      )}
    </div>
  );
};

export default TextInterview;