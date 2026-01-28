import { getUserIndustryInsightsStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const IndustryInsightsPage = async () => {
      const { isCompleted } = await getUserIndustryInsightsStatus();
      if (!isCompleted) {
        redirect("/industry-insights");
      }
  return <div></div>;
};
export default IndustryInsightsPage;