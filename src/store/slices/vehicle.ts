import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { VehicleStateType } from "./types";

const initialState: VehicleStateType = {
  vehicleLicenseId: "",
  avMakeCode: "",
  makeCode: "",
  vehicleMake: "",
  variant: "",
  modelCode: "",
  vehicleModel: "",
  vehicleEngineCC: "",
  vehicleEngine: "",
  vehicleChassis: "",
  yearOfManufacture: "",
  seatingCapacity: 0,
  polEffectiveDate: "",
  polExpiryDate: "",
  drivers: 0,
  region: "West Malaysia",
  periodOfCoverage: "",
  ncdPercentage: 0,
  reconIndicator: "yes",
  nvicList: [],
  requestId: ""
};

export const vehicleSlice = createSlice({
  name: "vehicle",
  initialState,
  reducers: {
    addVehicleRegNo: (state, action: PayloadAction<string>) => {
      state.vehicleLicenseId = action.payload;
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

export const getVehicleRegNo = (state: RootState) =>
  state.vehicle.vehicleLicenseId;

export default vehicleSlice.reducer;
