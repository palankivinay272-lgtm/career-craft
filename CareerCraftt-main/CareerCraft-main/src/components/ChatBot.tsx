import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Loader2, Sparkles, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type Message = {
    id: number;
    role: "user" | "assistant";
    content: string;
};

export default function ChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, role: "assistant", content: "Hi! I'm CareerBot. How can I help you with your career journey today?" }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        // Add user message with unique ID
        setMessages((prev) => [...prev, { id: Date.now(), role: "user", content: userMsg }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8000/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg }),
            });

            if (!res.ok) throw new Error("Failed to fetch response");

            const data = await res.json();
            setMessages((prev) => [...prev, { id: Date.now() + 1, role: "assistant", content: data.reply }]);
        } catch (error) {
            console.error(error);
            setMessages((prev) => [
                ...prev,
                { id: Date.now() + 1, role: "assistant", content: "Sorry, I'm having trouble connecting to the server right now." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") handleSend();
    };

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white p-0 hover-bounce z-50 transition-all duration-300"
            >
                <MessageSquare className="h-7 w-7" />
            </Button>
        );
    }

    return (
        <div
            className={cn(
                "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col",
                isMinimized ? "w-72 h-14" : "w-[350px] sm:w-[400px] h-[500px]"
            )}
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-600/20 to-blue-600/20 border-b border-white/10">
                <div className="flex items-center space-x-2">
                    <div className="p-2 bg-gradient-to-br from-violet-600 to-blue-600 rounded-lg">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">CareerBot</h3>
                        {!isMinimized && <span className="text-xs text-green-400 flex items-center gap-1">● Online</span>}
                    </div>
                </div>
                <div className="flex items-center space-x-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/60 hover:text-white"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-white/60 hover:text-white"
                        onClick={() => setIsOpen(false)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            {!isMinimized && (
                <>
                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="flex flex-col space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex w-fit max-w-[80%] rounded-lg px-4 py-2 text-sm break-words",
                                        msg.role === "user"
                                            ? "ml-auto bg-violet-600 text-white"
                                            : "bg-white/10 text-white/90"
                                    )}
                                >
                                    {msg.content}
                                </div>
                            ))}
                            {loading && (
                                <div className="flex w-max max-w-[80%] rounded-lg px-4 py-2 bg-white/10 text-white/90">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-white/10 bg-black/40">
                        <div className="flex items-center space-x-2">
                            <Input
                                placeholder="Ask advice..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="bg-white/5 border-white/10 focus-visible:ring-violet-500 text-white placeholder:text-gray-500"
                            />
                            <Button
                                size="icon"
                                onClick={handleSend}
                                disabled={!input.trim() || loading}
                                className="bg-violet-600 hover:bg-violet-700 text-white"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
