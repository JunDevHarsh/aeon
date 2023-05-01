import { useSelector } from "react-redux";
import StepperNavbar from "../components/navbar/Stepper";
import { getCurrentStep } from "../store/slices/insurance";
import QuoteListingsContainer from "../components/container/QuoteListings";
import InsuranceStepsLayout from "../components/layout/InsuranceSteps";

const steps = [
  "Plan Selection",
  "Plan Add Ons",
  "Application Details",
  "Review & Pay",
];

const InsurancePage = () => {
  const currentStep: number = useSelector(getCurrentStep);

  return (
    <div className="py-10 mx-auto max-w-7xl w-full">
      <div className="py-8 px-12 flex flex-col items-center justify-cente gap-y-4 w-full bg-white rounded-[20px]">
        <StepperNavbar currentStep={currentStep} steps={steps} />
        {currentStep === 1 ? (
          <QuoteListingsContainer />
        ) : (
          <InsuranceStepsLayout currentStep={currentStep} />
        )}
      </div>
    </div>
  );
};

export default InsurancePage;
