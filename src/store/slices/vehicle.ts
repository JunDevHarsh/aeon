import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { VehicleStateType } from "./types";

const initialState: VehicleStateType = {
  regNo: "AHC5758",
  make: "TOYOTA",
  model: "COROLLA",
  yearOfManufacture: "2010",
  variant: "ALTIS G 4 SP AUTOMATIC - 1794",
  engineNo: "1ZZ4984652",
  engineCC: "1794",
  chasisNo: "MR053ZEE206120869",
  class: "Private",
  region: "West Malaysia",
  drivers: "0",
  seating: "5",
  ncd: "55",
  reconIndicator: "no",
  periodOfCoverage: "2023-08-04 to 2024-08-03",
  nvicList: [
    {
        "nvic": "H7B10A",
        "vehicleMarketValue": 30500,
        "vehicleVariant": "ALTIS G 4 SP AUTOMATIC - 1794"
    }
],
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
