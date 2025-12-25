import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { ArrowLeft, Share2, BookOpen, Clock, CheckCircle2 } from "lucide-react";
import * as Icons from "lucide-react";
import { getRoadmapById, getCategoryById } from "@/data/roadmaps";
import RoadmapNode from "@/components/RoadmapNode";
import Navbar from "@/components/Navigation";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const RoadmapDetail = () => {
  const { id } = useParams<{ id: string }>();
  const roadmap = getRoadmapById(id || "");
  const category = roadmap ? getCategoryById(roadmap.category) : null;

  const [completedNodes, setCompletedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(`roadmap-${id}-completed`);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleNode = (nodeId: string) => {
    setCompletedNodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      localStorage.setItem(`roadmap-${id}-completed`, JSON.stringify([...newSet]));
      return newSet;
    });
  };

  const progress = useMemo(() => {
    if (!roadmap) return 0;
    return Math.round((completedNodes.size / roadmap.nodes.length) * 100);
  }, [roadmap, completedNodes]);

  if (!roadmap) {
    return (
      <div className="min-h-screen bg-background">

        <div className="container mx-auto px-4 pt-32 text-center">
          <h1 className="text-2xl font-bold mb-4">Roadmap Not Found</h1>
          <Link to="/roadmaps">
            <Button>Back to Roadmaps</Button>
          </Link>
        </div>
      </div>
    );
  }

  const IconComponent = Icons[roadmap.icon as keyof typeof Icons] as React.ElementType;

  // Build a tree structure for better visualization
  const rootNodes = roadmap.nodes.filter(
    (node) => !roadmap.nodes.some((n) => n.children?.includes(node.id))
  );

  const getNodeDepth = (nodeId: string, depth = 0): number => {
    const parentNode = roadmap.nodes.find((n) => n.children?.includes(nodeId));
    if (!parentNode) return depth;
    return getNodeDepth(parentNode.id, depth + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* <Navbar /> */}

      {/* Hero */}
      <section className="relative pt-28 pb-8 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at top, hsl(${roadmap.color} / 0.2) 0%, transparent 50%)`,
          }}
        />

        <div className="container relative mx-auto px-4">
          <Link
            to="/roadmaps"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Roadmaps</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="flex items-center justify-center rounded-xl p-3"
                  style={{
                    backgroundColor: `hsl(${roadmap.color} / 0.15)`,
                  }}
                >
                  {IconComponent && (
                    <IconComponent
                      className="h-8 w-8"
                      style={{ color: `hsl(${roadmap.color})` }}
                    />
                  )}
                </div>
                <div>
                  {category && (
                    <span className="text-sm text-muted-foreground">
                      {category.name}
                    </span>
                  )}
                  <h1 className="text-2xl sm:text-3xl font-bold">{roadmap.title}</h1>
                </div>
              </div>
              <p className="text-muted-foreground max-w-2xl mb-6">
                {roadmap.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>{roadmap.nodes.length} topics</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>~{Math.ceil(roadmap.nodes.length * 1.5)} weeks</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{completedNodes.size} completed</span>
                </div>
              </div>
            </div>

            <div className="lg:w-64 shrink-0">
              <div className="rounded-xl border border-border bg-card p-4 card-gradient">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />

                <div className="mt-4 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                      }}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </div>

                  {/* Quiz Button */}
                  {(() => {
                    const quizMapping: Record<string, string> = {
                      "frontend": "Frontend Development",
                      "backend": "Backend Development",
                      "fullstack": "Full Stack Development",
                      "devops": "DevOps",
                      "data-science": "AI / ML",
                      "mobile-react-native": "React Native",
                      "cybersecurity": "Cyber Security",
                      "blockchain": "Blockchain",
                    };
                    const quizDomain = quizMapping[roadmap.id] || quizMapping[roadmap.category];

                    if (quizDomain) {
                      return (
                        <Link to={`/interview?domain=${encodeURIComponent(quizDomain)}`}>
                          <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" size="sm">
                            <Icons.BrainCircuit className="h-4 w-4 mr-2" />
                            Take Quiz
                          </Button>
                        </Link>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Content */}
      <section className="py-8 pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold mb-6">Learning Path</h2>

            <div className="space-y-3">
              {roadmap.nodes.map((node, index) => {
                const depth = getNodeDepth(node.id);
                return (
                  <div
                    key={node.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Connector line */}
                    {index > 0 && (
                      <div
                        className="h-3 w-0.5 bg-border mx-auto -mt-3 mb-0"
                        style={{ marginLeft: depth > 0 ? `${depth * 20 + 28}px` : "28px" }}
                      />
                    )}
                    <RoadmapNode
                      node={node}
                      color={roadmap.color}
                      isCompleted={completedNodes.has(node.id)}
                      onToggle={toggleNode}
                      depth={depth}
                    />
                  </div>
                );
              })}
            </div>

            {progress === 100 && (
              <div className="mt-8 p-6 rounded-xl border border-primary/50 bg-primary/10 text-center animate-scale-in">
                <div className="text-4xl mb-2">🎉</div>
                <h3 className="text-xl font-semibold mb-2">Congratulations!</h3>
                <p className="text-muted-foreground">
                  You've completed the {roadmap.title} roadmap!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoadmapDetail;