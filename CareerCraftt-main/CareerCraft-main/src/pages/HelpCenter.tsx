import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, HelpCircle, FileText, Settings, User } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HelpCenter = () => {
    return (
        <div className="min-h-screen p-8 bg-black/50">
            <div className="max-w-4xl mx-auto space-y-12">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        How can we help?
                    </h1>

                    <div className="relative max-w-xl mx-auto mt-6">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            placeholder="Search for answers..."
                            className="pl-10 py-6 bg-white/5 border-white/10 text-white placeholder:text-gray-500 rounded-full focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="glass-card p-6 border-white/5 hover:border-blue-500/30 transition-all cursor-pointer text-center">
                        <FileText className="w-10 h-10 text-blue-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-white">Getting Started</h3>
                    </Card>
                    <Card className="glass-card p-6 border-white/5 hover:border-blue-500/30 transition-all cursor-pointer text-center">
                        <User className="w-10 h-10 text-purple-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-white">Account & Profile</h3>
                    </Card>
                    <Card className="glass-card p-6 border-white/5 hover:border-blue-500/30 transition-all cursor-pointer text-center">
                        <Settings className="w-10 h-10 text-pink-400 mx-auto mb-4" />
                        <h3 className="font-semibold text-white">Technical Support</h3>
                    </Card>
                </div>

                <Card className="glass-card p-8 border-white/10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
                        <HelpCircle className="text-blue-500" />
                        Frequently Asked Questions
                    </h2>

                    <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline hover:text-blue-400">
                                Is CareerCraft free to use?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                Yes! CareerCraft offers a free tier with access to resume building and basic job matching. Premium features like advanced ATS analysis and unlimited mock interviews are available in our Pro plan.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-2" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline hover:text-blue-400">
                                How does the AI Resume Analyzer work?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                Our AI scans your resume against job descriptions to identify keywords, formatting issues, and skill gaps, giving you a compatibility score and actionable feedback.
                            </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-white/10">
                            <AccordionTrigger className="text-white hover:no-underline hover:text-blue-400">
                                Can I delete my account?
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-400">
                                Yes, you can permanently delete your account and all associated data from the Profile settings page.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </Card>
            </div>
        </div>
    );
};

export default HelpCenter;
