"use client";

import { Brain, Briefcase, LineChart, TrendingDown, TrendingUp } from "lucide-react";
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { format, formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ResponsiveContainer } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { RechartsDevtools } from 'recharts-devtools';

const DashboardView = ({ insights }) => {
    const salaryData = insights.salaryRanges.map((range) => ({
        name: range.role,
        min: range.min / 1000,
        max: range.max / 1000,
        median: range.median / 1000,
    }));

    const getDemandLevelColor = (level) => {
        switch (level) {
            case "high":
                return "text-green-600 font-bold";
            case "medium":
                return "text-yellow-600 font-bold";
            case "low":
                return "text-red-600 font-bold";
            default:
                return "bg-cyan-600 font-bold";
        }
    };

    const getMarketTrendColor = (trend) => {
        switch (trend.toLowerCase()) {
            case "positive":
                return { icon: TrendingUp, color: "text-green-600 font-bold" };
            case "stable":
                return { icon: LineChart, color: "text-yellow-600 font-bold" };
            case "negative":
                return { icon: TrendingDown, color: "text-red-600 font-bold" };
            default:
                return { icon: LineChart, color: "bg-cyan-600 font-bold" };
        }
    };

    const OutLookIcon = getMarketTrendColor(insights.marketOutlook).icon;
    const outLookColor = getMarketTrendColor(insights.marketOutlook).color;


    const lastUpdateDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy");
    const nextUpdateDistance = formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true });

    return (
        <div>
            <div className="space-y-6">
                <Badge variant="outline">Last Updated: {lastUpdateDate}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-emerald-50 font-bold text-lg ">Market Outlook</CardTitle>
                        <OutLookIcon className={`h-4 w-4 ${outLookColor}`} />
                    </CardHeader>
                    <CardContent>
                        <div className={`text-3xl font-bold ${outLookColor}`}>{insights.marketOutlook}</div>
                        <p className="text-sm text-muted-foreground">Next update: {nextUpdateDistance}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-emerald-50 font-bold text-lg">Growth Rate</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-50">{insights.growthRate.toFixed(1)}%</div>
                        <Progress value={insights.growthRate} className="mt-2" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-emerald-50 font-bold text-lg">Market Demand</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
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
                        <CardTitle className="text-emerald-50 font-bold text-lg">Top Skills</CardTitle>
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

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Salary Ranges By Job Roles</CardTitle>
                    <CardDescription>
                        Displaying salary ranges for various job roles in thousands (K).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryData}

                            >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis width="auto" />
                                <Tooltip
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-background border rounded-lg p-2 shadow-md">
                                                    <p className="font-medium">{label}</p>
                                                    {payload.map((item) => (
                                                        <p key={item.name} className="text-sm">{item.name}: {item.value}K</p>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }} />
                                <Bar dataKey="min" fill="#8884d8" activeBar={{ fill: 'pink', stroke: 'blue' }} radius={[10, 10, 0, 0]} name="Min Salary (K)" />
                                <Bar dataKey="median" fill="#ffc658" activeBar={{ fill: 'lightgreen', stroke: 'darkgreen' }} radius={[10, 10, 0, 0]} name="Median Salary (K)" />
                                <Bar dataKey="max" fill="#82ca9d" activeBar={{ fill: 'gold', stroke: 'purple' }} radius={[10, 10, 0, 0]} name="Max Salary (K)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Key Industry Trends</CardTitle>
                        <CardDescription>
                            Stay updated with the latest trends shaping the industry.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       <ul className="space-y-4">
                        {insights.keyTrends.map((trend, index) => (
                            <li key={index} className="flex items-start space-x-3">
                                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2"></div>    
                                <p>{trend}</p>
                            </li>
                        ))}
                       </ul>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recommended Skills</CardTitle>
                        <CardDescription>
                            Stay updated with the latest skills in demand.
                        </CardDescription>
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
        </div>
    );
};
export default DashboardView;