import { Github, Linkedin, Twitter } from "lucide-react";
import avinashImg from "../assets/avinash.jpeg";
import tejaImg from "../assets/teja.jpg";
import vinayImg from "../assets/vinay.jpg";

const TeamSection = () => {
    const team = [
        {
            name: "Avinash Kotavenuka",
            role: "Founder & CEO",
            image: avinashImg,
            bio: "Visionary leader passionate about AI and career development."
        },
        {
            name: "Palanki Vinay",
            role: "CTO",
            image: vinayImg,
            bio: "Tech innovator with 10+ years in machine learning and scalable systems."
        },
        {
            name: "Teja Vardhan",
            role: "Head of Product",
            image: tejaImg,
            bio: "Product strategist focused on creating intuitive user experiences."
        }
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Dynamic Background */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-[100px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-600/20 rounded-full blur-[100px] -z-10 animate-pulse-slow delay-1000" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-20">
                    <h2 className="text-5xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                        The Minds Behind The Magic
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto font-light">
                        Innovators, dreamers, and builders crafting the future of your career.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {team.map((member, index) => (
                        <div key={index} className="group relative">
                            {/* Glowing effect on hover */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl opacity-50 group-hover:opacity-100 blur transition duration-500"></div>

                            {/* Card Content */}
                            <div className="relative h-full bg-black rounded-2xl p-6 flex flex-col items-center text-center transition-transform duration-500 group-hover:-translate-y-2 border border-white/10">

                                {/* Image Container */}
                                <div className="relative w-40 h-40 mb-6 rounded-full p-1 bg-gradient-to-tr from-purple-500 to-cyan-500">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover rounded-full border-4 border-black transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {/* Decoration */}
                                    <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-black z-10 box-content"></div>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 transition-colors">
                                    {member.name}
                                </h3>

                                <span className="inline-block px-3 py-1 bg-white/5 rounded-full text-xs font-medium text-cyan-400 mb-4 border border-cyan-500/20">
                                    {member.role}
                                </span>

                                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-grow">
                                    {member.bio}
                                </p>

                                {/* Social Links - Reveal on Hover */}
                                <div className="flex gap-4 pt-6 border-t border-white/5 w-full justify-center">
                                    <a href="#" className="transform transition-all duration-300 hover:scale-125 hover:text-blue-400 text-gray-500">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href="#" className="transform transition-all duration-300 hover:scale-125 hover:text-sky-400 text-gray-500">
                                        <Twitter size={20} />
                                    </a>
                                    <a href="#" className="transform transition-all duration-300 hover:scale-125 hover:text-white text-gray-500">
                                        <Github size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TeamSection;
