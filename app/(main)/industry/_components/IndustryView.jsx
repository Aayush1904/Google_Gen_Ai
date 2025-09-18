"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BriefcaseIcon,
  LineChart,
  TrendingUp,
  TrendingDown,
  Brain,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const IndustryView = ({ insights }) => {
  // Transform salary data for the chart
 const salaryData = Array.isArray(insights.salaryRanges)
  ? insights.salaryRanges.map((range) => ({
      name: range.role,
      min: range.min / 1000,
      max: range.max / 1000,
      median: range.median / 1000,
    }))
  : [];

  const getDemandLevelColor = (level) => {
    switch (level.toLowerCase()) {
      case "high":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getMarketOutlookInfo = (outlook) => {
    switch (outlook.toLowerCase()) {
      case "positive":
        return { icon: TrendingUp, color: "text-green-500" };
      case "neutral":
        return { icon: LineChart, color: "text-yellow-500" };
      case "negative":
        return { icon: TrendingDown, color: "text-red-500" };
      default:
        return { icon: LineChart, color: "text-gray-500" };
    }
  };

  const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
  const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

  // Format dates using date-fns
 const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

const lastUpdatedDate = isValidDate(insights?.lastUpdated)
  ? format(new Date(insights.lastUpdated), "dd/MM/yyyy")
  : "N/A";

const nextUpdateDistance = isValidDate(insights?.nextUpdate)
  ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
  : "Unknown";

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Badge variant="outline">Last updated: {lastUpdatedDate}</Badge>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            <OutlookIcon className={`h-4 w-4 ${outlookColor}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.marketOutlook}</div>
            <p className="text-xs text-muted-foreground">
              Next update {nextUpdateDistance}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Industry Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate.toFixed(1)}%
            </div>
            <Progress value={insights.growthRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            <BriefcaseIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{insights.demandLevel}</div>
            <div
              className={`h-2 w-full rounded-full mt-2 ${getDemandLevelColor(
                insights.demandLevel
              )}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Skills</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {insights.topSkills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Salary Ranges by Role</CardTitle>
          <CardDescription>
            Displaying minimum, median, and maximum salaries (in thousands)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-2 shadow-md">
                          <p className="font-medium">{label}</p>
                          {payload.map((item) => (
                            <p key={item.name} className="text-sm">
                              {item.name}: ${item.value}K
                            </p>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" />
                <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" />
                <Bar dataKey="max" fill="#475569" name="Max Salary (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Industry Trends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Key Industry Trends</CardTitle>
            <CardDescription>
              Current trends shaping the industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {insights.keyTrends.map((trend, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span>{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recommended Skills</CardTitle>
            <CardDescription>Skills to consider developing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex items-center justify-center">
        <h2 className="text-4xl">Resume tailored recommandations</h2>
        
      </div>
      <div className="flex items-center justify-center">
          <p>Upload your resume (PDF or DOCX) and get AI-powered insights on your current skills, recommended skills to learn next, and their market demand. Stay ahead in your career with personalized learning suggestions! 🚀</p>
        </div>
      <div className="flex items-center justify-center">
        <Link href = "https://siddharthkumbharkar-resume-recommend-app-0bblcr.streamlit.app/" passHref legacyBehavior>
          <Button as="a" target="_blank" rel="noopener noreferrer">Upload</Button> 
        </Link>
      </div>
    </div>
  );
};

export default IndustryView;



// "use client";

// import React from "react";
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
// import { BriefcaseIcon, LineChart, TrendingUp, TrendingDown, Brain } from "lucide-react";
// import { format, formatDistanceToNow } from "date-fns";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";

// const IndustryView = ({ insights }) => {
//   const salaryData = Array.isArray(insights?.salaryRanges)
//     ? insights.salaryRanges.map((range) => ({
//         name: range.role,
//         min: range.min / 1000,
//         max: range.max / 1000,
//         median: range.median / 1000,
//       }))
//     : [];

//   const getDemandLevelColor = (level) => {
//     switch (level.toLowerCase()) {
//       case "high":
//         return "bg-green-500";
//       case "medium":
//         return "bg-yellow-500";
//       case "low":
//         return "bg-red-500";
//       default:
//         return "bg-gray-500";
//     }
//   };

//   const getMarketOutlookInfo = (outlook) => {
//     switch (outlook.toLowerCase()) {
//       case "positive":
//         return { icon: TrendingUp, color: "text-green-500" };
//       case "neutral":
//         return { icon: LineChart, color: "text-yellow-500" };
//       case "negative":
//         return { icon: TrendingDown, color: "text-red-500" };
//       default:
//         return { icon: LineChart, color: "text-gray-500" };
//     }
//   };

//   const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon;
//   const outlookColor = getMarketOutlookInfo(insights.marketOutlook).color;

//   const isValidDate = (date) => date && !isNaN(new Date(date).getTime());

//   const lastUpdatedDate = isValidDate(insights?.lastUpdated)
//     ? format(new Date(insights.lastUpdated), "dd/MM/yyyy")
//     : "N/A";

//   const nextUpdateDistance = isValidDate(insights?.nextUpdate)
//     ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true })
//     : "Unknown";

//   return (
//     <div className="space-y-8 px-6 py-4">
//       {/* Header Section */}
//       <div className="flex justify-between items-center">
//         <Badge variant="outline" className="px-3 py-1 text-sm">Last updated: {lastUpdatedDate}</Badge>
//       </div>

//       {/* Market Overview Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         {[
//           { title: "Market Outlook", value: insights.marketOutlook, icon: OutlookIcon, color: outlookColor },
//           { title: "Industry Growth", value: `${insights.growthRate.toFixed(1)}%`, icon: TrendingUp, color: "text-blue-500" },
//           { title: "Demand Level", value: insights.demandLevel, icon: BriefcaseIcon, color: "text-indigo-500" },
//           { title: "Top Skills", value: insights.topSkills.join(", "), icon: Brain, color: "text-purple-500" },
//         ].map(({ title, value, icon: Icon, color }, index) => (
//           <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300">
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">{title}</CardTitle>
//               <Icon className={`h-6 w-6 ${color}`} />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{value}</div>
//               {title === "Industry Growth" && <Progress value={insights.growthRate} className="mt-2" />}
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Salary Ranges Chart */}
//       <Card className="col-span-4 shadow-md hover:shadow-lg transition-all duration-300">
//         <CardHeader>
//           <CardTitle>Salary Ranges by Role</CardTitle>
//           <CardDescription className="text-sm">Displaying minimum, median, and maximum salaries (in thousands)</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="h-[400px]">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={salaryData} barCategoryGap="25%">
//                 <CartesianGrid strokeDasharray="3 3" className="text-muted-foreground" />
//                 <XAxis dataKey="name" tickLine={false} tickMargin={10} axisLine={false} />
//                 <YAxis />
//                 <Tooltip
//                   cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
//                   content={({ active, payload, label }) => {
//                     if (active && payload && payload.length) {
//                       return (
//                         <div className="bg-white border rounded-lg p-3 shadow-md">
//                           <p className="font-medium text-black">{label}</p>
//                           {payload.map((item) => (
//                             <p key={item.name} className="text-sm text-gray-700">
//                               {item.name}: ${item.value}K
//                             </p>
//                           ))}
//                         </div>
//                       );
//                     }
//                     return null;
//                   }}
//                 />
//                 <Bar dataKey="min" fill="#94a3b8" name="Min Salary (K)" radius={[6, 6, 0, 0]} />
//                 <Bar dataKey="median" fill="#64748b" name="Median Salary (K)" radius={[6, 6, 0, 0]} />
//                 <Bar dataKey="max" fill="#475569" name="Max Salary (K)" radius={[6, 6, 0, 0]} />
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Industry Trends & Recommended Skills */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         {[
//           { title: "Key Industry Trends", data: insights.keyTrends },
//           { title: "Recommended Skills", data: insights.recommendedSkills },
//         ].map(({ title, data }, index) => (
//           <Card key={index} className="shadow-md hover:shadow-lg transition-all duration-300">
//             <CardHeader>
//               <CardTitle>{title}</CardTitle>
//               <CardDescription className="text-sm">Current trends shaping the industry</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 {data.map((item, idx) => (
//                   <li key={idx} className="flex items-center space-x-2">
//                     <div className="h-2 w-2 mt-1 rounded-full bg-primary"></div>
//                     <span className="text-sm">{item}</span>
//                   </li>
//                 ))}
//               </ul>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default IndustryView;
