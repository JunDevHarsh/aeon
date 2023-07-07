import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
} from "react-router-dom";
import { Suspense, lazy } from "react";
// import { lazy, Suspense, LazyExoticComponent, ComponentType } from "react";
import RootLayout from "../components/layout/Root";
import InsuranceRootLayout from "../components/layout/Insurance";
import QuoteListingProvider from "../context/QuoteListing";
import AddOnsContainer from "../components/container/AddOns";
import HomePage from "../pages/Home";
import VehicleInfoPage from "../pages/VehicleInfo";
// import InsurancePage from "../pages/Insurance";
import NotFoundPage from "../pages/NotFound";
// import QuoteListingsContainer from "../components/container/QuoteListings";
import PaymentPage from "../pages/Payment";
import InsuranceContextProvider from "../context/InsuranceContext";
// import VehicleCoverageContainer from "../components/container/VehicleCoverage";
import VehicleCoverageProvider from "../context/VehicleCoverage";
import AddOnContextProvider from "../context/AddOnContext";
import MultiFormContextProvider from "../context/MultiFormContext";
import DriverDetailsForm from "../components/form/DriverDetails";
import ApplicationDetailsContainer from "../components/container/ApplicationDetails";
import MarketAndAgreedProvider from "../context/MarketAndAgreedContext";
import MarketAndAgreedContainer from "../components/container/MarketAndAgreed";
import NewAddOnsProvider from "../context/AddOnsContext";
import OptionProvider from "../context/OptionContext";
// Context
import CredentialProvider from "../context/Credential";
import LoaderProvider from "../context/Loader";

const MemoizedQuoteListingsPage = lazy(
  () => import("../components/container/QuoteListings")
);

const router = createBrowserRouter(
  createRoutesFromElements(
    // index or main route -> "/"
    <Route
      path="/"
      hasErrorBoundary={true}
      errorElement={<ErrorBoundary />}
      element={
        <>
          <Suspense
            fallback={
              <main className="relative flex items-center justify-center w-full min-h-screen">
                <div className="mx-auto py-auto py-10 flex flex-col items-center justify-between max-w-3xl w-full">
                  <img
                    src="/guy_holding_stick.png"
                    alt="guy-holding-stick-in-his-hand-img"
                    className="mx-auto"
                  />
                  <p className="text-3xl text-center text-primary-black font-bold">
                    Loading
                  </p>
                </div>
              </main>
            }
          >
            <LoaderProvider>
              <CredentialProvider>
                <RootLayout />
              </CredentialProvider>
            </LoaderProvider>
          </Suspense>
        </>
      }
    >
      {/* home page or "/" route */}
      <Route
        index
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <HomePage />
          </Suspense>
        }
      />
      {/* vehicle's info or "/vehicle-info" route*/}
      <Route
        path="/vehicle-info"
        element={<VehicleInfoPage />}
        errorElement={<ErrorBoundary />}
      />
      {/* <Route
        path="/insuranc"
        element={<InsurancePage />}
        errorElement={<ErrorBoundary />}
      /> */}
      <Route
        path="/insurance"
        errorElement={<ErrorBoundary />}
        element={
          <QuoteListingProvider>
            <InsuranceContextProvider>
              <VehicleCoverageProvider>
                <AddOnContextProvider>
                  <NewAddOnsProvider>
                    <MultiFormContextProvider>
                      <MarketAndAgreedProvider>
                        <OptionProvider>
                          <InsuranceRootLayout />
                        </OptionProvider>
                      </MarketAndAgreedProvider>
                    </MultiFormContextProvider>
                  </NewAddOnsProvider>
                </AddOnContextProvider>
              </VehicleCoverageProvider>
            </InsuranceContextProvider>
          </QuoteListingProvider>
        }
      >
        <Route index element={<NotFoundPage />} />
        {/* Added route for "/insurance/quote-listings" to redirect to "/insurance" */}
        <Route
          path="plan-selection"
          element={
            <Suspense
              fallback={
                <>
                  <div className="relative mt-4 px-4 py-3 flex flex-col md:flex-row items-center justify-center w-full bg-[#F8F8F8] rounded-[10px]">
                    <div className="flex flex-col sm:flex-row items-start lg:items-center justify-center max-w-none sm:max-w-xl lg:max-w-3xl w-full">
                      <div className="animate-pulse relative py-8 lg:py-4 w-full sm:w-[45%] md:w-50% bg-gray-200 rounded"></div>
                      <div className="animate-pulse relative mt-4 sm:mt-0 ml-0 sm:ml-4 py-8 lg:py-4 w-full sm:w-[45%] md:w-50% bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </>
              }
            >
              <MemoizedQuoteListingsPage />
            </Suspense>
          }
        />
        <Route path="plan-add-ons" element={<AddOnsContainer />} />
        <Route path="application-details" element={<DriverDetailsForm />} />
        <Route path="review-pay" element={<ApplicationDetailsContainer />} />
        {/* <Route
          path="market-agreed-value"
          element={<VehicleCoverageContainer />}
        /> */}
        <Route
          path="market-agreed-value"
          element={<MarketAndAgreedContainer />}
        />
      </Route>
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Route>
  )
);

function ErrorBoundary() {
  let error = useRouteError();
  console.log(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>;
}

export default router;
