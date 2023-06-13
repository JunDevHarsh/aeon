import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { VehicleStateType } from "./types";

const initialState: VehicleStateType = {
  regNo: "",
  make: "",
  model: "",
  yearOfManufacture: "",
  variant: null,
  engineNo: "",
  engineCC: "",
  chasisNo: "",
  class: "Private",
  region: "West Malaysia",
  drivers: "0",
  seating: "",
  ncd: "",
  reconIndicator: "no",
  periodOfCoverage: "",
  nvicList: [],
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
