import {
  Navigate,
  Outlet,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  useRouteError,
} from "react-router-dom";
import { lazy, Suspense, LazyExoticComponent, ComponentType } from "react";
import RootLayout from "../components/layout/Root";
import InsuranceRootLayout from "../components/layout/Insurance";

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
      <Route index element={<MemoizedHomePage />} />
      <Route path="/vehicle-info" element={<MemoizedVehicleInfoPage />} />
      <Route
        path="/insurance"
        element={<MemoizedInsurancePage />}
        errorElement={<ErrorBoundary />}
      />
      <Route path="/form" element={<InsuranceRootLayout />}>
        <Route index element={<MemoizedQuoteListingContainer />} />
        {/* Added route for "/insurance/quote-listings" to redirect to "/insurance" */}
        <Route
          path="quote-listings"
          element={<Navigate to="/form" replace={true} />}
        />
        <Route path="step-two" element={<div>Step 2</div>} />
        <Route path="step-third" element={<div>Step 3</div>} />
        <Route path="step-four" element={<div>Step 4</div>} />
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
