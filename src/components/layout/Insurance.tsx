import { Outlet, useLocation } from "react-router-dom";
import StepperNavbar from "../navbar/Stepper";
import NotFoundPage from "../../pages/NotFound";
// import { lazy } from "react";
import SummaryInfoCard from "../card/Summary";
import MarketAndAgreedContainer from "../container/MarketAndAgreed";

// const VehicleCoverageContainer = lazy(
//   () => import("../container/VehicleCoverage")
// );

const InsuranceRootLayout = () => {
  const { pathname } = useLocation();

  if (pathname === "/insurance" || pathname === "/insurance/") {
    return <NotFoundPage />;
  }

  if (
    pathname === "/insurance/market-agreed-value" ||
    pathname === "/insurance/market-agreed-value/"
  ) {
    return (
      // <Suspense fallback={<div>Loading...</div>}>
      <MarketAndAgreedContainer />
      // </Suspense>
    );
  }

  // if (pathname === "/insurance/test") {
  //   return <MarketAndAgreedContainer />;
  // }

  return (
    <div className="relative mx-auto py-10 px-4 w-full">
      <div className="relative mx-auto max-w-6xl w-full">
        <div className="py-8 px-4 sm:px-12 flex flex-col items-center justify-center w-full bg-white rounded-[20px] shadow-container">
          {/* Current step navbar */}
          <StepperNavbar pathname={pathname} />
          <div className="mx-auto mt-4 flex flex-col lg:flex-row items-center lg:items-start justify-between max-w-5xl w-full">
            <Outlet />
            {pathname !== "/insurance/plan-selection" && <SummaryInfoCard />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsuranceRootLayout;
