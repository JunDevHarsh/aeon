import { ReactNode, createContext, useReducer } from "react";
import { ActionMap } from "./types";

type VehicleProviderProps = {
  children: ReactNode;
};

type Nvic = {
  nvic: string;
  vehicleMarketValue: number;
  vehicleVariant: string;
};

export type VehicleStateType = {
  vehicleRegistrationNumber: string; // vehicle registration number
  vehicleMake: string; // vehicle make
  makeCode: string; // make code
  avMakeCode: string; // av make code
  vehicleModel: string; // vehicle model
  modelCode: string; // model code
  vehicleVariant: Nvic | null; // vehicle variant
  listOfVariant: Nvic[]; // list of vehicle variant
  yearOfManufacture: string; // year of manufacture
  vehicleEngineNumber: string; // vehicle engine number
  vehicleEngineCC: string; // vehicle engine cc
  vehicleChassisNumber: string; // vehicle chassis number
  seatingCapacity: string; // seating capacity
  ncdPercentage: number; // ncd percentage
  drivers: string; // drivers
  region: "West Malaysia" | "East Malaysia"; // region
  reconIndicator: "yes" | "no"; // recon indicator
};

const initialState: VehicleStateType = {
  vehicleRegistrationNumber: "",
  vehicleMake: "",
  makeCode: "",
  avMakeCode: "",
  vehicleModel: "",
  modelCode: "",
  vehicleVariant: null,
  listOfVariant: [],
  yearOfManufacture: "",
  vehicleEngineNumber: "",
  vehicleEngineCC: "",
  vehicleChassisNumber: "",
  seatingCapacity: "",
  ncdPercentage: 0,
  drivers: "",
  region: "West Malaysia",
  reconIndicator: "no",
};

export enum VehicleProviderTypes {
  UpdateVehicleData = "UPDATE_VEHICLE_DATA",
}

export type VehicleProviderPayload = {
  [VehicleProviderTypes.UpdateVehicleData]: {
    vehicleRegistrationNumber: string;
    vehicleMake: string;
    makeCode: string;
    avMakeCode: string;
    vehicleModel: string;
    modelCode: string;
    vehicleVariant: Nvic | null;
    listOfVariant: Nvic[];
    yearOfManufacture: string;
    vehicleEngineNumber: string;
    vehicleEngineCC: string;
    vehicleChassisNumber: string;
    seatingCapacity: string;
    ncdPercentage: number;
    drivers: string;
    region: "West Malaysia" | "East Malaysia";
    reconIndicator: "yes" | "no";
  };
};

type VehicleProviderAction =
  ActionMap<VehicleProviderPayload>[keyof ActionMap<VehicleProviderPayload>];

export const VehicleContext = createContext<{
  state: VehicleStateType;
  dispatch: React.Dispatch<VehicleProviderAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

function vehicleReducer(
  state: VehicleStateType,
  action: VehicleProviderAction
) {
  const { payload, type } = action;
  switch (type) {
    case VehicleProviderTypes.UpdateVehicleData:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}

function VehicleProvider({ children }: VehicleProviderProps) {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);

  return (
    <VehicleContext.Provider value={{ state, dispatch }}>
      {children}
    </VehicleContext.Provider>
  );
}

export default VehicleProvider;
