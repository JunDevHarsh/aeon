import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import HomePage from "./pages/Home";
import ErrorPage from "./pages/Error";
import Root from "./components/layout/Root";
import { store } from "./store/store";
import VehicleInfoPage from "./pages/VehicleInfo";
import InsurancePage from "./pages/Insurance";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />} errorElement={<ErrorPage />}>
      <Route index element={<HomePage />} />
      <Route path="/vehicle-info" element={<VehicleInfoPage />} />
      <Route path="/insurance" element={<InsurancePage />} />
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
