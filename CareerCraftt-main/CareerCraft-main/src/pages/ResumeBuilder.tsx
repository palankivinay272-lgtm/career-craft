import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Download, Save, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

const ResumeBuilder = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [resumeData, setResumeData] = useState({
        fullName: "",
        email: "",
        phone: "",
        summary: "",
        education: [{ school: "", degree: "", year: "" }],
        experience: [{ company: "", role: "", duration: "", details: "" }],
        skills: ""
    });

    const handleInputChange = (field: string, value: string) => {
        setResumeData(prev => ({ ...prev, [field]: value }));
    };

    const handleArrayChange = (section: "education" | "experience", index: number, field: string, value: string) => {
        const newSection = [...resumeData[section]];
        // @ts-ignore
        newSection[index][field] = value;
        setResumeData(prev => ({ ...prev, [section]: newSection }));
    };

    const addField = (section: "education" | "experience") => {
        if (section === "education") {
            setResumeData(prev => ({
                ...prev,
                education: [...prev.education, { school: "", degree: "", year: "" }]
            }));
        } else {
            setResumeData(prev => ({
                ...prev,
                experience: [...prev.experience, { company: "", role: "", duration: "", details: "" }]
            }));
        }
    };

    const removeField = (section: "education" | "experience", index: number) => {
        const newSection = [...resumeData[section]];
        newSection.splice(index, 1);
        setResumeData(prev => ({ ...prev, [section]: newSection }));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row">

            {/* LEFT: FORM WIZARD */}
            <div className="w-full lg:w-1/2 p-6 overflow-y-auto h-screen border-r border-white/10 no-print">
                <div className="max-w-xl mx-auto space-y-8">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                        Resume Builder
                    </h1>

                    {/* Steps */}
                    <div className="flex space-x-2 mb-6">
                        {[1, 2, 3, 4].map(step => (
                            <div
                                key={step}
                                onClick={() => setActiveStep(step)}
                                className={`h-2 flex-1 rounded-full cursor-pointer transition-all ${activeStep >= step ? "bg-cyan-500" : "bg-gray-800"}`}
                            />
                        ))}
                    </div>

                    {/* Step 1: Personal Info */}
                    {activeStep === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <h2 className="text-xl font-semibold">Personal Information</h2>
                            <Input
                                placeholder="Full Name"
                                value={resumeData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                className="bg-gray-900 border-gray-700"
                            />
                            <Input
                                placeholder="Email Address"
                                value={resumeData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className="bg-gray-900 border-gray-700"
                            />
                            <Input
                                placeholder="Phone Number"
                                value={resumeData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className="bg-gray-900 border-gray-700"
                            />
                            <Textarea
                                placeholder="Professional Summary (2-3 sentences)"
                                value={resumeData.summary}
                                onChange={(e) => handleInputChange("summary", e.target.value)}
                                className="bg-gray-900 border-gray-700 h-32"
                            />
                        </div>
                    )}

                    {/* Step 2: Education */}
                    {activeStep === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <h2 className="text-xl font-semibold">Education</h2>
                            {resumeData.education.map((edu, index) => (
                                <Card key={index} className="p-4 bg-gray-900 border-gray-800 space-y-3 relative">
                                    <Input
                                        placeholder="School / University"
                                        value={edu.school}
                                        onChange={(e) => handleArrayChange("education", index, "school", e.target.value)}
                                        className="bg-black border-gray-700"
                                    />
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Degree / Major"
                                            value={edu.degree}
                                            onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)}
                                            className="bg-black border-gray-700"
                                        />
                                        <Input
                                            placeholder="Year"
                                            value={edu.year}
                                            onChange={(e) => handleArrayChange("education", index, "year", e.target.value)}
                                            className="bg-black border-gray-700 w-24"
                                        />
                                    </div>
                                    {index > 0 && (
                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 text-red-500 hover:text-red-400" onClick={() => removeField("education", index)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </Card>
                            ))}
                            <Button onClick={() => addField("education")} variant="outline" className="w-full border-dashed border-gray-700 text-gray-400 hover:text-white">
                                <Plus size={16} className="mr-2" /> Add Education
                            </Button>
                        </div>
                    )}

                    {/* Step 3: Experience */}
                    {activeStep === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <h2 className="text-xl font-semibold">Experience</h2>
                            {resumeData.experience.map((exp, index) => (
                                <Card key={index} className="p-4 bg-gray-900 border-gray-800 space-y-3 relative">
                                    <Input
                                        placeholder="Company Name"
                                        value={exp.company}
                                        onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                                        className="bg-black border-gray-700"
                                    />
                                    <div className="flex space-x-2">
                                        <Input
                                            placeholder="Job Title"
                                            value={exp.role}
                                            onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)}
                                            className="bg-black border-gray-700"
                                        />
                                        <Input
                                            placeholder="Duration (e.g. 2022 - Present)"
                                            value={exp.duration}
                                            onChange={(e) => handleArrayChange("experience", index, "duration", e.target.value)}
                                            className="bg-black border-gray-700 w-40"
                                        />
                                    </div>
                                    <Textarea
                                        placeholder="Job details / achievements..."
                                        value={exp.details}
                                        onChange={(e) => handleArrayChange("experience", index, "details", e.target.value)}
                                        className="bg-black border-gray-700 h-24"
                                    />
                                    {index > 0 && (
                                        <Button variant="ghost" size="icon" className="absolute top-1 right-1 text-red-500 hover:text-red-400" onClick={() => removeField("experience", index)}>
                                            <Trash2 size={16} />
                                        </Button>
                                    )}
                                </Card>
                            ))}
                            <Button onClick={() => addField("experience")} variant="outline" className="w-full border-dashed border-gray-700 text-gray-400 hover:text-white">
                                <Plus size={16} className="mr-2" /> Add Experience
                            </Button>
                        </div>
                    )}

                    {/* Step 4: Skills & Finalize */}
                    {activeStep === 4 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-left-4">
                            <h2 className="text-xl font-semibold">Skills</h2>
                            <Textarea
                                placeholder="List your skills (comma separated), e.g. React, Python, Leadership..."
                                value={resumeData.skills}
                                onChange={(e) => handleInputChange("skills", e.target.value)}
                                className="bg-gray-900 border-gray-700 h-32"
                            />

                            <div className="pt-6 border-t border-gray-800">
                                <Button onClick={handlePrint} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                                    <Download className="mr-2" /> Download PDF
                                </Button>
                                <p className="text-center text-xs text-gray-500 mt-2">
                                    Tip: Use "Save as PDF" in the print dialog.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t border-white/10">
                        <Button
                            variant="secondary"
                            onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                            disabled={activeStep === 1}
                        >
                            Previous
                        </Button>
                        {activeStep < 4 ? (
                            <Button onClick={() => setActiveStep(prev => Math.min(4, prev + 1))}>
                                Next Step
                            </Button>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* RIGHT: LIVE PREVIEW (A4 Paper Style) */}
            <div className="w-full lg:w-1/2 bg-gray-800 p-8 flex justify-center overflow-y-auto h-screen print:w-full print:absolute print:top-0 print:left-0 print:z-50 print:bg-white print:p-0">
                <div id="resume-preview" className="bg-white text-black w-[210mm] min-h-[297mm] p-[20mm]  shadow-2xl print:shadow-none print:w-full">
                    {/* Header */}
                    <div className="text-center border-b-2 border-gray-800 pb-4 mb-4">
                        <h1 className="text-3xl font-bold uppercase tracking-widest">{resumeData.fullName || "YOUR NAME"}</h1>
                        <div className="flex justify-center space-x-4 text-sm mt-2 text-gray-600">
                            {resumeData.email && <span>{resumeData.email}</span>}
                            {resumeData.phone && <span>• {resumeData.phone}</span>}
                        </div>
                    </div>

                    {/* Summary */}
                    {resumeData.summary && (
                        <div className="mb-6">
                            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-sm">Professional Summary</h3>
                            <p className="text-sm leading-relaxed">{resumeData.summary}</p>
                        </div>
                    )}

                    {/* Skills */}
                    {resumeData.skills && (
                        <div className="mb-6">
                            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-sm">Skills</h3>
                            <p className="text-sm leading-relaxed">{resumeData.skills}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {resumeData.experience.length > 0 && resumeData.experience[0].company && (
                        <div className="mb-6">
                            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-sm">Experience</h3>
                            <div className="space-y-4">
                                {resumeData.experience.map((exp, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-baseline">
                                            <span className="font-bold">{exp.role}</span>
                                            <span className="text-sm text-gray-600 italic">{exp.duration}</span>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-700">{exp.company}</div>
                                        <p className="text-sm mt-1 whitespace-pre-wrap">{exp.details}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Education */}
                    {resumeData.education.length > 0 && resumeData.education[0].school && (
                        <div className="mb-6">
                            <h3 className="font-bold border-b border-gray-300 mb-2 uppercase text-sm">Education</h3>
                            <div className="space-y-2">
                                {resumeData.education.map((edu, i) => (
                                    <div key={i} className="flex justify-between items-end">
                                        <div>
                                            <div className="font-bold text-sm">{edu.school}</div>
                                            <div className="text-sm text-gray-700">{edu.degree}</div>
                                        </div>
                                        <div className="text-sm text-gray-600">{edu.year}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>
                {`
          @media print {
            body * {
              visibility: hidden;
            }
            #resume-preview, #resume-preview * {
              visibility: visible;
            }
            #resume-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 20mm;
              background: white;
              color: black;
            }
            .no-print {
              display: none !important;
            }
          }
        `}
            </style>

        </div>
    );
};

export default ResumeBuilder;
