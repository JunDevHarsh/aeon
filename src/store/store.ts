import { configureStore } from "@reduxjs/toolkit";
import insuranceReducer from "./slices/insurance";
import vehicleReducer from "./slices/vehicle";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    user: userReducer,
    insurance: insuranceReducer,
    vehicle: vehicleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
