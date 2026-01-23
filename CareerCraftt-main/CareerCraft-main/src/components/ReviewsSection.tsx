import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Card } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const ReviewsSection = () => {
    // Initialize Embla Carousel with Autoplay plugin
    const [emblaRef] = useEmblaCarousel({ loop: true }, [
        Autoplay({ delay: 4000, stopOnInteraction: false })
    ]);

    const reviews = [
        {
            name: "Jessica Lee",
            role: "Software Engineer",
            rating: 5,
            text: "CareerCraft completely transformed my job search. The resume analyzer gave me specific feedback I hadn't thought of, and I landed interviews at 3 top tech companies!",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
        },
        {
            name: "David Kim",
            role: "Product Manager",
            rating: 5,
            text: "The mock interview feature is a game changer. It felt so real, and the feedback on my answers helped me refine my storytelling skills effectively.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
        },
        {
            name: "Samantha Roy",
            role: "Data Scientist",
            rating: 4,
            text: "I was struggling with ATS rejections. After using the optimization tools, my callback rate doubled. Highly recommend for anyone in a competitive market.",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
        },
        {
            name: "Marcus Johnson",
            role: "UX Designer",
            rating: 5,
            text: "Simply the best career tool I've used. The interface is beautiful, and the insights are actually actionable, not just generic advice.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
        }
    ];

    return (
        <section className="py-24 px-6 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[100px] -z-10" />

            <div className="max-w-6xl mx-auto">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        What Our Users Say
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Join thousands of professionals who have accelerated their careers.
                    </p>
                </div>

                {/* Carousel Viewport */}
                <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex -ml-4 touch-pan-y">
                        {reviews.map((review, index) => (
                            <div key={index} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.33%] min-w-0 pl-4">
                                <Card className="glass-card p-8 h-full border-white/5 relative flex flex-col hover-lift">
                                    <Quote className="absolute top-6 right-6 text-white/5" size={40} />

                                    <div className="flex items-center gap-1 mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
                                            />
                                        ))}
                                    </div>

                                    <p className="text-gray-300 mb-6 flex-grow leading-relaxed">
                                        "{review.text}"
                                    </p>

                                    <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                                        <img
                                            src={review.avatar}
                                            alt={review.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                                        />
                                        <div>
                                            <h4 className="font-semibold text-white">{review.name}</h4>
                                            <p className="text-xs text-muted-foreground">{review.role}</p>
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
