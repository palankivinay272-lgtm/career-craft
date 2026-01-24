import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import { categories, roadmaps } from "@/data/roadmaps";
// import CategorySection from "@/components/CategorySection";
import RoadmapCard from "@/components/RoadmapCard";
import { Input } from "@/components/ui/input";

const Roadmaps = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const query = searchParams.get("search");
    if (query) {
      setSearchQuery(query);
    }
  }, [searchParams]);

  const filteredRoadmaps = searchQuery
    ? roadmaps.filter(
      (r) =>
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : null;

  return (
    <div className="min-h-screen bg-background">


      {/* Hero */}
      <section className="relative pt-28 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-glow opacity-20" />
        <div className="container relative mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4 animate-fade-in">
              AI Learning <span className="text-gradient">Roadmaps</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 animate-fade-in" style={{ animationDelay: "100ms" }}>
              Structured learning paths to guide your career. Choose a domain and
              start your journey to mastery.
            </p>

            {/* Search */}
            <div className="relative max-w-md animate-fade-in" style={{ animationDelay: "200ms" }}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search roadmaps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-card border-border focus:border-primary"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          {filteredRoadmaps ? (
            <div>
              <h2 className="text-xl font-semibold mb-6">
                Search Results ({filteredRoadmaps.length})
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {filteredRoadmaps.map((roadmap, index) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
                ))}
              </div>
              {filteredRoadmaps.length === 0 && (
                <p className="text-center text-muted-foreground py-12">
                  No roadmaps found for "{searchQuery}"
                </p>
              )}
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-6">All Roadmaps</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {roadmaps.map((roadmap, index) => (
                  <RoadmapCard key={roadmap.id} roadmap={roadmap} index={index} />
                ))}
              </div>
            </div>
          )}


        </div>
      </section>
    </div>
  );
};

export default Roadmaps;