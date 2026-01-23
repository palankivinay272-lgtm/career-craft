import { Card } from "@/components/ui/card";
import { Github, Linkedin, Twitter } from "lucide-react";

const TeamSection = () => {
    const team = [
        {
            name: "Alex Johnson",
            role: "Founder & CEO",
            image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500&h=500&fit=crop",
            bio: "Visionary leader passionate about AI and career development."
        },
        {
            name: "Sarah Chen",
            role: "CTO",
            image: "https://images.unsplash.com/photo-1573496359-136d4755f3dc?w=500&h=500&fit=crop",
            bio: "Tech innovator with 10+ years in machine learning and scalable systems."
        },
        {
            name: "Michael Davis",
            role: "Head of Product",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=500&fit=crop",
            bio: "Product strategist focused on creating intuitive user experiences."
        },
        {
            name: "Emily Wilson",
            role: "Lead Designer",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&h=500&fit=crop",
            bio: "Creative mind crafting beautiful and accessible interfaces."
        }
    ];

    return (
        <section className="py-20 px-6 bg-black/20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        Meet Our Team
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        The passionate minds behind CareerCraft dedicated to your success.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member, index) => (
                        <Card key={index} className="glass-card p-0 overflow-hidden group hover-lift border-white/5">
                            <div className="relative aspect-square overflow-hidden">
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                                    <div className="flex gap-4">
                                        <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-colors">
                                            <Linkedin size={20} />
                                        </a>
                                        <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-colors">
                                            <Twitter size={20} />
                                        </a>
                                        <a href="#" className="p-2 bg-white/10 rounded-full hover:bg-white/20 hover:text-white transition-colors">
                                            <Github size={20} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 text-center space-y-2">
                                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                <p className="text-purple-400 font-medium text-sm">{member.role}</p>
                                <p className="text-gray-400 text-sm line-clamp-2">{member.bio}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
