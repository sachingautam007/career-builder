
import { getIndustryInsights } from "@/actions/dashboard";
import { getUserIndustryInsightsStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import DashboardView from "./_components/dashboard-view";

const IndustryInsightsPage = async () => {
      const { isCompleted } = await getUserIndustryInsightsStatus();
      const insights = await getIndustryInsights();
      if (!isCompleted) {
        redirect("/industry-insights");
      }
  return (
  <div className="container mx-auto">
    <DashboardView insights={insights} />
  </div>
  );
};
export default IndustryInsightsPage;