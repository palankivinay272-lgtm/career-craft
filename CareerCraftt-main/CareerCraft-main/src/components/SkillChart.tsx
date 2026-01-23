import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
    Tooltip
} from 'recharts';
import { Card } from "@/components/ui/card";

interface SkillChartProps {
    data: {
        subject: string;
        A: number;
        fullMark: number;
    }[];
}

const SkillChart = ({ data }: SkillChartProps) => {
    return (
        <Card className="glass-card p-6 border-white/10 h-full">
            <h3 className="text-xl font-semibold mb-6 text-white text-center">Skill Analytics</h3>
            <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                        <PolarGrid stroke="#ffffff30" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: '#9ca3af', fontSize: 12 }}
                        />
                        <PolarRadiusAxis
                            angle={30}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Skill Level"
                            dataKey="A"
                            stroke="#a855f7" // Purple-500
                            fill="#a855f7"
                            fillOpacity={0.5}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#000', borderColor: '#333' }}
                            itemStyle={{ color: '#fff' }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>
            <p className="text-xs text-center text-gray-500 mt-2">
                Based on your interview performance and analysis.
            </p>
        </Card>
    );
};

export default SkillChart;
