import { useContext } from "react";
import QuoteListingsContainer from "../container/QuoteListings";
import { InsuranceContext } from "../../context/InsuranceContext";
import AddOnContextProvider from "../../context/AddOnContext";
import StepperNavbar from "../navbar/Stepper";
import VehicleCoverageProvider from "../../context/VehicleCoverage";
import InsuranceContainerLayout from "./InsuranceContainer";
import VehicleCoverageContainer from "../container/VehicleCoverage";

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
            <div className="py-10 mx-auto max-w-6xl w-full">
              <div className="py-8 px-12 flex flex-col items-center justify-center gap-y-4 w-full bg-white rounded-[20px] shadow-container">
                {/* Current step navbar */}
                <StepperNavbar />
                {currentStep === 1 ? (
                  <QuoteListingsContainer />
                ) : (
                  <InsuranceContainerLayout currentStep={currentStep} />
                )}
              </div>
            </div>
          )}
        </AddOnContextProvider>
      </VehicleCoverageProvider>
    </>
  );
};

export default InsuranceStepsLayout;
