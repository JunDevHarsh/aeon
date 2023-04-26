import { configureStore } from "@reduxjs/toolkit";
import insuranceReducer from "./slices/insurance";
import userReducer from "./slices/user";

export const store = configureStore({
  reducer: {
    insurance: insuranceReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
