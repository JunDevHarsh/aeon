import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InsuranceState = {
  type: "new" | "renewal";
  vehicle: "car" | "motorcycle";
  referralCode: string | null;
};

const initialState: InsuranceState = {
  type: "new",
  vehicle: "car",
  referralCode: null,
};

export const insuranceSlice = createSlice({
  name: "insurance",
  initialState,
  reducers: {
    updateInsuranceState: (
      state,
      action: PayloadAction<{
        type: "new" | "renewal";
        vehicle: "car" | "motorcycle";
      }>
    ) => {
      const { type, vehicle } = action.payload;
      state.type = type;
      state.vehicle = vehicle;
    },
    updateReferralCode: (state, action: PayloadAction<string>) => {
      state.referralCode = action.payload;
    },
  },
});

export const getInsuranceInfo = (state: RootState) => state.insurance;

export const { updateInsuranceState, updateReferralCode } = insuranceSlice.actions;

export default insuranceSlice.reducer;
