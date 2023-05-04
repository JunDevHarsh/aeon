import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Root from "../components/layout/Root";
import Header from "../components/navbar/Header";
import Footer from "../components/navbar/Footer";
import GuyImg from "../assets/images/guy_holding_stick.png";

const MemoizedHomePage = lazy(() => import("../pages/Home"));
const MemoizedVehicleInfoPage = lazy(() => import("../pages/VehicleInfo"));
const MemoizedInsurancePage = lazy(() => import("../pages/Insurance"));
const MemoizedPolicyCoveragePage = lazy(
  () => import("../pages/PolicyCoverage")
);
const MemoizedPaymentPage = lazy(() => import("../pages/Payment"));
const MemoizedNotFoundPage = lazy(() => import("../pages/NotFound"));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={
        <Suspense
          fallback={
            <>
              <Header />
              <main className="relative w-full min-h-[calc(100vh-159px)] h-full">
                <div className="mx-auto py-auto py-10 flex flex-col items-center justify-between max-w-3xl w-full">
                  <img
                    src={GuyImg}
                    alt="guy-holding-stick-in-his-hand"
                    className="mx-auto"
                  />
                  <p className="text-3xl text-center text-primary-black font-bold">
                    Loading
                  </p>
                </div>
              </main>
              <Footer />
            </>
          }
        >
          <Root />
        </Suspense>
      }
    >
      <Route index element={<MemoizedHomePage />} />
      <Route path="/vehicle-info" element={<MemoizedVehicleInfoPage />} />
      <Route path="/insurance" element={<MemoizedInsurancePage />} />
      <Route path="/vehicle-market" element={<MemoizedPolicyCoveragePage />} />
      <Route path="/payment" element={<MemoizedPaymentPage />} />
      <Route path="*" element={<MemoizedNotFoundPage />} />
    </Route>
  )
);

export default router;
