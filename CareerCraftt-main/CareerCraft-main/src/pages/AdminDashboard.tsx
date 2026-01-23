import { useEffect, useState } from "react";
import { Users, FileText, Briefcase, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 142, // Mock for now, connect to backend later
        resumesAnalyzed: 89,
        jobsPosted: 12,
        activePlacements: 5
    });

    return (
        <div className="min-h-screen bg-app-dark text-white p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
                    <p className="text-gray-400">Welcome back, Admin. Here is what's happening today.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Students"
                        value={stats.totalUsers}
                        icon={Users}
                        color="text-blue-400"
                        bgColor="bg-blue-500/10"
                        borderColor="border-blue-500/20"
                    />
                    <StatCard
                        title="Resumes Analyzed"
                        value={stats.resumesAnalyzed}
                        icon={FileText}
                        color="text-purple-400"
                        bgColor="bg-purple-500/10"
                        borderColor="border-purple-500/20"
                    />
                    <StatCard
                        title="Active Job Listings"
                        value={stats.jobsPosted}
                        icon={Briefcase}
                        color="text-green-400"
                        bgColor="bg-green-500/10"
                        borderColor="border-green-500/20"
                    />
                    <StatCard
                        title="Placements"
                        value={stats.activePlacements}
                        icon={TrendingUp}
                        color="text-orange-400"
                        bgColor="bg-orange-500/10"
                        borderColor="border-orange-500/20"
                    />
                </div>

                {/* Recent Activity / Charts Placeholder */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-semibold mb-4">Recent Signups</h3>
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400" />
                                        <div>
                                            <p className="font-medium">Student {i}</p>
                                            <p className="text-xs text-gray-400">Joined 2 hours ago</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Active</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-6 rounded-2xl border border-white/10">
                        <h3 className="text-xl font-semibold mb-4">Placement Overview</h3>
                        <div className="h-48 flex items-center justify-center text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                            Charts coming soon
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

const StatCard = ({ title, value, icon: Icon, color, bgColor, borderColor }: any) => (
    <div className={`p-6 rounded-2xl border ${borderColor} ${bgColor} backdrop-blur-sm`}>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-3 rounded-xl bg-white/5 ${color}`}>
                <Icon size={24} />
            </div>
            <span className="text-xs font-medium text-gray-400 bg-black/20 px-2 py-1 rounded">+12% from last week</span>
        </div>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        <p className="text-sm text-gray-400">{title}</p>
    </div>
);
