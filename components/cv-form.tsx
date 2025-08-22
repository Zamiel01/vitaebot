"use client";
// Inside your CVForm component

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2 } from "lucide-react";
import type {
  CVData,
  Experience,
  Education,
  Skill,
  Language,
  Certification,
  Project,
  Publication,
  Volunteering,
  Award,
  Interest,
} from "@/types/cv";

import { useState, useEffect } from "react";



interface CVFormProps {
  cvData: CVData;
  setCVData: (data: CVData) => void;
  formWidth: number;
}

interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  compareDate?: string;
  isEndDate?: boolean;
  disabled?: boolean;
}

export function CVForm({ cvData, setCVData, formWidth }: CVFormProps) {
  const [jobRole, setJobRole] = useState<string>("");
  const [isFormEnabled, setIsFormEnabled] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showAISuggestions, setShowAISuggestions] = useState({
  "professional summary": "",
  "experience position": "",
  "experience description": "",
  "skill": "",
  "project description": "",
  "volunteering description": "",
});

  useEffect(() => {
    setIsFormEnabled(!!jobRole.trim());
  }, [jobRole]);

  const handleAISuggestion = async (fieldType: string, id?: string) => {
    if (!jobRole.trim()) return;
    setIsLoading(true);
    try {
      let prompt = "";
      if (fieldType.includes("description")) {
        prompt = `Suggest 2-3 bullet points (each under 80 characters) for a ${jobRole} role's ${fieldType}.`;
      } else if (fieldType === "skill") {
        prompt = `Suggest 1-2 relevant ${fieldType}s for a ${jobRole} role.`;
      } else if (fieldType === "professional summary") {
        prompt = `Suggest a 2-sentence professional summary for a ${jobRole} role.`;
      } else {
        prompt = `Suggest a concise ${fieldType} for a ${jobRole} role. Keep it under 100 characters.`;
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyAlQB1S7nNgDlQx39V3MBahObgeI_qSuxs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        }
      );
      const data = await response.json();
      let suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      if (fieldType.includes("description")) {
        suggestion = suggestion
          .split("\n")
          .filter((line: string) => line.trim().length > 0)
          .map((line: string) => line.trim())
          .join("\n");
      }

      // Directly populate the relevant field
      if (id && fieldType.includes("description")) {
        if (fieldType === "experience description") {
          updateExperience(id, "description", suggestion.split("\n"));
        } else if (fieldType === "project description") {
          updateProject(id, "description", suggestion);
        } else if (fieldType === "volunteering description") {
          updateVolunteering(id, "description", suggestion.split("\n"));
        }
      } else if (fieldType === "professional summary") {
        setCVData({ ...cvData, summary: suggestion });
      } else if (fieldType === "skill" && id) {
        updateSkill(id, "name", suggestion);
      }
    } catch (error) {
      console.error("Error fetching AI suggestion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateDates = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate || endDate === "Present") return true;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return start <= end;
  };

  const DateInput = ({ value, onChange, placeholder, error, compareDate, isEndDate, disabled }: DateInputProps) => {
    const handleDateChange = (newValue: string) => {
      if (!isEndDate || !compareDate || validateDates(compareDate, newValue)) {
        onChange(newValue);
      }
    };
    return (
      <div className="relative">
        <Input
          type="month"
          value={value}
          onChange={(e) => handleDateChange(e.target.value)}
          placeholder={placeholder}
          className={`h-10 px-3 ${error ? "border-red-500" : ""}`}
          disabled={disabled}
        />
      </div>
    );
  };

  const updatePersonalInfo = (field: string, value: string) => {
    setCVData({ ...cvData, personalInfo: { ...cvData.personalInfo, [field]: value } });
  };

  // Experience
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      position: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: [""],
    };
    setCVData({ ...cvData, experience: [...cvData.experience, newExp] });
  };

  const updateExperience = (id: string, field: string, value: any) => {
    setCVData({
      ...cvData,
      experience: cvData.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    });
  };

  const removeExperience = (id: string) => {
    setCVData({
      ...cvData,
      experience: cvData.experience.filter((exp) => exp.id !== id),
    });
  };

  // Education
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      graduationYear: "",
    };
    setCVData({ ...cvData, education: [...cvData.education, newEdu] });
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      education: cvData.education.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
    });
  };

  const removeEducation = (id: string) => {
    setCVData({
      ...cvData,
      education: cvData.education.filter((edu) => edu.id !== id),
    });
  };

  // Skills
  const addSkill = () => {
    const newSkill: Skill = {
      id: Date.now().toString(),
      name: "",
      level: 3,
    };
    setCVData({ ...cvData, skills: [...cvData.skills, newSkill] });
  };

  const updateSkill = (id: string, field: string, value: any) => {
    setCVData({
      ...cvData,
      skills: cvData.skills.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)),
    });
  };

  const removeSkill = (id: string) => {
    setCVData({
      ...cvData,
      skills: cvData.skills.filter((skill) => skill.id !== id),
    });
  };

  // Languages
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      name: "",
      level: "Intermediate",
    };
    setCVData({ ...cvData, languages: [...cvData.languages, newLanguage] });
  };

  const updateLanguage = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      languages: cvData.languages.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)),
    });
  };

  const removeLanguage = (id: string) => {
    setCVData({
      ...cvData,
      languages: cvData.languages.filter((lang) => lang.id !== id),
    });
  };

  // Certifications
  const addCertification = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      name: "",
      issuer: "",
      date: "",
    };
    setCVData({ ...cvData, certifications: [...cvData.certifications, newCert] });
  };

  const updateCertification = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      certifications: cvData.certifications.map((cert) => (cert.id === id ? { ...cert, [field]: value } : cert)),
    });
  };

  const removeCertification = (id: string) => {
    setCVData({
      ...cvData,
      certifications: cvData.certifications.filter((cert) => cert.id !== id),
    });
  };

  // Projects
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: [],
      startDate: "",
      endDate: "",
    };
    setCVData({ ...cvData, projects: [...cvData.projects, newProject] });
  };

  const updateProject = (id: string, field: string, value: any) => {
    setCVData({
      ...cvData,
      projects: cvData.projects.map((project) => (project.id === id ? { ...project, [field]: value } : project)),
    });
  };

  const removeProject = (id: string) => {
    setCVData({
      ...cvData,
      projects: cvData.projects.filter((project) => project.id !== id),
    });
  };

  // Publications
  const addPublication = () => {
    const newPub: Publication = {
      id: Date.now().toString(),
      title: "",
      publisher: "",
      date: "",
    };
    setCVData({ ...cvData, publications: [...cvData.publications, newPub] });
  };

  const updatePublication = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      publications: cvData.publications.map((pub) => (pub.id === id ? { ...pub, [field]: value } : pub)),
    });
  };

  const removePublication = (id: string) => {
    setCVData({
      ...cvData,
      publications: cvData.publications.filter((pub) => pub.id !== id),
    });
  };

  // Volunteering
  const addVolunteering = () => {
    const newVol: Volunteering = {
      id: Date.now().toString(),
      organization: "",
      role: "",
      startDate: "",
      endDate: "",
      description: [""],
    };
    setCVData({ ...cvData, volunteering: [...cvData.volunteering, newVol] });
  };

  const updateVolunteering = (id: string, field: string, value: any) => {
    setCVData({
      ...cvData,
      volunteering: cvData.volunteering.map((vol) => (vol.id === id ? { ...vol, [field]: value } : vol)),
    });
  };

  const removeVolunteering = (id: string) => {
    setCVData({
      ...cvData,
      volunteering: cvData.volunteering.filter((vol) => vol.id !== id),
    });
  };

  // Awards
  const addAward = () => {
    const newAward: Award = {
      id: Date.now().toString(),
      title: "",
      issuer: "",
      date: "",
    };
    setCVData({ ...cvData, awards: [...cvData.awards, newAward] });
  };

  const updateAward = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      awards: cvData.awards.map((award) => (award.id === id ? { ...award, [field]: value } : award)),
    });
  };

  const removeAward = (id: string) => {
    setCVData({
      ...cvData,
      awards: cvData.awards.filter((award) => award.id !== id),
    });
  };

  // Interests
  const addInterest = () => {
    const newInterest: Interest = {
      id: Date.now().toString(),
      name: "",
    };
    setCVData({ ...cvData, interests: [...cvData.interests, newInterest] });
  };

  const updateInterest = (id: string, field: string, value: string) => {
    setCVData({
      ...cvData,
      interests: cvData.interests.map((interest) => (interest.id === id ? { ...interest, [field]: value } : interest)),
    });
  };

  const removeInterest = (id: string) => {
    setCVData({
      ...cvData,
      interests: cvData.interests.filter((interest) => interest.id !== id),
    });
  };

  return (
    <div className="p-6 space-y-6" style={{ width: "100%" }}>
      {/* Job Role Field (Top of the Form) */}
      <div className="space-y-2">
        <Label htmlFor="jobRole">Job Role (Required)</Label>
        <Input
          id="jobRole"
          value={jobRole}
          onChange={(e) => setJobRole(e.target.value)}
          placeholder="e.g., Senior Software Engineer"
          className="h-10 px-3 w-full"
        />
      </div>

      <Accordion type="multiple" defaultValue={["personal", "summary"]} className="w-full">
        {/* Personal Information */}
        <AccordionItem value="personal">
          <AccordionTrigger className="text-pink-700 font-semibold">Personal Information</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
                  placeholder="John Doe"
                  className="h-10 px-3 w-full"
                  style={{ minWidth: "200px" }}
                  disabled={!isFormEnabled}
                />
              </div>
              <div>
                <Label htmlFor="headline">Professional Headline</Label>
                <Input
                  id="headline"
                  value={cvData.personalInfo.headline}
                  onChange={(e) => updatePersonalInfo("headline", e.target.value)}
                  placeholder="Senior Software Engineer"
                  className="h-10 px-3 w-full"
                  style={{ minWidth: "200px" }}
                  disabled={!isFormEnabled}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo("email", e.target.value)}
                  placeholder="john@example.com"
                  className="h-10 px-3 w-full"
                  style={{ minWidth: "200px" }}
                  disabled={!isFormEnabled}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={cvData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                  className="h-10 px-3 w-full"
                  style={{ minWidth: "200px" }}
                  disabled={!isFormEnabled}
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={cvData.personalInfo.location}
                  onChange={(e) => updatePersonalInfo("location", e.target.value)}
                  placeholder="New York, NY"
                  className="h-10 px-3 w-full"
                  style={{ minWidth: "200px" }}
                  disabled={!isFormEnabled}
                />
              </div>
              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={cvData.personalInfo.website}
                  onChange={(e) => updatePersonalInfo("website", e.target.value)}
                  placeholder="https://johndoe.com"
                  className="h-10 px-3 w-full"
                  style={{ minWidth: "200px" }}
                  disabled={!isFormEnabled}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Professional Summary */}
        <AccordionItem value="summary">
          <AccordionTrigger className="text-pink-700 font-semibold">Professional Summary</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Professional Summary</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAISuggestion("professional summary")}
                  disabled={!isFormEnabled || isLoading}
                  className="p-1 h-6 w-auto text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                >
                  {isLoading ? "Loading..." : "Get AI Suggestion"}
                </Button>
              </div>
              {showAISuggestions["professional summary"] && (
                <div className="p-2 bg-gray-50 rounded-md text-sm">
                  {showAISuggestions["professional summary"]}
                </div>
              )}
              <Textarea
                value={cvData.summary}
                onChange={(e) => setCVData({ ...cvData, summary: e.target.value })}
                placeholder="Write a brief summary..."
                rows={4}
                className="w-full"
                style={{ minWidth: "200px" }}
                disabled={!isFormEnabled}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Experience */}
        <AccordionItem value="experience">
          <AccordionTrigger className="text-pink-700 font-semibold">Work Experience</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.experience.map((exp) => (
                <Card key={exp.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Experience Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className={`grid gap-3 ${formWidth > 400 ? "grid-cols-2" : "grid-cols-1"}`}>
                      <div>
                        <div className="flex items-center justify-between">
                          <Label>Position</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleAISuggestion("experience position")}
                            disabled={!isFormEnabled || isLoading}
                            className="p-1 h-6 w-auto text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                          >
                            {isLoading ? "Loading..." : "Get AI Suggestion"}
                          </Button>
                        </div>
                        {showAISuggestions["experience position"] && (
                          <div className="p-2 bg-gray-50 rounded-md text-sm">
                            {showAISuggestions["experience position"]}
                          </div>
                        )}
                        <Input
                          value={exp.position}
                          onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                          placeholder="Software Engineer"
                          className="h-10 px-3 w-full"
                          style={{ minWidth: "150px" }}
                          disabled={!isFormEnabled}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                          placeholder="Tech Corp"
                          className="h-10 px-3 w-full"
                          style={{ minWidth: "150px" }}
                          disabled={!isFormEnabled}
                        />
                      </div>
                    </div>
                    <div className={`grid gap-3 ${formWidth > 400 ? "grid-cols-2" : "grid-cols-1"}`}>
                      <div>
                        <Label>Start Date</Label>
                        <DateInput
                          value={exp.startDate}
                          onChange={(value) => updateExperience(exp.id, "startDate", value)}
                          placeholder="2020-01"
                          compareDate={exp.endDate}
                          disabled={!isFormEnabled}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <DateInput
                          value={exp.endDate}
                          onChange={(value) => updateExperience(exp.id, "endDate", value)}
                          placeholder="Present or 2023-12"
                          compareDate={exp.startDate}
                          isEndDate={true}
                          disabled={!isFormEnabled}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAISuggestion("experience description")}
                          disabled={!isFormEnabled || isLoading}
                          className="p-1 h-6 w-auto text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                        >
                          {isLoading ? "Loading..." : "Get AI Suggestion"}
                        </Button>
                      </div>
                      {showAISuggestions["experience description"] && (
                        <div className="p-2 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                          {showAISuggestions["experience description"]}
                        </div>
                      )}
                      <Textarea
                        value={exp.description.join("\n")}
                        onChange={(e) => updateExperience(exp.id, "description", e.target.value.split("\n"))}
                        placeholder="• Developed web applications using React and Node.js&#10;• Led a team of 5 developers&#10;• Improved system performance by 40%"
                        rows={3}
                        className="w-full"
                        style={{ minWidth: "200px" }}
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addExperience}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Experience
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Skills */}
        <AccordionItem value="skills">
          <AccordionTrigger className="text-pink-700 font-semibold">Skills</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.skills.map((skill) => (
                <Card key={skill.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Skill Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeSkill(skill.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <Label>Skill Name</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAISuggestion("skill")}
                          disabled={!isFormEnabled || isLoading}
                          className="p-1 h-6 w-auto text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                        >
                          {isLoading ? "Loading..." : "Get AI Suggestion"}
                        </Button>
                      </div>
                      {showAISuggestions["skill"] && (
                        <div className="p-2 bg-gray-50 rounded-md text-sm">
                          {showAISuggestions["skill"]}
                        </div>
                      )}
                      <Input
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                        placeholder="JavaScript"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Proficiency Level</Label>
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, "level", Number.parseInt(e.target.value))}
                        className="px-3 py-2 border border-gray-300 rounded-md h-10 w-full"
                        disabled={!isFormEnabled}
                      >
                        <option value={1}>Beginner</option>
                        <option value={2}>Intermediate</option>
                        <option value={3}>Advanced</option>
                        <option value={4}>Expert</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addSkill}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Education */}
        <AccordionItem value="education">
          <AccordionTrigger className="text-pink-700 font-semibold">Education</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.education.map((edu) => (
                <Card key={edu.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Education Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Degree</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                        placeholder="Bachelor's in Computer Science"
                        className="h-10 px-3 w-full"
                        style={{ minWidth: "200px" }}
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input
                        value={edu.institution}
                        onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                        placeholder="University of Technology"
                        className="h-10 px-3 w-full"
                        style={{ minWidth: "200px" }}
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div className={`grid gap-3 ${formWidth > 400 ? "grid-cols-2" : "grid-cols-1"}`}>
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={edu.location}
                          onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                          placeholder="Boston, MA"
                          className="h-10 px-3 w-full"
                          style={{ minWidth: "150px" }}
                          disabled={!isFormEnabled}
                        />
                      </div>
                      <div>
                        <Label>Graduation Year</Label>
                        <Input
                          value={edu.graduationYear}
                          onChange={(e) => updateEducation(edu.id, "graduationYear", e.target.value)}
                          placeholder="2020"
                          className="h-10 px-3 w-full"
                          style={{ minWidth: "150px" }}
                          disabled={!isFormEnabled}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addEducation}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Education
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Languages */}
        <AccordionItem value="languages">
          <AccordionTrigger className="text-pink-700 font-semibold">Languages</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.languages.map((lang) => (
                <Card key={lang.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Language Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeLanguage(lang.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Language Name</Label>
                      <Input
                        value={lang.name}
                        onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                        placeholder="English"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Proficiency Level</Label>
                      <select
                        value={lang.level}
                        onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md h-10 w-full"
                        disabled={!isFormEnabled}
                      >
                        <option value="Native">Native</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Basic">Basic</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addLanguage}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Language
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Certifications */}
        <AccordionItem value="certifications">
          <AccordionTrigger className="text-pink-700 font-semibold">Certifications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.certifications.map((cert) => (
                <Card key={cert.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Certification Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCertification(cert.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Certification Name</Label>
                      <Input
                        value={cert.name}
                        onChange={(e) => updateCertification(cert.id, "name", e.target.value)}
                        placeholder="AWS Certified Solutions Architect"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Issuing Organization</Label>
                      <Input
                        value={cert.issuer}
                        onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                        placeholder="Amazon Web Services"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Date Obtained</Label>
                      <Input
                        type="month"
                        value={cert.date}
                        onChange={(e) => updateCertification(cert.id, "date", e.target.value)}
                        placeholder="2023-06"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addCertification}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Certification
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Projects */}
        <AccordionItem value="projects">
          <AccordionTrigger className="text-pink-700 font-semibold">Projects</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.projects.map((project) => (
                <Card key={project.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Project Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Project Name</Label>
                      <Input
                        value={project.name}
                        onChange={(e) => updateProject(project.id, "name", e.target.value)}
                        placeholder="E-commerce Platform"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <DateInput
                        value={project.startDate}
                        onChange={(value) => updateProject(project.id, "startDate", value)}
                        placeholder="2023-01"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <DateInput
                        value={project.endDate}
                        onChange={(value) => updateProject(project.id, "endDate", value)}
                        placeholder="2023-06"
                        compareDate={project.startDate}
                        isEndDate={true}
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Technologies</Label>
                      <Input
                        value={project.technologies.join(", ")}
                        onChange={(e) =>
                          updateProject(
                            project.id,
                            "technologies",
                            e.target.value.split(", ").filter((t) => t.trim()),
                          )
                        }
                        placeholder="React, Node.js, MongoDB"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAISuggestion("project description")}
                          disabled={!isFormEnabled || isLoading}
                          className="p-1 h-6 w-auto text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                        >
                          {isLoading ? "Loading..." : "Get AI Suggestion"}
                        </Button>
                      </div>
                      {showAISuggestions["project description"] && (
                        <div className="p-2 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                          {showAISuggestions["project description"]}
                        </div>
                      )}
                      <Textarea
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        placeholder="Built a full-stack e-commerce platform..."
                        rows={3}
                        className="w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Project URL (Optional)</Label>
                      <Input
                        value={project.url || ""}
                        onChange={(e) => updateProject(project.id, "url", e.target.value)}
                        placeholder="https://github.com/username/project"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addProject}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Project
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Publications */}
        <AccordionItem value="publications">
          <AccordionTrigger className="text-pink-700 font-semibold">Publications</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.publications.map((pub) => (
                <Card key={pub.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Publication Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePublication(pub.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={pub.title}
                        onChange={(e) => updatePublication(pub.id, "title", e.target.value)}
                        placeholder="Machine Learning in Web Development"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Publisher</Label>
                      <Input
                        value={pub.publisher}
                        onChange={(e) => updatePublication(pub.id, "publisher", e.target.value)}
                        placeholder="IEEE Computer Society"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Publication Date</Label>
                      <Input
                        type="month"
                        value={pub.date}
                        onChange={(e) => updatePublication(pub.id, "date", e.target.value)}
                        placeholder="2023-03"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>URL (Optional)</Label>
                      <Input
                        value={pub.url || ""}
                        onChange={(e) => updatePublication(pub.id, "url", e.target.value)}
                        placeholder="https://doi.org/10.1109/example"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addPublication}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Publication
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Volunteering */}
        <AccordionItem value="volunteering">
          <AccordionTrigger className="text-pink-700 font-semibold">Volunteering</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.volunteering.map((vol) => (
                <Card key={vol.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Volunteering Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVolunteering(vol.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Organization</Label>
                      <Input
                        value={vol.organization}
                        onChange={(e) => updateVolunteering(vol.id, "organization", e.target.value)}
                        placeholder="Local Food Bank"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Role</Label>
                      <Input
                        value={vol.role}
                        onChange={(e) => updateVolunteering(vol.id, "role", e.target.value)}
                        placeholder="Volunteer Coordinator"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Start Date</Label>
                      <DateInput
                        value={vol.startDate}
                        onChange={(value) => updateVolunteering(vol.id, "startDate", value)}
                        placeholder="2022-01"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <DateInput
                        value={vol.endDate}
                        onChange={(value) => updateVolunteering(vol.id, "endDate", value)}
                        placeholder="Present or 2023-12"
                        compareDate={vol.startDate}
                        isEndDate={true}
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <Label>Description</Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAISuggestion("volunteering description")}
                          disabled={!isFormEnabled || isLoading}
                          className="p-1 h-6 w-auto text-pink-500 hover:text-pink-700 hover:bg-pink-50"
                        >
                          {isLoading ? "Loading..." : "Get AI Suggestion"}
                        </Button>
                      </div>
                      {showAISuggestions["volunteering description"] && (
                        <div className="p-2 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                          {showAISuggestions["volunteering description"]}
                        </div>
                      )}
                      <Textarea
                        value={vol.description.join("\n")}
                        onChange={(e) => updateVolunteering(vol.id, "description", e.target.value.split("\n"))}
                        placeholder="• Coordinated weekly food distribution events..."
                        rows={3}
                        className="w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addVolunteering}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Volunteering
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Awards */}
        <AccordionItem value="awards">
          <AccordionTrigger className="text-pink-700 font-semibold">Awards</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.awards.map((award) => (
                <Card key={award.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Award Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAward(award.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Award Title</Label>
                      <Input
                        value={award.title}
                        onChange={(e) => updateAward(award.id, "title", e.target.value)}
                        placeholder="Employee of the Year"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Issuing Organization</Label>
                      <Input
                        value={award.issuer}
                        onChange={(e) => updateAward(award.id, "issuer", e.target.value)}
                        placeholder="Tech Corp"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Date Received</Label>
                      <Input
                        type="month"
                        value={award.date}
                        onChange={(e) => updateAward(award.id, "date", e.target.value)}
                        placeholder="2023-12"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={award.description || ""}
                        onChange={(e) => updateAward(award.id, "description", e.target.value)}
                        placeholder="Recognized for outstanding performance..."
                        rows={2}
                        className="w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addAward}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Award
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Interests */}
        <AccordionItem value="interests">
          <AccordionTrigger className="text-pink-700 font-semibold">Interests</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              {cvData.interests.map((interest) => (
                <Card key={interest.id} className="border-pink-200">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-sm">Interest Entry</CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInterest(interest.id)}
                        className="text-red-500 hover:text-red-700"
                        disabled={!isFormEnabled}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label>Interest Name</Label>
                      <Input
                        value={interest.name}
                        onChange={(e) => updateInterest(interest.id, "name", e.target.value)}
                        placeholder="Photography"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                    <div>
                      <Label>Category (Optional)</Label>
                      <Input
                        value={interest.category || ""}
                        onChange={(e) => updateInterest(interest.id, "category", e.target.value)}
                        placeholder="Creative"
                        className="h-10 px-3 w-full"
                        disabled={!isFormEnabled}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button
                onClick={addInterest}
                variant="outline"
                className="w-full border-pink-300 text-pink-700 hover:bg-pink-50 bg-transparent"
                disabled={!isFormEnabled}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Interest
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
