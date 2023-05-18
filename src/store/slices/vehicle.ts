import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { VehicleStateType } from "./types";

const initialState: VehicleStateType = {
  regNo: "NBS2343",
  make: "PERODUA",
  model: "AXIA",
  yearOfManufacture: "2020",
  variant: "XL T6 4D DOUBLE CAB PICK-UP 6 SP AUTO SPORTS MODE",
  engineNo: "123456",
  engineCC: "1200",
  chasisNo: "ABCDE123456",
  class: "Private",
  region: "West",
  drivers: "2",
  seating: "5",
  ncd: "30",
  reconIndicator: "no",
  periodOfCoverage: "2023-05-12"
};

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    addVehicleRegNo: (state, action: PayloadAction<string>) => {
      state.regNo = action.payload;
    },
    updateVehicleState: (
      state,
      action: PayloadAction<Partial<VehicleStateType>>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { addVehicleRegNo, updateVehicleState } = vehicleSlice.actions;

export const getVehicleRegNo = (state: RootState) => state.vehicle.regNo;

export default vehicleSlice.reducer;
