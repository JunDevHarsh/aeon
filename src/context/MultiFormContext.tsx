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
  termsAndConditionsReducer,
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
  termsAndConditions: false,
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
  SubmitAddDriverDetails = "SUBMIT_ADD_DRIVER_DETAILS",
  AddErrors = "ADD_ERRORS",
}

export enum DriverTypes {
  UpdateDriverInfo = "UPDATE_DRIVER_INFO",
  AddDriverInfoErrors = "ADD_DRIVER_INFO_ERRORS",
}

export enum RoadTaxTypes {
  UpdateRoadTax = "UPDATE_ROAD_TAX",
}

export enum TermsAndConditionsTypes {
  UpdateTermsAndConditions = "UPDATE_TERMS_AND_CONDITIONS",
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
  [AddDriverTypes.AddNewDriverDetails]: {};
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
    val: string;
  };
  [AddDriverTypes.SubmitAddDriverDetails]: {};
  [AddDriverTypes.AddErrors]: {
    updatedDrivers: AdditionalDriverDetails[];
  };
};

export type DriverDetailsPayload = {
  [DriverTypes.UpdateDriverInfo]: {
    updatedValues: Partial<DriverDetails>;
  };
  [DriverTypes.AddDriverInfoErrors]: {
    updatedValues: Partial<DriverDetails>;
  };
};

export type RoadTaxPayload = {
  [RoadTaxTypes.UpdateRoadTax]: {
    roadTax: boolean;
  };
};

export type TermsAndConditionsPayload = {
  [TermsAndConditionsTypes.UpdateTermsAndConditions]: {
    termsAndConditions: boolean;
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

export type TermsAndConditionActions =
  ActionMap<TermsAndConditionsPayload>[keyof ActionMap<TermsAndConditionsPayload>];

/*---------------MultiForm Context---------------*/
export const MultiStepFormContext = createContext<{
  store: MultiStepFormState;
  dispatch: React.Dispatch<
    | AddOnsActions
    | AddDriverActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
  >;
}>({
  store: initialMultiStepFormState,
  dispatch: () => null,
});

/*---------------Multiple Reducers---------------*/
const mainReducer = (
  {
    addOns,
    addDriverDetails,
    driverDetails,
    roadTax,
    termsAndConditions,
  }: MultiStepFormState,
  action:
    | AddOnsActions
    | AddDriverActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
) => ({
  addOns: addOnsReducer(addOns, action),
  addDriverDetails: addDriverDetailsReducer(addDriverDetails, action),
  driverDetails: driverDetailsReducer(driverDetails, action),
  roadTax: roadTaxReducer(roadTax, action),
  termsAndConditions: termsAndConditionsReducer(termsAndConditions, action),
});

const MultiFormContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    user: { email, mobileNumber, postalCode, drivingExp, city, state },
  } = useSelector((state: RootState) => state);

  const [store, dispatch] = useReducer(mainReducer, {
    ...initialMultiStepFormState,
    driverDetails: {
      ...initialMultiStepFormState.driverDetails,
      email: email,
      mobileNumber: mobileNumber,
      postalCode: postalCode,
      drivingExp: drivingExp,
      city: city,
      state: state,
      errors: {}
    },
  });

  return (
    <MultiStepFormContext.Provider value={{ store, dispatch }}>
      {children}
    </MultiStepFormContext.Provider>
  );
};

export default MultiFormContextProvider;
