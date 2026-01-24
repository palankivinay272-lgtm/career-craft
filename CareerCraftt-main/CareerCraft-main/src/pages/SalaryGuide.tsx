import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, MapPin, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SalaryGuide = () => {
    const navigate = useNavigate();

    const roleToRoadmapQuery: Record<string, string> = {
        "Software Engineer (SDE I)": "Full Stack Developer",
        "Senior Software Engineer": "Full Stack Developer",
        "Frontend Developer": "Frontend Developer",
        "Backend Developer": "Backend Developer",
        "DevOps Engineer": "DevOps Engineer",
        "Full Stack Developer": "Full Stack Developer",
        "Data Scientist": "Data Scientist",
        "Data Analyst": "Data Scientist",
        "Machine Learning Engineer": "Machine Learning Engineer",
        "AI Research Scientist": "AI Research Scientist",
        "Product Manager": "Product Manager",
        "UI/UX Designer": "UI/UX Designer",
        "Product Designer": "UI/UX Designer",
    };

    const handleRoleClick = (roleTitle: string) => {
        const query = roleToRoadmapQuery[roleTitle] || roleTitle;
        navigate(`/roadmaps?search=${encodeURIComponent(query)}`);
    };

    const categories = [
        {
            name: "Engineering",
            roles: [
                { title: "Software Engineer (SDE I)", range: "₹8L - ₹18L", trend: "+12%", location: "Remote/Hybrid" },
                { title: "Senior Software Engineer", range: "₹20L - ₹45L", trend: "+10%", location: "Bangalore/Gurgaon" },
                { title: "Frontend Developer", range: "₹6L - ₹15L", trend: "+8%", location: "Remote" },
                { title: "Backend Developer", range: "₹8L - ₹20L", trend: "+14%", location: "Remote/Hybrid" },
                { title: "DevOps Engineer", range: "₹10L - ₹25L", trend: "+18%", location: "Hyderabad/Pune" },
                { title: "Full Stack Developer", range: "₹10L - ₹22L", trend: "+15%", location: "Major Cities" }
            ]
        },
        {
            name: "Data & AI",
            roles: [
                { title: "Data Scientist", range: "₹12L - ₹30L", trend: "+15%", location: "Bangalore/Hyderabad" },
                { title: "Data Analyst", range: "₹5L - ₹12L", trend: "+7%", location: "Remote/Hybrid" },
                { title: "Machine Learning Engineer", range: "₹15L - ₹40L", trend: "+25%", location: "Bangalore/Remote" },
                { title: "AI Research Scientist", range: "₹25L - ₹60L", trend: "+20%", location: "Bangalore" }
            ]
        },
        {
            name: "Product & Design",
            roles: [
                { title: "Product Manager", range: "₹15L - ₹35L", trend: "+10%", location: "Mumbai/Bangalore" },
                { title: "UI/UX Designer", range: "₹6L - ₹18L", trend: "+12%", location: "Remote" },
                { title: "Product Designer", range: "₹10L - ₹25L", trend: "+9%", location: "Hybrid" }
            ]
        }
    ];

    return (
        <div className="min-h-screen p-8 bg-black/50">
            <div className="max-w-7xl mx-auto space-y-12">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                        Salary Guide (India)
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Explore compensation trends and market rates for top tech roles in India.
                    </p>
                </div>

                <div className="space-y-12">
                    {categories.map((category, catIndex) => (
                        <div key={catIndex}>
                            <h2 className="text-2xl font-bold text-white mb-6 border-l-4 border-yellow-500 pl-4">
                                {category.name}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.roles.map((role, index) => (
                                    <Card
                                        key={index}
                                        className="glass-card hover-lift p-6 border-white/5 cursor-pointer transition-all hover:border-yellow-500/50"
                                        onClick={() => handleRoleClick(role.title)}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-white/5 rounded-lg">
                                                <Briefcase className="w-6 h-6 text-yellow-500" />
                                            </div>
                                            <div className="flex items-center text-green-400 text-sm font-medium bg-green-500/10 px-2 py-0.5 rounded">
                                                <TrendingUp size={12} className="mr-1" />
                                                {role.trend}
                                            </div>
                                        </div>

                                        <h3 className="text-lg font-bold text-white mb-1">{role.title}</h3>
                                        <p className="text-2xl font-semibold text-white mb-4">{role.range}</p>

                                        <div className="flex items-center text-gray-400 text-sm">
                                            <MapPin size={14} className="mr-1" />
                                            {role.location}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <Card className="glass-card p-8 border-white/10 mt-8">
                    <h2 className="text-xl font-semibold text-white mb-4">How values are calculated</h2>
                    <p className="text-gray-400 leading-relaxed">
                        Salaries are aggregated from anonymous submissions, third-party data sources (like AmbitionBox, Glassdoor), and current market trends in India.
                        Actual compensation can vary significantly based on experience (Fresher vs. Senior), location (Tier 1 vs. Tier 2 cities), company type (Startup vs. MNC), and negotiation skills.
                        Use this guide as a baseline for your next offer negotiation.
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default SalaryGuide;
