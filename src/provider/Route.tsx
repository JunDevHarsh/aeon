import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
} from "react-router-dom";
import { lazy, Suspense, LazyExoticComponent, ComponentType } from "react";
import RootLayout from "../components/layout/Root";
import InsuranceRootLayout from "../components/layout/Insurance";
import QuoteListingProvider from "../context/QuoteListing";
import AddOnsContainer from "../components/container/AddOns";

/**
 * Dynamically imports a React component using lazy loading.
 * @param filePath The file path of the component to import.
 * @returns A lazy-loaded component.
 */
function importComponent(
  filePath: string
): LazyExoticComponent<ComponentType<any>> {
  // Define the lazy-loaded component using the lazy function from React.
  const importedComponent: LazyExoticComponent<ComponentType<any>> = lazy(
    () => import(filePath)
  );

  // Return the lazy-loaded component.
  return importedComponent;
}

// Importing lazy-loaded components using the importComponent function
const MemoizedHomePage = importComponent("../pages/Home");
const MemoizedVehicleInfoPage = importComponent("../pages/VehicleInfo");
const MemoizedInsurancePage = importComponent("../pages/Insurance");
const MemoizedPaymentPage = importComponent("../pages/Payment");
const MemoizedNotFoundPage = importComponent("../pages/NotFound");

const MemoizedQuoteListingContainer = importComponent(
  "../components/container/QuoteListings"
);
// The components are now lazily loaded and memoized for optimal performance

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
            <RootLayout />
          </Suspense>
        </>
      }
    >
      {/* home page or "/" route */}
      <Route
        index
        element={
          <Suspense fallback={<div>Loading...</div>}>
            <MemoizedHomePage />
          </Suspense>
        }
      />
      {/* vehicle's info or "/vehicle-info" route*/}
      <Route path="/vehicle-info" element={<MemoizedVehicleInfoPage />} />
      <Route
        path="/insuranc"
        element={<MemoizedInsurancePage />}
        errorElement={<ErrorBoundary />}
      />
      <Route
        path="/insurance"
        element={
          <QuoteListingProvider>
            <InsuranceRootLayout />
          </QuoteListingProvider>
        }
      >
        <Route index element={<MemoizedNotFoundPage />} />
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
                  <div className="relative w-full">
                    <div className="mt-8 flex flex-col items-center justify-between w-full gap-y-4">
                      <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
                      <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
                      <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
                    </div>
                  </div>
                </>
              }
            >
              <MemoizedQuoteListingContainer />
            </Suspense>
          }
        />
        <Route path="plan-add-ons" element={<AddOnsContainer />} />
        <Route path="application-details" element={<div>Step 3</div>} />
        <Route path="review-pay" element={<div>Step 4</div>} />
      </Route>
      <Route path="/payment" element={<MemoizedPaymentPage />} />
      <Route path="*" element={<MemoizedNotFoundPage />} />
    </Route>
  )
);

function ErrorBoundary() {
  let error = useRouteError();
  console.error(error);
  // Uncaught ReferenceError: path is not defined
  return <div>Dang!</div>;
}

export default router;
