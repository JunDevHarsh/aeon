import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import {
  CoverageStateType,
  InsuranceStateType,
  ProviderStateType,
} from "./types";

const initialState: InsuranceStateType = {
  type: "renewal",
  vehicle: "car",
  coverage: null,
  referralCode: null,
  provider: {
    companyId: "1001",
    companyName: "Allianz",
    price: 609.35,
  },
  finalPrice: 0,
  currentStep: 1,
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
    updateCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },
    updateInsuranceProvider: (
      state,
      action: PayloadAction<ProviderStateType>
    ) => {
      state.provider = action.payload;
      state.currentStep = state.currentStep + 1;
    },
    updateInsuranceCoverage: (
      state,
      action: PayloadAction<CoverageStateType>
    ) => {
      state.coverage = action.payload;
    },
    updateFinalPrice: (state, action: PayloadAction<number>) => {
      state.finalPrice = action.payload;
    }
  },
});

export const getInsuranceInfo = (state: RootState) => state.insurance;

export const getCurrentStep = (state: RootState) => state.insurance.currentStep;

export const {
  updateInsuranceState,
  updateReferralCode,
  updateCurrentStep,
  updateInsuranceProvider,
  updateInsuranceCoverage,
  updateFinalPrice
} = insuranceSlice.actions;

export default insuranceSlice.reducer;
