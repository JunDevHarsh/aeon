import SummaryInfoCard from "../card/Summary";
import ApplicationDetailsContainer from "../container/ApplicationDetails";
import AddOnsContainer from "../container/AddOns";
import DriverDetailsForm from "../form/DriverDetails";
import { InsuranceProvider } from "../context/context";

const InsuranceStepsLayout = ({ currentStep }: { currentStep: number }) => {
  return (
    <InsuranceProvider>
      <div className="mx-auto mt-4 flex items-start justify-between gap-x-4 max-w-5xl w-full">
        {currentStep === 2 && <AddOnsContainer />}
        {currentStep === 3 && <DriverDetailsForm />}
        {currentStep === 4 && <ApplicationDetailsContainer />}
        <SummaryInfoCard />
      </div>
    </InsuranceProvider>
  );
};

export default InsuranceStepsLayout;
