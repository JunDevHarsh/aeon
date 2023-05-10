import { useContext } from "react";
import { StepContext } from "../../context/StepContext";
import QuoteListingsContainer from "../container/QuoteListings";
import AddOnsContainer from "../container/AddOns";
import DriverDetailsForm from "../form/DriverDetails";
import ApplicationDetailsContainer from "../container/ApplicationDetails";
import SummaryInfoCard from "../card/Summary";
import MultiFormContextProvider from "../../context/MultiFormContext";

const InsuranceStepsLayout = () => {
  const {
    state: { currentStep },
  } = useContext(StepContext);

  return (
    <>
      {currentStep === 1 ? (
        <QuoteListingsContainer />
      ) : (
        <MultiFormContextProvider>
          <div className="mx-auto mt-4 flex items-start justify-between gap-x-4 max-w-5xl w-full">
            {currentStep === 2 && <AddOnsContainer />}
            {currentStep === 3 && <DriverDetailsForm />}
            {currentStep === 4 && <ApplicationDetailsContainer />}
            <SummaryInfoCard />
          </div>
        </MultiFormContextProvider>
      )}
    </>
  );
};

export default InsuranceStepsLayout;
