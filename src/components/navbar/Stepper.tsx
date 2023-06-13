import Stepper from "../Stepper";

const steps = [
  {
    id: "131",
    title: "Plan Selection",
    path: "/insurance/plan-selection",
  },
  {
    id: "234",
    title: "Plan Add Ons",
    path: "/insurance/plan-add-ons",
  },
  {
    id: "265",
    title: "Application Details",
    path: "/insurance/application-details",
  },
  {
    id: "545",
    title: "Review & Pay",
    path: "/insurance/review-pay",
  },
];

const StepperNavbar = ({ pathname }: { pathname: string }) => {
  const currentStep = steps.findIndex((step) => step.path === pathname) + 1;

  return (
    <div className="flex items-center justify-center w-full" role="navigation">
      {steps.map(({ id, title }, index) => (
        <Stepper
          key={`stepper-${id}`}
          count={index + 1}
          status={
            index + 1 === currentStep
              ? "current"
              : index + 1 < currentStep
              ? "fulfilled"
              : "pending"
          }
          title={title}
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
