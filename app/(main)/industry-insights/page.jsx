import { industries } from "@/WebData/industries";
import IndustryInsightsForm from "./_components/industry-form";
const IndustryInsights = () => {
  return <main>
    <IndustryInsightsForm industries={industries} />
  </main>;
};
export default IndustryInsights;