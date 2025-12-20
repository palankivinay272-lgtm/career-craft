// src/components/RoadmapCard.tsx
import { Link } from "react-router-dom";
import type { Roadmap } from "@/data/roadmaps";
import * as Icons from "lucide-react";
import { ArrowRight } from "lucide-react";

interface RoadmapCardProps {
  roadmap: Roadmap;   // 👈 prop name is "roadmap"
  index: number;
}

const RoadmapCard = ({ roadmap, index }: RoadmapCardProps) => {
  const IconComponent =
    Icons[roadmap.icon as keyof typeof Icons] as React.ElementType;

  return (
    <Link
      to={`/roadmap/${roadmap.id}`}
      className="group relative block"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(ellipse at center, hsl(${roadmap.color} / 0.1) 0, transparent 70%)`,
          }}
        />

        <div className="relative z-10">
          <div
            className="mb-4 inline-flex items-center justify-center rounded-lg p-3 transition-transform group-hover:scale-110"
            style={{ backgroundColor: `hsl(${roadmap.color} / 0.15)` }}
          >
            <IconComponent
              className="h-6 w-6"
              style={{ color: `hsl(${roadmap.color})` }}
            />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
            {roadmap.title}
          </h3>
          <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
            {roadmap.description}
          </p>

          <div className="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Start Learning</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>

          <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-secondary text-xs text-muted-foreground">
            {roadmap.nodes.length} topics
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RoadmapCard;