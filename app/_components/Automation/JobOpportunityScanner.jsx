"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  ExternalLink,
  Star,
  TrendingUp,
  Building,
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function JobOpportunityScanner() {
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("India");
  const [searchSummary, setSearchSummary] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/job-opportunities", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const scanOpportunities = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/job-opportunities?location=${encodeURIComponent(location)}&limit=20`);
      const data = await response.json();
      
      if (data.success) {
        setOpportunities(data.opportunities);
        setSearchSummary(data.searchSummary);
        toast.success(`Found ${data.opportunities.length} new opportunities!`);
      } else {
        toast.error("Failed to scan for opportunities");
      }
    } catch (error) {
      console.error("Error scanning opportunities:", error);
      toast.error("An error occurred while scanning for opportunities");
    } finally {
      setLoading(false);
    }
  };

  const applyToJob = async (opportunityId) => {
    try {
      const response = await fetch("/api/job-opportunities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          opportunityId,
          applicationStatus: "applied"
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setOpportunities(prev => prev.map(opp => 
          opp.id === opportunityId ? { ...opp, isApplied: true, applicationStatus: "applied" } : opp
        ));
        setApplications(prev => [...prev, data.opportunity]);
        toast.success("Application submitted successfully!");
      } else {
        toast.error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error applying to job:", error);
      toast.error("An error occurred while submitting application");
    }
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getApplicationStatusColor = (status) => {
    const colors = {
      applied: "bg-blue-100 text-blue-800",
      interview: "bg-yellow-100 text-yellow-800",
      rejected: "bg-red-100 text-red-800",
      offer: "bg-green-100 text-green-800",
      not_applied: "bg-gray-100 text-gray-800"
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getJobTypeColor = (type) => {
    const colors = {
      full_time: "bg-blue-100 text-blue-800",
      part_time: "bg-green-100 text-green-800",
      contract: "bg-purple-100 text-purple-800",
      internship: "bg-orange-100 text-orange-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Opportunity Scanner
          </CardTitle>
          <CardDescription>
            Discover and track job opportunities that match your profile
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="scan" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">Scan Opportunities</TabsTrigger>
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            </TabsList>

            <TabsContent value="scan" className="space-y-6">
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., India, Mumbai, Remote"
                  />
                </div>
                <Button onClick={scanOpportunities} disabled={loading}>
                  {loading ? "Scanning..." : "Scan Opportunities"}
                </Button>
              </div>

              {searchSummary && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary mb-2">
                          {searchSummary.totalFound}
                        </div>
                        <p className="text-sm text-muted-foreground">Opportunities Found</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          {searchSummary.averageMatchScore}%
                        </div>
                        <p className="text-sm text-muted-foreground">Avg Match Score</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 mb-2">
                          {searchSummary.topSkills.length}
                        </div>
                        <p className="text-sm text-muted-foreground">Top Skills</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-4">
                      <div className="text-center">
                        <TrendingUp className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                        <div className="text-lg font-semibold">
                          {searchSummary.salaryTrends}
                        </div>
                        <p className="text-sm text-muted-foreground">Salary Trends</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              <div className="space-y-4">
                {opportunities.map((opportunity) => (
                  <Card key={opportunity.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{opportunity.jobTitle}</h3>
                            <Badge className={getMatchScoreColor(opportunity.matchScore)}>
                              {opportunity.matchScore}% match
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                              <Building className="h-4 w-4" />
                              {opportunity.company}
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {opportunity.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              {opportunity.salaryRange}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Badge className={getJobTypeColor(opportunity.jobType)}>
                            {opportunity.jobType.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {opportunity.experienceLevel}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {opportunity.jobDescription}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-2">
                          {opportunity.requiredSkills.slice(0, 5).map((skill, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {opportunity.requiredSkills.length > 5 && (
                            <Badge variant="outline" className="text-xs">
                              +{opportunity.requiredSkills.length - 5} more
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          {opportunity.applicationUrl && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => window.open(opportunity.applicationUrl, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Apply
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={() => applyToJob(opportunity.id)}
                            disabled={opportunity.isApplied}
                          >
                            {opportunity.isApplied ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Applied
                              </>
                            ) : (
                              "Quick Apply"
                            )}
                          </Button>
                        </div>
                      </div>

                      {opportunity.matchReasons && opportunity.matchReasons.length > 0 && (
                        <div className="mt-4 p-3 bg-muted rounded-lg">
                          <h4 className="font-medium text-sm mb-2">Why this matches your profile:</h4>
                          <ul className="text-sm space-y-1">
                            {opportunity.matchReasons.map((reason, index) => (
                              <li key={index} className="flex items-start gap-1">
                                <Star className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="space-y-4">
                {applications.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Applications Yet</h3>
                        <p className="text-muted-foreground">
                          Start scanning for opportunities to see your applications here.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  applications.map((application) => (
                    <Card key={application.id}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="text-lg font-semibold">{application.jobTitle}</h3>
                              <Badge className={getApplicationStatusColor(application.applicationStatus)}>
                                {application.applicationStatus.replace('_', ' ')}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                              <div className="flex items-center gap-1">
                                <Building className="h-4 w-4" />
                                {application.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" />
                                {application.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                Applied {new Date(application.applicationDate).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Badge className={getJobTypeColor(application.jobType)}>
                              {application.jobType.replace('_', ' ')}
                            </Badge>
                            <Badge variant="outline">
                              {application.source}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {application.requiredSkills.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            {application.applicationUrl && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(application.applicationUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Job
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
