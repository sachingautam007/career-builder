import { industries } from "@/WebData/industries";
import IndustryInsightsForm from "./_components/industry-form";
import { getUserIndustryInsightsStatus } from "@/actions/user";
import { redirect } from "next/navigation";
const IndustryInsights = async () => {
  const { isCompleted } = await getUserIndustryInsightsStatus();
  if (isCompleted) {
    redirect("/dashboard");
  }
  return (
    <main>
      <IndustryInsightsForm industries={industries} />
    </main>
  );
};
export default IndustryInsights;