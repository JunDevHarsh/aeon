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
  roadTaxReducer,
} from "./reducers";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

/*---------------Initial State---------------*/
const initialMultiStepFormState: MultiStepFormState = {
  addOns: [],
  addDriverDetails: {
    selectedDriverType: "",
    driverDetails: [],
    hasSubmitted: false,
    shouldUpdate: false,
    hasUpdated: false,
    isSelected: false,
  },
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
  roadTax: false,
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
  SelectAdditionalDriver = "SELECT_ADDITIONAL_DRIVER",
  UnSelectAdditionalDriver = "UNSELECT_ADDITIONAL_DRIVER",
}

export enum DriverTypes {
  UpdateDriverInfo = "UPDATE_DRIVER_INFO",
}

export enum RoadTaxTypes {
  UpdateRoadTax = "UPDATE_ROAD_TAX",
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
  [AddDriverTypes.SelectAdditionalDriver]: {
    val: string;
  };
  [AddDriverTypes.UnSelectAdditionalDriver]: {
    val: string
  };
};

export type DriverDetailsPayload = {
  [DriverTypes.UpdateDriverInfo]: {
    updatedValues: Partial<DriverDetails>;
  };
};

export type RoadTaxPayload = {
  [RoadTaxTypes.UpdateRoadTax]: {
    roadTax: boolean;
  };
};

export type AddOnsActions =
  ActionMap<AddOnsPayload>[keyof ActionMap<AddOnsPayload>];

export type AddDriverActions =
  ActionMap<AddDriverDetailsPayload>[keyof ActionMap<AddDriverDetailsPayload>];

export type DriverDetailsActions =
  ActionMap<DriverDetailsPayload>[keyof ActionMap<DriverDetailsPayload>];

export type RoadTaxActions =
  ActionMap<RoadTaxPayload>[keyof ActionMap<RoadTaxPayload>];

/*---------------MultiForm Context---------------*/
export const MultiStepFormContext = createContext<{
  store: MultiStepFormState;
  dispatch: React.Dispatch<
    AddOnsActions | AddDriverActions | DriverDetailsActions | RoadTaxActions
  >;
}>({
  store: initialMultiStepFormState,
  dispatch: () => null,
});

/*---------------Multiple Reducers---------------*/
const mainReducer = (
  { addOns, addDriverDetails, driverDetails, roadTax }: MultiStepFormState,
  action:
    | AddOnsActions
    | AddDriverActions
    | DriverDetailsActions
    | RoadTaxActions
): MultiStepFormState => ({
  addOns: addOnsReducer(addOns, action),
  addDriverDetails: addDriverDetailsReducer(addDriverDetails, action),
  driverDetails: driverDetailsReducer(driverDetails, action),
  roadTax: roadTaxReducer(roadTax, action),
});

const MultiFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    user: { email, mobileNumber, postalCode, drivingExp },
  } = useSelector((state: RootState) => state);
  const [store, dispatch] = useReducer(mainReducer, {
    ...initialMultiStepFormState,
    driverDetails: {
      ...initialMultiStepFormState.driverDetails,
      email: email,
      mobileNumber: mobileNumber,
      postalCode: postalCode,
      drivingExp: drivingExp,
    },
  });

  return (
    <MultiStepFormContext.Provider value={{ store, dispatch }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};

export default MultiFormContextProvider;
