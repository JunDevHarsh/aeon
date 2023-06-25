import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { VehicleStateType } from "./types";

const initialState: VehicleStateType = {
  vehicleLicenseId: "AHC5758",
  contractNumber: "CNAZ00002610904",
  avMakeCode: "TOYOTA",
  makeCode: "29",
  vehicleMake: "TOYOTA",
  modelCode: "06",
  vehicleModel: "COROLLA",
  vehicleEngineCC: "1794",
  vehicleEngine: "1ZZ4984652",
  vehicleChassis: "MR053ZEE206120869",
  yearOfManufacture: "2010",
  seatingCapacity: 5,
  ncdPercentage: 55,
  polEffectiveDate: "2023-08-04",
  variant: {
    nvic: "H7B10A",
    vehicleMarketValue: 30500,
    vehicleVariant: "ALTIS G 4 SP AUTOMATIC - 1794",
  },
  polExpiryDate: "2023-08-03",
  drivers: 0,
  region: "West Malaysia",
  periodOfCoverage: "2023-08-04 to 2024-08-03",
  reconIndicator: "no",
  nvicList: [
    {
      nvic: "H7B10A",
      vehicleMarketValue: 30500,
      vehicleVariant: "ALTIS G 4 SP AUTOMATIC - 1794",
    },
  ],
  requestId: "",
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
