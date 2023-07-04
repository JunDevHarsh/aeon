import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { VehicleStateType } from "./types";

const initialState: VehicleStateType = {
  vehicleLicenseId: "",
  contractNumber: "",
  avMakeCode: "",
  makeCode: "",
  vehicleMake: "",
  modelCode: "",
  vehicleModel: "",
  vehicleEngineCC: "",
  vehicleEngine: "",
  vehicleChassis: "",
  yearOfManufacture: "",
  seatingCapacity: 0,
  ncdPercentage: 0,
  polEffectiveDate: "",
  variant: null,
  polExpiryDate: "",
  drivers: 0,
  region: "",
  periodOfCoverage: "",
  reconIndicator: "no",
  nvicList: [],
  requestId: "",
  inquiryId: ""
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
