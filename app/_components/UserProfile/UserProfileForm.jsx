"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Upload, Link, Github, Briefcase, GraduationCap, Award, Code } from "lucide-react";
import { toast } from "sonner";

export default function UserProfileForm({ user, onUpdate }) {
  const [profile, setProfile] = useState({
    resumeUrl: "",
    linkedinUrl: "",
    githubUrl: "",
    portfolioUrl: "",
    workExperience: [],
    education: [],
    certifications: [],
    projects: []
  });
  const [loading, setLoading] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);

  useEffect(() => {
    if (user?.profile) {
      setProfile(user.profile);
      setExtractedSkills(user.profile.extractedSkills || []);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/user-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const data = await response.json();

      if (data.success) {
        setExtractedSkills(data.extractedSkills || []);
        toast.success("Profile updated successfully!");
        onUpdate?.(data.profile);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resume-parser", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const extracted = data.extractedData;
        setProfile(prev => ({
          ...prev,
          workExperience: extracted.experience || [],
          education: extracted.education || [],
          certifications: extracted.certifications || [],
          projects: extracted.projects || []
        }));
        setExtractedSkills(extracted.skills || []);
        toast.success("Resume parsed successfully!");
      } else {
        toast.error("Failed to parse resume");
      }
    } catch (error) {
      console.error("Error parsing resume:", error);
      toast.error("An error occurred while parsing resume");
    }
  };

  const addArrayItem = (field, item) => {
    setProfile(prev => ({
      ...prev,
      [field]: [...prev[field], item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setProfile(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>
            Complete your profile to get personalized recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="resumeUrl">Resume/CV URL</Label>
                    <div className="flex gap-2">
                      <Input
                        id="resumeUrl"
                        type="url"
                        value={profile.resumeUrl}
                        onChange={(e) => setProfile(prev => ({ ...prev, resumeUrl: e.target.value }))}
                        placeholder="https://example.com/resume.pdf"
                      />
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e.target.files[0])}
                        className="hidden"
                        id="resume-upload"
                      />
                      <Button type="button" variant="outline" size="icon" asChild>
                        <label htmlFor="resume-upload">
                          <Upload className="h-4 w-4" />
                        </label>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                    <Input
                      id="linkedinUrl"
                      type="url"
                      value={profile.linkedinUrl}
                      onChange={(e) => setProfile(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub URL</Label>
                    <Input
                      id="githubUrl"
                      type="url"
                      value={profile.githubUrl}
                      onChange={(e) => setProfile(prev => ({ ...prev, githubUrl: e.target.value }))}
                      placeholder="https://github.com/username"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                    <Input
                      id="portfolioUrl"
                      type="url"
                      value={profile.portfolioUrl}
                      onChange={(e) => setProfile(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>

                {extractedSkills.length > 0 && (
                  <div className="space-y-2">
                    <Label>Extracted Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {extractedSkills.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <div className="space-y-4">
                  {profile.workExperience.map((exp, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Job Title</Label>
                            <Input
                              value={exp.title || ""}
                              onChange={(e) => {
                                const newExp = [...profile.workExperience];
                                newExp[index] = { ...newExp[index], title: e.target.value };
                                setProfile(prev => ({ ...prev, workExperience: newExp }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Company</Label>
                            <Input
                              value={exp.company || ""}
                              onChange={(e) => {
                                const newExp = [...profile.workExperience];
                                newExp[index] = { ...newExp[index], company: e.target.value };
                                setProfile(prev => ({ ...prev, workExperience: newExp }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Duration</Label>
                            <Input
                              value={exp.duration || ""}
                              onChange={(e) => {
                                const newExp = [...profile.workExperience];
                                newExp[index] = { ...newExp[index], duration: e.target.value };
                                setProfile(prev => ({ ...prev, workExperience: newExp }));
                              }}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeArrayItem("workExperience", index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                        <div className="mt-4">
                          <Label>Description</Label>
                          <Textarea
                            value={exp.description || ""}
                            onChange={(e) => {
                              const newExp = [...profile.workExperience];
                              newExp[index] = { ...newExp[index], description: e.target.value };
                              setProfile(prev => ({ ...prev, workExperience: newExp }));
                            }}
                            rows={3}
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("workExperience", {})}
                  >
                    Add Experience
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <div className="space-y-4">
                  {profile.education.map((edu, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Degree</Label>
                            <Input
                              value={edu.degree || ""}
                              onChange={(e) => {
                                const newEdu = [...profile.education];
                                newEdu[index] = { ...newEdu[index], degree: e.target.value };
                                setProfile(prev => ({ ...prev, education: newEdu }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Institution</Label>
                            <Input
                              value={edu.institution || ""}
                              onChange={(e) => {
                                const newEdu = [...profile.education];
                                newEdu[index] = { ...newEdu[index], institution: e.target.value };
                                setProfile(prev => ({ ...prev, education: newEdu }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>Year</Label>
                            <Input
                              value={edu.year || ""}
                              onChange={(e) => {
                                const newEdu = [...profile.education];
                                newEdu[index] = { ...newEdu[index], year: e.target.value };
                                setProfile(prev => ({ ...prev, education: newEdu }));
                              }}
                            />
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeArrayItem("education", index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("education", {})}
                  >
                    Add Education
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="space-y-4">
                  {profile.projects.map((project, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label>Project Name</Label>
                            <Input
                              value={project.name || ""}
                              onChange={(e) => {
                                const newProjects = [...profile.projects];
                                newProjects[index] = { ...newProjects[index], name: e.target.value };
                                setProfile(prev => ({ ...prev, projects: newProjects }));
                              }}
                            />
                          </div>
                          <div>
                            <Label>URL</Label>
                            <Input
                              value={project.url || ""}
                              onChange={(e) => {
                                const newProjects = [...profile.projects];
                                newProjects[index] = { ...newProjects[index], url: e.target.value };
                                setProfile(prev => ({ ...prev, projects: newProjects }));
                              }}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea
                              value={project.description || ""}
                              onChange={(e) => {
                                const newProjects = [...profile.projects];
                                newProjects[index] = { ...newProjects[index], description: e.target.value };
                                setProfile(prev => ({ ...prev, projects: newProjects }));
                              }}
                              rows={3}
                            />
                          </div>
                          <div className="md:col-span-2 flex justify-end">
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => removeArrayItem("projects", index)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem("projects", {})}
                  >
                    Add Project
                  </Button>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
