import { Outlet, useLocation } from "react-router-dom";
import StepperNavbar from "../navbar/Stepper";
import NotFoundPage from "../../pages/NotFound";

const InsuranceRootLayout = () => {
  const { pathname } = useLocation();

  if (pathname === "/insurance" || pathname === "/insurance/") {
    return <NotFoundPage />;
  }

  return (
    <div className="relative mx-auto py-10 px-4 w-full">
      <div className="relative mx-auto max-w-6xl w-full">
        <div className="py-8 px-4 sm:px-12 flex flex-col items-center justify-center w-full bg-white rounded-[20px] shadow-container">
          {/* Current step navbar */}
          <StepperNavbar pathname={pathname} />
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default InsuranceRootLayout;
