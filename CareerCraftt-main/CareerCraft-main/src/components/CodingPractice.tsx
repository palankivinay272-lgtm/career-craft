import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ChevronDown, ChevronUp, Code2, Building2, Play, Lightbulb, Unlock, ArrowLeft, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

// Mock Data for Campus Questions with Details
const COMPANY_QUESTIONS = [
    {
        company: "TCS",
        logo: "https://upload.wikimedia.org/wikipedia/commons/b/b1/Tata_Consultancy_Services_Logo.svg",
        color: "blue",
        questions: [
            {
                id: 1,
                title: "Reverse a string without using built-in functions",
                difficulty: "Easy",
                status: "Pending",
                description: "Given a string, write a program to reverse it without using any built-in string reversal functions like reverse(). You must manipulate the string (or array of characters) directly.",
                examples: [
                    { input: "hello", output: "olleh" },
                    { input: "CareerCraft", output: "tfarCreeraC" }
                ],
                hints: [
                    "Try converting the string into a character array first.",
                    "Use two pointers: one at the beginning and one at the end, then swap them until they meet in the middle."
                ],
                solution: `function reverseString(str) {
  let chars = str.split('');
  let left = 0;
  let right = chars.length - 1;
  while (left < right) {
    let temp = chars[left];
    chars[left] = chars[right];
    chars[right] = temp;
    left++;
    right--;
  }
  return chars.join('');
}`
            },
            {
                id: 2, title: "Check if a number is Prime", difficulty: "Easy", status: "Pending",
                description: "Write a function to check if a given number 'n' is prime. A prime number is a natural number greater than 1 that is not a product of two smaller natural numbers.",
                examples: [
                    { input: "n = 7", output: "True" },
                    { input: "n = 10", output: "False" }
                ],
                hints: ["Iterate from 2 to the square root of n.", "If n is divisible by any number in this range, it's not prime."],
                solution: `function isPrime(n) {
  if (n <= 1) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}`
            },
            { id: 3, title: "Fibonacci Series up to N terms", difficulty: "Easy", status: "Pending", description: "Generate the first N terms of the Fibonacci sequence.", examples: [], hints: [], solution: "" },
            { id: 4, title: "Find the second largest number in an array", difficulty: "Medium", status: "Pending", description: "Find the second largest distinct element in an array.", examples: [], hints: [], solution: "" },
            { id: 5, title: "Calculate factorial using recursion", difficulty: "Medium", status: "Pending", description: "Compute n! using a recursive function.", examples: [], hints: [], solution: "" }
        ]
    },
    {
        company: "Infosys",
        logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg",
        color: "blue",
        questions: [
            { id: 6, title: "Find the missing number in an array of 1 to N", difficulty: "Easy", status: "Pending", description: "Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing from the array.", examples: [], hints: [], solution: "" },
            { id: 7, title: "Check if two strings are Anagrams", difficulty: "Easy", status: "Pending", description: "Check if two strings contain the same characters in the same frequency.", examples: [], hints: [], solution: "" },
            { id: 8, title: "Removing duplicate elements from an array", difficulty: "Medium", status: "Pending", description: "Remove duplicates from a sorted array in-place.", examples: [], hints: [], solution: "" },
            { id: 9, title: "Find the first non-repeating character", difficulty: "Medium", status: "Pending", description: "Find the first character in a string that does not repeat.", examples: [], hints: [], solution: "" }
        ]
    },
    {
        company: "Wipro",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg",
        color: "green",
        questions: [
            { id: 10, title: "Pattern Printing: Pyramid", difficulty: "Easy", status: "Pending", description: "Print a pyramid pattern of stars.", examples: [], hints: [], solution: "" },
            { id: 11, title: "Sort an array of 0s, 1s, and 2s", difficulty: "Medium", status: "Pending", description: "Sort an array consisting only of 0s, 1s, and 2s (Dutch National Flag problem).", examples: [], hints: [], solution: "" },
            { id: 12, title: "Check for Palindrome String", difficulty: "Easy", status: "Pending", description: "Check if a string reads the same forward and backward.", examples: [], hints: [], solution: "" }
        ]
    },
    {
        company: "Amazon",
        logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
        color: "orange",
        questions: [
            { id: 13, title: "Two Sum Problem", difficulty: "Easy", status: "Pending", description: "Find two numbers in an array that add up to a specific target.", examples: [], hints: [], solution: "" },
            { id: 14, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", status: "Pending", description: "Find the length of the longest substring without repeating characters.", examples: [], hints: [], solution: "" },
            { id: 15, title: "Merge K Sorted Lists", difficulty: "Hard", status: "Pending", description: "Merge k sorted linked lists and return it as one sorted list.", examples: [], hints: [], solution: "" },
            { id: 16, title: "Trapping Rain Water", difficulty: "Hard", status: "Pending", description: "Compute how much water can be trapped after raining.", examples: [], hints: [], solution: "" }
        ]
    },
    {
        company: "Google",
        logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        color: "red",
        questions: [
            { id: 17, title: "Median of Two Sorted Arrays", difficulty: "Hard", status: "Pending", description: "Find the median of two sorted arrays of different sizes.", examples: [], hints: [], solution: "" },
            { id: 18, title: "Container With Most Water", difficulty: "Medium", status: "Pending", description: "Find two lines that together with the x-axis form a container, such that the container contains the most water.", examples: [], hints: [], solution: "" },
            { id: 19, title: "Climbing Stairs", difficulty: "Easy", status: "Pending", description: "Count ways to reach the top of a staircase with n steps.", examples: [], hints: [], solution: "" }
        ]
    }

];

const LANGUAGES = {
    c: {
        name: "C",
        extension: "main.c",
        boilerplate: `#include <stdio.h>

int main() {
    // Write your code here
    printf("Hello, World!");
    return 0;
}`
    },
    cpp: {
        name: "C++",
        extension: "main.cpp",
        boilerplate: `#include <iostream>
using namespace std;

int main() {
    // Write your code here
    cout << "Hello, World!" << endl;
    return 0;
}`
    },
    python: {
        name: "Python",
        extension: "main.py",
        boilerplate: `def solve():
    # Write your code here
    print("Hello, World!")

if __name__ == "__main__":
    solve()`
    },
    java: {
        name: "Java",
        extension: "Main.java",
        boilerplate: `public class Main {
    public static void main(String[] args) {
        // Write your code here
        System.out.println("Hello, World!");
    }
}`
    }
};

type TestResult = {
    id: number;
    status: "Passed" | "Failed";
    input: string;
    output: string;
    expected: string;
};

type ExecutionResult = {
    status: "Accepted" | "Wrong Answer" | "Runtime Error";
    details: TestResult[];
    runtime: string; // e.g. "24ms"
};

const CodingPractice = () => {
    const [expandedCompany, setExpandedCompany] = useState<string | null>("TCS");
    const [completedQuestions, setCompletedQuestions] = useState<number[]>([]);
    const [selectedQuestion, setSelectedQuestion] = useState<any | null>(null);
    const [selectedLanguage, setSelectedLanguage] = useState<keyof typeof LANGUAGES>("python");
    const [userCode, setUserCode] = useState(LANGUAGES["python"].boilerplate);

    // LeetCode Style State
    const [isRunning, setIsRunning] = useState(false);
    const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
    const [activeTab, setActiveTab] = useState(0); // Index of the currently viewable test case result
    const [showHints, setShowHints] = useState(false);
    const [showSolution, setShowSolution] = useState(false);


    // Update code when language changes
    const handleLanguageChange = (lang: keyof typeof LANGUAGES) => {
        setSelectedLanguage(lang);
        setUserCode(LANGUAGES[lang].boilerplate);
    };

    const toggleQuestion = (id: number) => {
        if (completedQuestions.includes(id)) {
            setCompletedQuestions(completedQuestions.filter(qId => qId !== id));
        } else {
            setCompletedQuestions([...completedQuestions, id]);
        }
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setExecutionResult(null);
        setActiveTab(0);

        // Prepare test cases
        const testCases = (selectedQuestion?.examples && selectedQuestion.examples.length > 0)
            ? selectedQuestion.examples
            : [
                { input: "3", output: "6" },
                { input: "10", output: "55" },
                { input: "1", output: "1" }
            ];

        try {
            const response = await fetch("http://localhost:8000/execute", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    language: selectedLanguage,
                    code: userCode,
                    test_cases: testCases
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setExecutionResult({
                    status: data.status,
                    details: data.details,
                    runtime: data.runtime
                });
            } else {
                // Compilation error or other failure
                setExecutionResult({
                    status: "Runtime Error",
                    details: [],
                    runtime: "0ms"
                });
                alert(`Error: ${data.detail || data.error || "Unknown error occurred"}`);
            }

        } catch (error) {
            console.error("Execution failed:", error);
            alert("Failed to connect to the execution server. Ensure backend is running.");
        } finally {
            setIsRunning(false);
        }
    };

    if (selectedQuestion) {
        return (
            <div className="min-h-screen bg-black text-white p-4 animate-in fade-in slide-in-from-right duration-300">

                {/* Back Button */}
                <Button
                    variant="ghost"
                    onClick={() => { setSelectedQuestion(null); setExecutionResult(null); setIsRunning(false); setShowHints(false); setShowSolution(false); setUserCode(LANGUAGES["python"].boilerplate); setSelectedLanguage("python"); }}
                    className="mb-6 text-gray-400 hover:text-white"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to List
                </Button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-100px)]">

                    {/* Left Panel: Problem Statement */}
                    <div className="space-y-6 overflow-y-auto pr-4 pb-20 custom-scrollbar">
                        <div>
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent mb-2">{selectedQuestion.title}</h2>
                            <div className="flex gap-2">
                                <Badge variant="outline" className={`${selectedQuestion.difficulty === 'Easy' ? 'text-green-400 border-green-500/20' : selectedQuestion.difficulty === 'Medium' ? 'text-yellow-400 border-yellow-500/20' : 'text-red-400 border-red-500/20'}`}>
                                    {selectedQuestion.difficulty}
                                </Badge>
                                <span className="text-gray-500 text-sm flex items-center"><Building2 size={12} className="mr-1" /> Asked in {selectedQuestion.company}</span>
                            </div>
                        </div>

                        <div className="bg-gray-900/50 p-6 rounded-xl border border-white/5 space-y-4">
                            <h3 className="text-xl font-semibold text-white">Problem Description</h3>
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                                {selectedQuestion.description || "Detailed description pending..."}
                            </p>

                            {selectedQuestion.examples && selectedQuestion.examples.length > 0 && (
                                <div className="space-y-3 mt-4">
                                    <h4 className="font-semibold text-gray-200">Examples:</h4>
                                    {selectedQuestion.examples.map((ex: any, idx: number) => (
                                        <div key={idx} className="bg-black/40 p-3 rounded-lg border border-white/5 font-mono text-sm">
                                            <div><span className="text-gray-500">Input:</span> <span className="text-green-300">{ex.input}</span></div>
                                            <div><span className="text-gray-500">Output:</span> <span className="text-yellow-300">{ex.output}</span></div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Hints */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white flex items-center"><Lightbulb size={18} className="mr-2 text-yellow-400" /> Hints</h3>
                                <Button size="sm" variant="ghost" className="text-xs text-gray-400" onClick={() => setShowHints(!showHints)}>
                                    {showHints ? "Hide Hints" : "Show Hints"}
                                </Button>
                            </div>
                            {showHints && (
                                <ul className="list-disc list-inside text-gray-400 space-y-1 pl-2 animate-in fade-in slide-in-from-top-2 bg-yellow-400/5 p-4 rounded-lg border border-yellow-400/10">
                                    {selectedQuestion.hints && selectedQuestion.hints.length > 0 ? selectedQuestion.hints.map((h: string, i: number) => <li key={i}>{h}</li>) : <li>No specific hints for this problem. Think logically!</li>}
                                </ul>
                            )}
                        </div>

                        {/* Solution */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white flex items-center"><Unlock size={18} className="mr-2 text-red-400" /> Solution</h3>
                                <Button size="sm" variant="ghost" className="text-xs text-gray-400" onClick={() => setShowSolution(!showSolution)}>
                                    {showSolution ? "Hide Solution" : "Reveal Solution"}
                                </Button>
                            </div>
                            {showSolution && (
                                <div className="bg-black/60 p-4 rounded-xl border border-white/10 font-mono text-sm text-green-300 overflow-x-auto animate-in fade-in slide-in-from-top-2 relative">
                                    <div className="absolute top-2 right-2 text-xs text-gray-600">JavaScript</div>
                                    <pre>{selectedQuestion.solution || "// Solution not available yet."}</pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Panel: Code Editor & Result */}
                    <div className="flex flex-col gap-4 h-full">
                        {/* EDITOR */}
                        <div className="flex-1 bg-[#1e1e1e] rounded-xl border border-white/10 overflow-hidden flex flex-col shadow-2xl h-1/2">
                            <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-black">
                                <div className="flex items-center gap-2">
                                    {/* Language Selector */}
                                    <div className="flex items-center space-x-2">
                                        {(Object.keys(LANGUAGES) as Array<keyof typeof LANGUAGES>).map((lang) => (
                                            <button
                                                key={lang}
                                                onClick={() => handleLanguageChange(lang)}
                                                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${selectedLanguage === lang
                                                    ? "bg-blue-600 text-white"
                                                    : "bg-white/5 text-gray-400 hover:bg-white/10"
                                                    }`}
                                            >
                                                {LANGUAGES[lang].name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-gray-400 font-mono">{LANGUAGES[selectedLanguage].extension}</span>
                                    <Button
                                        size="sm"
                                        onClick={handleRunCode}
                                        disabled={isRunning}
                                        className="bg-green-600 hover:bg-green-700 text-white h-7 text-xs font-semibold px-4 transition-all active:scale-95"
                                    >
                                        {isRunning ? "Running..." : <><Play size={12} className="mr-2 fill-current" /> Run</>}
                                    </Button>
                                </div>
                            </div>
                            <Textarea
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                className="flex-1 bg-[#1e1e1e] border-none text-gray-300 font-mono resize-none focus-visible:ring-0 p-4 leading-relaxed custom-caret"
                                spellCheck={false}
                            />
                        </div>

                        {/* RESULT PANEL (LeetCode Style) */}
                        <div className={`h-1/2 bg-[#1e1e1e] rounded-xl border border-white/5 flex flex-col overflow-hidden transition-all duration-300 ${executionResult ? 'opacity-100' : 'opacity-80'}`}>

                            {/* Panel Header */}
                            <div className="bg-[#2d2d2d] px-4 py-2 border-b border-black flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-300 flex items-center">
                                    {executionResult ? (
                                        executionResult.status === "Accepted" ?
                                            <span className="text-green-500 flex items-center gap-2"><CheckCircle2 size={16} /> Accepted</span> :
                                            <span className="text-red-500 flex items-center gap-2"><CheckCircle2 size={16} className="rotate-45" /> Wrong Answer</span>
                                    ) : (
                                        <span className="text-gray-500">Test Result</span>
                                    )}
                                </span>
                                {executionResult && (
                                    <span className="text-xs text-gray-500">Runtime: {executionResult.runtime}</span>
                                )}
                            </div>

                            {/* Panel Content */}
                            <div className="flex-1 p-4 overflow-y-auto custom-scrollbar">
                                {!executionResult && !isRunning && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                                        <Code2 size={40} className="mb-2" />
                                        <p className="text-sm">Run your code to see results</p>
                                    </div>
                                )}

                                {isRunning && (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                                        <p className="text-xs">Running Tests...</p>
                                    </div>
                                )}

                                {executionResult && !isRunning && (
                                    <div className="space-y-4">
                                        {/* Case Tabs */}
                                        <div className="flex gap-2">
                                            {executionResult.details.map((res, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => setActiveTab(idx)}
                                                    className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${activeTab === idx
                                                        ? "bg-white/10 text-white"
                                                        : "bg-transparent text-gray-500 hover:bg-white/5"
                                                        }`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${res.status === "Passed" ? "bg-green-500" : "bg-red-500"}`}></span>
                                                    Case {idx + 1}
                                                </button>
                                            ))}
                                        </div>

                                        {/* Data Boxes */}
                                        <div className="space-y-3 animation-fade-in">
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Input</p>
                                                <div className="bg-[#2d2d2d] p-3 rounded-lg text-sm text-gray-300 font-mono border border-white/5">
                                                    {executionResult.details[activeTab].input}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Output</p>
                                                <div className={`p-3 rounded-lg text-sm font-mono border border-white/5 ${executionResult.details[activeTab].status === "Passed" ? "bg-[#2d2d2d] text-gray-300" : "bg-red-900/20 text-red-200 border-red-500/20"
                                                    }`}>
                                                    {executionResult.details[activeTab].output}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">Expected</p>
                                                <div className="bg-[#2d2d2d] p-3 rounded-lg text-sm text-gray-300 font-mono border border-white/5">
                                                    {executionResult.details[activeTab].expected}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto w-full animate-in fade-in zoom-in duration-500">
            {/* Header */}
            <div className="text-center space-y-4 mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                    Campus Coding Practice
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Master the most repeated coding questions from top recruiters.
                </p>
            </div>

            {/* Companies Grid */}
            <div className="grid grid-cols-1 gap-6">
                {COMPANY_QUESTIONS.map((item) => (
                    <Card key={item.company} className="bg-gray-900 border-gray-800 overflow-hidden">

                        {/* Company Header (Click to Expand) */}
                        <div
                            className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                            onClick={() => setExpandedCompany(expandedCompany === item.company ? null : item.company)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-lg h-12 w-12 flex items-center justify-center">
                                    <Building2 className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">{item.company}</h3>
                                    <p className="text-gray-400 text-sm">{item.questions.length} Questions</p>
                                </div>
                            </div>
                            {expandedCompany === item.company ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
                        </div>

                        {/* Questions List (Accordion Body) */}
                        <AnimatePresence>
                            {expandedCompany === item.company && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="border-t border-gray-800"
                                >
                                    <div className="p-6 space-y-3">
                                        {item.questions.map((q) => (
                                            <div
                                                key={q.id}
                                                className="flex items-center justify-between p-4 bg-black/40 rounded-xl border border-white/5 hover:border-emerald-500/30 transition-all group"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className={`rounded-full ${completedQuestions.includes(q.id) ? "text-green-500 bg-green-500/10" : "text-gray-600 hover:text-green-400"}`}
                                                        onClick={() => toggleQuestion(q.id)}
                                                    >
                                                        <CheckCircle2 />
                                                    </Button>
                                                    <div>
                                                        <h4 className={`font-medium text-lg ${completedQuestions.includes(q.id) ? "text-gray-500 line-through" : "text-gray-200"}`}>
                                                            {q.title}
                                                        </h4>
                                                        <Badge variant="outline" className={`mt-1 text-xs border-none 
                                                            ${q.difficulty === 'Easy' ? 'bg-green-500/10 text-green-400' :
                                                                q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' :
                                                                    'bg-red-500/10 text-red-400'}`
                                                        }>
                                                            {q.difficulty}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    className="border-gray-700 hover:bg-gray-800 text-gray-300"
                                                    onClick={() => { setSelectedQuestion({ ...q, company: item.company }); setExecutionResult(null); setIsRunning(false); setShowHints(false); setShowSolution(false); }}
                                                >
                                                    <Code2 className="mr-2 h-4 w-4" /> Practice
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CodingPractice;
