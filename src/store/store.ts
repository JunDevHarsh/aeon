import { configureStore } from "@reduxjs/toolkit";
import insuranceReducer from "./slices/insurance";
import vehicleReducer from "./slices/vehicle";
import userReducer from "./slices/user";
import credentialReducer from "./slices/credentials";

export const store = configureStore({
  reducer: {
    user: userReducer,
    insurance: insuranceReducer,
    vehicle: vehicleReducer,
    credentials: credentialReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
