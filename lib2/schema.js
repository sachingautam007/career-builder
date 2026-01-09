import { z } from "zod";
export const IndustryInsightsSchema = z.object({
    industry: z.string({
        required_error: "Industry is required", 
    }),
     subIndustry: z.string({
        required_error: "Industry is required", 
    }),
    bio: z.string().max(500, "This is an optional field").optional(),

    experience: z.string()
    .transform((value) => parseInt(value, 10))
    .pipe(z.number().min(0, "Experience cannot be negative"))
    .pipe(z.number().max(50, "Experience seems too high")),

    skills: z.string().transform((value) => value
     ? value.split(",")
     .map((skill) => skill.trim())
     .filter(Boolean)
     : undefined),   
});