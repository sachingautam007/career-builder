"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: {
            ClerkUserId: userId,

        },
    });
    if (!user) throw new Error("User not found");

    try {
        const result = await db.$transaction(async (tx) => {
            let industryInsights = await tx.industryInsights.findUnique({
                where: {
                    industry: data.industry,
                },
            });
            if (!industryInsights) {
                industryInsights = await tx.industryInsights.create({
                    data: {
                        industry: data.industry,
                        salaryRange: [],
                        growthRate: 0,
                        demandLevel: "MEDIUM",
                        topSkills: [],
                        marketOutlook: "Neutral",
                        marketTrends: [],
                        recommendations: [],
                        nextUpdate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //1 week from now

                    },
                });
            }
            const updatedUser = await tx.user.update({
                where: { id: user.id },
                data: {
                    industry: data.industry,
                    experience: data.experience,
                    bio: data.bio,
                    skills: data.skills,
                    industryInsights: {
                        // connect: { id: industryInsights.id },
                    },
                },
            });
            return { updatedUser, industryInsights };

        }, {
            timeout: 8000,
        });

        return result.user;
    } catch (error) {
        console.error("industry Update failed: ", error.message);
        throw new Error("failed to update industry");

    }
}

export async function getUserIndustryInsightsStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: { ClerkUserId: userId,

         },
    });
if (!user) throw new Error("User not found");

try {
    const user = await db.user.findUnique({
        where: { ClerkUserId: userId,

         },
         select : {
            industry: true,
         },
    });
    return {
        isCompleted: !!user?.industry,
    };
    
} catch (error) {
    console.error("Error fetching user industry insights status: ", error.message);
    throw new Error("Failed to fetch user industry insights status");
    
}
}