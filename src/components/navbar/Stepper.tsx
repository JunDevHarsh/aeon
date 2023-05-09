import { useContext } from "react";
import Stepper from "../Stepper";
import { StepContext } from "../../context/StepContext";

const steps: string[] = [
  "Plan Selection",
  "Plan Add Ons",
  "Application Details",
  "Review & Pay",
];

const StepperNavbar = () => {
  const {
    state: { currentStep },
  } = useContext(StepContext);

  return (
    <div className="flex items-center justify-center w-full" role="navigation">
      {steps.map((step, index) => (
        <Stepper
          key={`stepper-${index}`}
          count={index + 1}
          status={
            index + 1 === currentStep
              ? "current"
              : index + 1 < currentStep
              ? "fulfilled"
              : "pending"
          }
          title={step}
          turn={
            index + 1 === 1
              ? "start"
              : index + 1 === steps.length
              ? "end"
              : "center"
          }
        />
      ))}
    </div>
  );
};

export default StepperNavbar;
