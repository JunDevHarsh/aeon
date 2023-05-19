import React, { createContext, useReducer } from "react";
import {
  ActionMap,
  AddOns,
  AdditionalDriverDetails,
  DriverDetails,
  MultiStepFormState,
} from "./types";
import {
  addDriverDetailsReducer,
  addOnsReducer,
  driverDetailsReducer,
} from "./reducers";

/*---------------Initial State---------------*/
const initialMultiStepFormState: MultiStepFormState = {
  addOns: [],
  addDriverDetails: [],
  driverDetails: {
    name: "",
    email: "",
    city: "",
    country: "Malaysia",
    mobileNumber: "",
    drivingExp: "",
    nationality: "Malaysia",
    occupation: "Teacher",
    race: "Chinese",
    address1: "",
    address2: "",
    address3: "",
    state: "",
    postalCode: "",
  },
};

/*---------------ENum types---------------*/
export enum AddOnsTypes {
  SelectionToggleById = "SELECTION_TOGGLE_BY_ID",
  IncludeAddOns = "INCLUDE_ADD_ONS",
  UpdateAddOnPrice = "UPDATE_ADD_ON_PRICE",
}

export enum AddDriverTypes {
  AddNewDriverDetails = "ADD_NEW_DRIVER_DETAILS",
  UpdateDriverDetails = "UPDATE_DRIVER_DETAILS",
  RemoveDriverDetailsById = "REMOVE_DRIVER_DETAILS",
}

export enum DriverTypes {
  UpdateDriverInfo = "UPDATE_DRIVER_INFO",
}

/*---------------Payload---------------*/
export type AddOnsPayload = {
  [AddOnsTypes.SelectionToggleById]: {
    id: string;
  };
  [AddOnsTypes.IncludeAddOns]: {
    addOns: AddOns[];
  };
  [AddOnsTypes.UpdateAddOnPrice]: {
    id: string;
    price: number;
  };
};

export type AddDriverDetailsPayload = {
  [AddDriverTypes.AddNewDriverDetails]: {
    id: string;
  };
  [AddDriverTypes.UpdateDriverDetails]: {
    id: string;
    updatedValue: Partial<AdditionalDriverDetails>;
  };
  [AddDriverTypes.RemoveDriverDetailsById]: {
    id: string;
  };
};

export type DriverDetailsPayload = {
  [DriverTypes.UpdateDriverInfo]: {
    updatedValues: Partial<DriverDetails>;
  };
};

export type AddOnsActions =
  ActionMap<AddOnsPayload>[keyof ActionMap<AddOnsPayload>];

export type AddDriverActions =
  ActionMap<AddDriverDetailsPayload>[keyof ActionMap<AddDriverDetailsPayload>];

export type DriverDetailsActions =
  ActionMap<DriverDetailsPayload>[keyof ActionMap<DriverDetailsPayload>];

/*---------------MultiForm Context---------------*/
export const MultiStepFormContext = createContext<{
  store: MultiStepFormState;
  dispatch: React.Dispatch<
    AddOnsActions | AddDriverActions | DriverDetailsActions
  >;
}>({
  store: initialMultiStepFormState,
  dispatch: () => null,
});

/*---------------Multiple Reducers---------------*/
const mainReducer = (
  { addOns, addDriverDetails, driverDetails }: MultiStepFormState,
  action: AddOnsActions | AddDriverActions | DriverDetailsActions
): MultiStepFormState => ({
  addOns: addOnsReducer(addOns, action),
  addDriverDetails: addDriverDetailsReducer(addDriverDetails, action),
  driverDetails: driverDetailsReducer(driverDetails, action),
});

const MultiFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [store, dispatch] = useReducer(mainReducer, initialMultiStepFormState);

  return (
    <MultiStepFormContext.Provider value={{ store, dispatch }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};

export default MultiFormContextProvider;
