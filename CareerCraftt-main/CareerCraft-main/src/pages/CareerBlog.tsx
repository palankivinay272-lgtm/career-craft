import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Calendar, ArrowRight } from "lucide-react";

const CareerBlog = () => {
    const posts = [
        {
            title: "The Future of AI in Recruitment",
            excerpt: "How artificial intelligence is reshaping the hiring landscape and what it means for candidates.",
            author: "Sarah Johnson",
            date: "Mar 15, 2025",
            category: "Trends"
        },
        {
            title: "Mastering the Technical Interview",
            excerpt: "Essential strategies to crack coding interviews at top tech companies.",
            author: "David Chen",
            date: "Mar 10, 2025",
            category: "Interviewing"
        },
        {
            title: "Building a Personal Brand on LinkedIn",
            excerpt: "Tips and tricks to optimize your profile and attract recruiters.",
            author: "Emily Davis",
            date: "Mar 05, 2025",
            category: "Branding"
        }
    ];

    return (
        <div className="min-h-screen p-8 bg-black/50">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Career Blog
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Insights, trends, and advice to supercharge your career.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post, index) => (
                        <Card key={index} className="glass-card hover-lift p-6 border-white/5 flex flex-col justify-between">
                            <div className="space-y-4">
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                                    {post.category}
                                </Badge>
                                <h3 className="text-xl font-bold text-white leading-tight">
                                    {post.title}
                                </h3>
                                <p className="text-gray-400 text-sm">
                                    {post.excerpt}
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <User size={12} />
                                        <span>{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar size={12} />
                                        <span>{post.date}</span>
                                    </div>
                                </div>
                                <button className="w-full text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2 transition-colors">
                                    Read Article <ArrowRight size={14} />
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CareerBlog;
