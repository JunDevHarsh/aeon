// import { useContext } from "react";
import AddOnsContainer from "../container/AddOns";
import DriverDetailsForm from "../form/DriverDetails";
import ApplicationDetailsContainer from "../container/ApplicationDetails";
import SummaryInfoCard from "../card/Summary";

const InsuranceContainerLayout = ({ currentStep }: { currentStep: number }) => {
  return (
    <>
      <div className="mx-auto mt-4 flex items-start justify-between gap-x-4 max-w-5xl w-full">
        {currentStep === 2 && <AddOnsContainer />}
        {currentStep === 3 && <DriverDetailsForm />}
        {currentStep === 4 && <ApplicationDetailsContainer />}
        <SummaryInfoCard />
      </div>
    </>
  );
};

export default InsuranceContainerLayout;
