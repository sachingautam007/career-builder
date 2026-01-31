"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { IndustryInsightsSchema } from "@/lib2/schema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import  useFetch  from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";

const IndustryInsightsform = ({ industries }) => {
  const router = useRouter();
  const [selectedIndustry, setSelectedIndustry] = useState(null);

  const {
    loading : updateLoading,
    fn: updateUserFn,
    data: updateResult,
  } = useFetch(updateUser);

  const { register,
          handleSubmit, 
          formState: { errors }, 
          setValue, 
          watch, 
        } = useForm({
       resolver: zodResolver(IndustryInsightsSchema),
  });

  const onSubmit = async (values) => {
    try{
      const formattedIndustry = `${values.industry} - ${values.subIndustry.toLowerCase().replace(/\s+/g, "-")}`;
      await updateUserFn({
        ...values,
        industry: formattedIndustry,
      });
    } catch(error) {
      console.error("Error updating profile:", error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
      toast.success("Profile updated successfully");
      router.push("/dashboard");
      router.refresh();
    }
  }, [updateResult, updateLoading]);

  const watchedIndustry = watch("industry");

  return (
  <div className="flex items-center justify-center bg-background">
    <Card className="w-full max-w-lg mt-10 mx-20 p-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-3xl font-bold gradient-title">Complete Your Profile</CardTitle>
        <CardDescription>Please Register to get personalized industry insights</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6 mb-8" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select
              onValueChange={(value) => {
                setValue("industry", value);
                setSelectedIndustry(industries.find((industry) => industry.id === value));
                setValue("subIndustry", "");
              }}
            >
              <SelectTrigger id="industry" className="w-full">
                <SelectValue placeholder="Select Your Industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => {
                  return <SelectItem key={industry.id} value={industry.id}>
                    {industry.name}
                  </SelectItem>;
                })}
              </SelectContent>
            </Select>
            {errors.industry && <p className="text-red-500 text-sm">{errors.industry.message}</p>}
          </div>


          {watchedIndustry && (
          <div className="space-y-2">
            <Label htmlFor="subIndustry">Sub Industry</Label>
            <Select
              onValueChange={(value) => {
                setValue("subIndustry", value);
              }}
            >
              <SelectTrigger id="subIndustry" className="w-full">
                <SelectValue placeholder="Select Sub-Industry" />
              </SelectTrigger>
              <SelectContent>
                {selectedIndustry?.subIndustries.map((industry) => {
                  return <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>;
                })}
              </SelectContent>
            </Select>
            {errors.subIndustry && <p className="text-red-500 text-sm">{errors.subIndustry.message}</p>}
          </div>
          )}


            <div className="space-y-2">
            <Label htmlFor="experience">Total Experience</Label>
            <Input 
            id="experience"
            type="number"
            min="0"
            max="50"
            placeholder="Enter your total experience"
            {...register("experience")}/>

            {errors.experience && (
             <p className="text-red-500 text-sm">{errors.experience.message}</p>
            )}
          </div>


           <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <Input 
            id="skills"
            type="text"
            placeholder="Enter your skills like Java,Python,React"
            {...register("skills")}/>

            {errors.skills && (
              <p className="text-red-500 text-sm">{errors.skills.message}</p>
            )}
          </div>
           


           <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
            id="bio"
            placeholder="Enter your bio like I am a software developer" className="h-32"
            {...register("bio")}/>

            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>
                
              
           <Button type="submit" className="w-full" disabled={updateLoading}>
            {updateLoading ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                Updating...
              </>
            ) : (
              "Complete Registration"
            )}
           </Button>
           
        </form>
      </CardContent>
    </Card>
  </div>
  );
};

export default IndustryInsightsform;