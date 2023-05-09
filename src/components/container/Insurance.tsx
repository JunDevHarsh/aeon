import InsuranceContextProvider from "../../context/InsuranceContext";
import QuoteListingsContainer from "./QuoteListings";
import AddOnsContainer from "./AddOns";
import DriverDetailsForm from "../form/DriverDetails";
import ApplicationDetailsContainer from "./ApplicationDetails";
import SummaryInfoCard from "../card/Summary";

const InsuranceContainer = ({ currentStep }: { currentStep: number }) => {
  return (
    <InsuranceContextProvider>
      {currentStep === 1 ? (
        <QuoteListingsContainer />
      ) : (
        <div className="mx-auto mt-4 flex items-start justify-between gap-x-4 max-w-5xl w-full">
          {currentStep === 2 && <AddOnsContainer />}
          {currentStep === 3 && <DriverDetailsForm />}
          {currentStep === 4 && <ApplicationDetailsContainer />}
          <SummaryInfoCard />
        </div>
      )}
    </InsuranceContextProvider>
  );
};

export default InsuranceContainer;
