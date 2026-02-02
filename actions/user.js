"use server";
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateAIInsightsForIndustry } from "./dashboard";



export async function updateUser(data) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,

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
                const insights = await generateAIInsightsForIndustry(data.industry);

                industryInsights = await db.industryInsights.create({
                    data: {
                        industry: data.industry,
                        ...insights,
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
                },
            });
            return { updatedUser, industryInsights };

        }, {
            timeout: 20000,
        });
        revalidatePath("/");
         return result.updatedUser;
    } catch (error) {
        console.error("industry Update failed: ", error.message);
        throw new Error("failed to update industry");

    }
}

export async function getUserIndustryInsightsStatus() {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,

        },
    });
    if (!user) throw new Error("User not found");

    try {
        const user = await db.user.findUnique({
            where: {
                clerkUserId: userId,

            },
            select: {
                industry: true,
            },
        });
        return {
            isCompleted: !!user?.industry,
        };

    } catch (error) {
        console.error("Error fetching user industry insights status: ", error);
        throw new Error("Failed to fetch user industry insights status");

    }
}