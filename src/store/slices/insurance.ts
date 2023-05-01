import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type ProviderState = {
  companyId: string;
  companyName: string;
  price: number;
};

type CoverageState = {
  type: "market" | "aggreed";
  value: number;
};

type InsuranceState = {
  type: "new" | "renewal";
  vehicle: "car" | "motorcycle";
  provider: ProviderState | null;
  coverage: CoverageState | null;
  referralCode: string | null;
  currentStep: number;
};

const initialState: InsuranceState = {
  type: "new",
  vehicle: "car",
  coverage: null,
  referralCode: null,
  provider: {
    companyId: "1001",
    companyName: "Allianz",
    price: 609.35,
  },
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
    updateInsuranceProvider: (state, action: PayloadAction<ProviderState>) => {
      state.provider = action.payload;
      state.currentStep = state.currentStep + 1;
    },
    updateInsuranceCoverage: (state, action: PayloadAction<CoverageState>) => {
      state.coverage = action.payload;
    },
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
} = insuranceSlice.actions;

export default insuranceSlice.reducer;
