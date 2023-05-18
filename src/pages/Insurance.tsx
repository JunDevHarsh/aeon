import InsuranceStepsLayout from "../components/layout/InsuranceSteps";
import InsuranceContextProvider from "../context/InsuranceContext";

const InsurancePage = () => {
  return (
    <InsuranceContextProvider>
      <InsuranceStepsLayout />
    </InsuranceContextProvider>
  );
};

export default InsurancePage;
