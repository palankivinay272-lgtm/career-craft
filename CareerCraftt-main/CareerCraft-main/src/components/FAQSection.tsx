import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection = () => {
    const faqs = [
        {
            question: "How does the Resume ATS Analyzer work?",
            answer: "Our AI scans your resume against industry-standard ATS (Applicant Tracking System) algorithms. It checks for keyword matching, formatting issues, and content relevance, providing you with a score and actionable tips to improve your chances of getting hired."
        },
        {
            question: "Is CareerCraft free to use?",
            answer: "We offer a generous free tier that includes basic resume analysis and job matching. For advanced features like unlimited mock interviews with detailed AI feedback and premium resume templates, we offer affordable subscription plans."
        },
        {
            question: "Can I use CareerCraft for any industry?",
            answer: "Yes! CareerCraft is trained on data from a wide range of industries including Tech, Finance, Healthcare, Marketing, and more. Our AI adapts its feedback based on the specific role and industry you are targeting."
        },
        {
            question: "How accurate is the Mock Interview AI?",
            answer: "Our Mock Interview AI uses advanced natural language processing to understand your responses in real-time. It evaluates criteria like clarity, relevance, confidence, and technical accuracy, providing feedback comparable to a human hiring manager."
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We take data privacy seriously. Your resumes and personal information are encrypted and not shared with third parties without your explicit consent."
        }
    ];

    return (
        <section className="py-20 px-6 bg-background/30">
            <div className="max-w-3xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Everything you need to know about CareerCraft.
                    </p>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`} className="glass-card px-6 border-border data-[state=open]:border-primary/50 transition-colors">
                            <AccordionTrigger className="text-left text-lg hover:text-primary transition-colors hover:no-underline py-6">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};

export default FAQSection;
