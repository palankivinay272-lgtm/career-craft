import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
    SheetTrigger
} from "@/components/ui/sheet";
import { User, Calendar, ArrowRight, Search, Clock, BookOpen, ChevronRight } from "lucide-react";

// Extended Mock Data with Content
const BLOG_POSTS = [
    {
        id: 1,
        title: "The Future of AI in Recruitment",
        excerpt: "How artificial intelligence is reshaping the hiring landscape and what it means for candidates in 2026.",
        content: `
            <p>Artificial Intelligence is no longer just a buzzword; it's the gatekeeper of modern employment. In 2026, over 85% of Fortune 500 companies use AI-driven Applicant Tracking Systems (ATS) not just to parse resumes, but to predict candidate success.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">The Shift from Keyword Matching to Semantic Analysis</h3>
            <p>Old school ATS looked for exact keyword matches. Modern AI understands context. It knows that "contributed to frontend architecture" implies knowledge of component lifecycles, even if you don't explicitly list every single framework feature. This means candidates need to write for semantic richness rather than keyword stuffing.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">AI Interviews: The New Normal</h3>
            <p>Automated video interviews are becoming standard for first-round screening. These tools analyze not just your answers, but your tone, pacing, and confidence. The key to cracking them? treating the camera like a person and structuring your answers using the STAR method.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">How to Adapt?</h3>
            <ul class="list-disc pl-5 space-y-2">
                <li>Optimize your resume for readability, not just bots.</li>
                <li>Practice speaking to AI interview agents.</li>
                <li>Focus on "Human" skills: Empathy, strategic thinking, and complex problem solving—things AI still struggles to replicate.</li>
            </ul>
        `,
        author: "Sarah Johnson",
        role: "HR Tech Specialist",
        date: "Mar 15, 2025",
        readTime: "5 min read",
        category: "Trends",
        image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Mastering the Technical Interview",
        excerpt: "Essential strategies to crack coding interviews at top tech companies like Google, Amazon, and Microsoft.",
        content: `
            <p>Technical interviews are a marathon, not a sprint. The landscape has shifted from pure algorithmic puzzles to practical system design and debugging scenarios.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">1. Data Structures & Algorithms (DSA)</h3>
            <p>While some say DSA is dying, it remains the filter for FAANG. Focus on patterns: Sliding Window, Two Pointers, and Graph BFS/DFS. Don't memorize solutions; internalize the patterns.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">2. System Design is King</h3>
            <p>For senior roles, System Design is the dealbreaker. can you design Instagram? Can you explain sharding, caching strategies, and CAP theorem trade-offs? Practice drawing architecture diagrams on whiteboards (virtual or physical).</p>
            <br/>
            <h3 class="text-lg font-bold text-white">3. Communication > Code</h3>
            <p>Interviewers care more about your thought process than the syntax. Speak your thoughts aloud. Explain *why* you chose a hash map over an array. If you get stuck, ask clarifying questions. It shows collaboration skills.</p>
        `,
        author: "David Chen",
        role: "Ex-Google Engineer",
        date: "Mar 10, 2025",
        readTime: "8 min read",
        category: "Interviewing",
        image: "https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Building a Personal Brand on LinkedIn",
        excerpt: "Tips and tricks to optimize your profile, create engaging content, and attract recruiters inbound.",
        content: `
            <p>Your LinkedIn profile is your 24/7 digital billboard. If it's silent, you're missing out on 70% of job opportunities that never hit job boards.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">The Headline Formula</h3>
            <p>Don't just write "Student at X University". Use the formula: <strong>Role | Unique Value Prop | Tech Stack</strong>. <br/>Example: <em>"Full Stack Developer | Building Scalable SaaS Solutions | React, Node.js, AWS"</em>.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">Engagement Strategy</h3>
            <p>Post consistently, but don't just brag. Share your learning journey. "Today I learned X and failed at Y" is more authentic and viral than "I got a certificate". Comment on industry leaders' posts to gain visibility.</p>
        `,
        author: "Emily Davis",
        role: "Career Coach",
        date: "Mar 05, 2025",
        readTime: "4 min read",
        category: "Branding",
        image: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "Remote Work: Surviving & Thriving",
        excerpt: "How to stay productive, maintain work-life balance, and avoid burnout in a fully remote environment.",
        content: `
            <p>Remote work offers freedom, but it demands discipline. Without the separation of 'office' and 'home', burnout is a silent killer.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">Design Your Workspace</h3>
            <p>Don't work from your bed. Your brain needs a physical trigger to switch into 'work mode'. Even a dedicated corner of a table helps.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">Over-Communication</h3>
            <p>In remote teams, silence is ambiguous. Over-communicate your progress. Use status updates, async video messages (Loom), and clear documentation to keep stakeholders aligned.</p>
        `,
        author: "Michael Scott",
        role: "Remote Lead",
        date: "Feb 28, 2025",
        readTime: "6 min read",
        category: "Remote Work",
        image: "https://images.unsplash.com/photo-1593642632823-8f78566777ed?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        title: "Salary Negotiation 101",
        excerpt: "Never leave money on the table. A guide to researching market rates and asking for what you're worth.",
        content: `
            <p>The biggest mistake candidates make is accepting the first offer. Companies expect you to negotiate.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">Know Your Number</h3>
            <p>Use Levels.fyi, Glassdoor, and Blind to find the exact pay bands for your role and location. Knowledge is leverage.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">The Script</h3>
            <p>"I'm really excited about the role. Based on my research and experience, I was looking for something in the range of X to Y. Can we bridge that gap?"</p>
        `,
        author: "Jessica Pearson",
        role: "Talent Acquisition",
        date: "Feb 20, 2025",
        readTime: "5 min read",
        category: "Career Growth",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        title: "The Rise of Full Stack Data Science",
        excerpt: "Why companies are looking for Data Scientists who can also deploy models and build APIs.",
        content: `
            <p> The era of the "Notebook Data Scientist" is fading. Companies now want "Full Stack Data Scientists" or "ML Engineers" who can take a model from experimentation to production.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">Technical Requirements</h3>
            <p>You need to know Docker, API development (FastAPI/Flask), and Cloud deployment (AWS SageMaker/Lambda). Your model is useless if it lives in a toggle-locked Jupyter notebook.</p>
        `,
        author: "Alex K.",
        role: "Lead Data Scientist",
        date: "Feb 15, 2025",
        readTime: "7 min read",
        category: "Trends",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 7,
        title: "Dealing with Imposter Syndrome",
        excerpt: "Feeling like a fraud? You're not alone. Strategies to build confidence and own your achievements.",
        content: `
            <p>70% of high achievers experience imposter syndrome. It's that nagging voice saying "You just got lucky" or "They're going to find out you don't know anything".</p>
            <br/>
            <h3 class="text-lg font-bold text-white">Document Your Wins</h3>
            <p>Keep a "Brag Document". Every Friday, write down 3 things you learned or fixed. Review this when you feel incompetent. Facts beat feelings.</p>
        `,
        author: "Dr. Linda M.",
        role: "Psychologist",
        date: "Feb 10, 2025",
        readTime: "4 min read",
        category: "Soft Skills",
        image: "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 8,
        title: "The Art of Cold Emailing",
        excerpt: "How to skip the application queue by reaching out directly to hiring managers and founders.",
        content: `
            <p>Sending a generic resume into a portal is a black hole. Cold emailing can get you a 15-minute chat that changes your career.</p>
            <br/>
            <h3 class="text-lg font-bold text-white">The Template</h3>
            <p>"Hi [Name], I saw you're building X at [Company]. I recently built a similar project [Link] and solved the Y problem you mentioned in your recent post. I'd love to share my findings..."</p>
            <p>Be brief. Be relevant. Give value before you ask for a job.</p>
        `,
        author: "Tim Ferris",
        role: "Entrepreneur",
        date: "Feb 01, 2025",
        readTime: "3 min read",
        category: "Networking",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
    }
];

const CATEGORIES = ["All", "Trends", "Interviewing", "Branding", "Remote Work", "Career Growth", "Soft Skills", "Networking"];

const CareerBlog = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Filter Logic
    const filteredPosts = BLOG_POSTS.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen p-8 bg-black/50">
            <div className="max-w-7xl mx-auto space-y-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                            Career Insights
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl">
                            Expert advice, industry trends, and actionable tips to accelerate your professional journey.
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative w-full md:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <Input
                            placeholder="Search articles..."
                            className="pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 pb-4 border-b border-white/5">
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === category
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-900/20"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Blog Grid */}
                {filteredPosts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPosts.map((post) => (
                            <Sheet key={post.id}>
                                <SheetTrigger asChild>
                                    <div className="cursor-pointer group">
                                        <Card className="h-full glass-card hover-lift border-white/5 flex flex-col overflow-hidden bg-black/20 backdrop-blur-xl">
                                            {/* Image Section */}
                                            <div className="h-48 overflow-hidden relative">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                <img
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                />
                                                <Badge className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md border-white/10 text-white hover:bg-black/70">
                                                    {post.category}
                                                </Badge>
                                            </div>

                                            {/* Content Section */}
                                            <div className="p-6 flex flex-col flex-grow space-y-4">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2 text-xs text-purple-400">
                                                        <Clock size={12} />
                                                        <span>{post.readTime}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-purple-400 transition-colors">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold text-white">
                                                            {post.author.charAt(0)}
                                                        </div>
                                                        <div className="text-xs">
                                                            <p className="text-white font-medium">{post.author}</p>
                                                            <p className="text-gray-500">{post.date}</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all">
                                                        <ChevronRight size={20} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                </SheetTrigger>

                                {/* Full Article Sheet */}
                                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-gray-950 border-l-white/10 p-0">
                                    <div className="relative h-64 w-full">
                                        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-transparent" />
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="absolute top-4 left-4 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md border-none"
                                        >
                                            {post.category}
                                        </Button>
                                    </div>

                                    <div className="p-8 space-y-6">
                                        <SheetHeader className="space-y-4 text-left">
                                            <SheetTitle className="text-3xl font-bold text-white leading-tight">
                                                {post.title}
                                            </SheetTitle>
                                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <User size={14} />
                                                    <span>{post.author} ({post.role})</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{post.date}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock size={14} />
                                                    <span>{post.readTime}</span>
                                                </div>
                                            </div>
                                        </SheetHeader>

                                        <div className="h-px bg-white/10 my-6" />

                                        {/* Discussion Content (Injected HTML) */}
                                        <div
                                            className="prose prose-invert prose-purple max-w-none text-gray-300 leading-relaxed space-y-4"
                                            dangerouslySetInnerHTML={{ __html: post.content }}
                                        />

                                        <div className="h-px bg-white/10 my-8" />

                                        <div className="bg-white/5 rounded-xl p-6 border border-white/5">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                                    <BookOpen size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="text-white font-bold">Want more insights?</h4>
                                                    <p className="text-sm text-gray-400 mt-1">
                                                        Subscribe to our customized career roadmap to get personalized learning paths.
                                                    </p>
                                                    <Button
                                                        className="mt-4 bg-purple-600 hover:bg-purple-700 text-white"
                                                        onClick={() => navigate("/roadmaps")}
                                                    >
                                                        Explore Roadmaps
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                            <Search size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white">No articles found</h3>
                        <p className="text-gray-400 mt-2">Try adjusting your search or category filter.</p>
                        <Button
                            variant="link"
                            className="text-purple-400 mt-2"
                            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
                        >
                            Clear filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CareerBlog;
