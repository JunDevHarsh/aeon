import { useContext } from "react";
import QuoteListingsContainer from "../container/QuoteListings";
import { InsuranceContext } from "../../context/InsuranceContext";
import AddOnContextProvider from "../../context/AddOnContext";
import StepperNavbar from "../navbar/Stepper";
import VehicleCoverageProvider from "../../context/VehicleCoverage";
import InsuranceContainerLayout from "./InsuranceContainer";
import VehicleCoverageContainer from "../container/VehicleCoverage";
import QuoteListingProvider from "../../context/QuoteListing";

const InsuranceStepsLayout = () => {
  const {
    state: { currentStep, isMVContainerVisible },
  } = useContext(InsuranceContext);

  return (
    <>
      <VehicleCoverageProvider>
        <AddOnContextProvider>
          {isMVContainerVisible ? (
            <VehicleCoverageContainer />
          ) : (
            <div className="relative mx-auto py-10 px-4 w-full">
              <div className="relative mx-auto max-w-6xl w-full">
                <div className="py-8 px-4 sm:px-12 flex flex-col items-center justify-center w-full bg-white rounded-[20px] shadow-container">
                  {/* Current step navbar */}
                  <StepperNavbar />
                  {currentStep === 1 ? (
                    <QuoteListingProvider>
                      <QuoteListingsContainer />
                    </QuoteListingProvider>
                  ) : (
                    <InsuranceContainerLayout currentStep={currentStep} />
                  )}
                </div>
              </div>
            </div>
          )}
        </AddOnContextProvider>
      </VehicleCoverageProvider>
    </>
  );
};

export default InsuranceStepsLayout;
