import { RoadmapNode as NodeType } from "@/data/roadmaps.tsx";
import { Check, Circle, PlayCircle, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface RoadmapNodeProps {
  node: NodeType;
  color: string;
  isCompleted: boolean;
  onToggle: (id: string) => void;
  depth: number;
}

const RoadmapNode = ({ node, color, isCompleted, onToggle, depth }: RoadmapNodeProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`roadmap-node cursor-pointer relative group ${isCompleted ? "completed" : ""}`}
      style={{
        borderColor: isCompleted ? `hsl(${color})` : undefined,
        backgroundColor: isCompleted ? `hsl(${color} / 0.1)` : undefined,
        marginLeft: depth > 0 ? `${depth * 20}px` : undefined,
      }}
      onClick={() => onToggle(node.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-3">
        {/* Checkbox Circle */}
        <div
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 ${
            isCompleted
              ? "border-primary bg-primary"
              : "border-muted-foreground/30"
          }`}
          style={{
            borderColor: isCompleted ? `hsl(${color})` : undefined,
            backgroundColor: isCompleted ? `hsl(${color})` : undefined,
          }}
        >
          {isCompleted ? (
            <Check className="h-3 w-3 text-background" />
          ) : (
            <Circle className="h-2 w-2 text-muted-foreground/30" />
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium transition-colors ${
              isCompleted ? "text-foreground" : "text-foreground/80"
            }`}
          >
            {node.title}
          </h4>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {node.description}
          </p>
        </div>

        {/* PLAYLIST BUTTON (Only shows if playlistUrl exists) */}
        {node.playlistUrl && (
          <div className="shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 bg-background hover:bg-accent border-primary/20 hover:border-primary/50"
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggling the node when clicking the button
                window.open(node.playlistUrl, "_blank");
              }}
            >
              <PlayCircle className="h-4 w-4 text-red-500" />
              <span className="hidden sm:inline text-xs font-medium">Watch Tutorial</span>
            </Button>
          </div>
        )}
      </div>

      {isHovered && !isCompleted && !node.playlistUrl && (
        <div className="mt-2 text-xs text-primary animate-fade-in pl-8">
          Click to mark as completed
        </div>
      )}
    </div>
  );
};

export default RoadmapNode;