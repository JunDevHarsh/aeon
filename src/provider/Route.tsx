import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { lazy, Suspense } from "react";
import Root from "../components/layout/Root";

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
        <Suspense fallback={<div>Loading...</div>}>
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
