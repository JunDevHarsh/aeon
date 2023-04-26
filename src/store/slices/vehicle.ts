import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type VehicleState = {
  regNo: string;
  make: string | null;
  model: string | null;
  yearOfManufacture: string;
  variant: string | null;
  engineNo: string;
  engineCC: string;
  chasisNo: string;
  class: string;
  seating: string;
  ncd: string;
};

const initialState: VehicleState = {
  regNo: "NBS2343",
  make: null,
  model: null,
  yearOfManufacture: "2020",
  variant: null,
  engineNo: "123456",
  engineCC: "1200",
  chasisNo: "ABCDE123456",
  class: "Private",
  seating: "5",
  ncd: "55",
};

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    updateVehicleRegNo: (state, action: PayloadAction<string>) => {
      state.regNo = action.payload;
    },
    updateVehicleState: (
      state,
      action: PayloadAction<Partial<VehicleState>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateVehicleRegNo, updateVehicleState } = vehicleSlice.actions;

export const getVehicleRegNo = (state: RootState) => state.vehicle.regNo;

export default vehicleSlice.reducer;
