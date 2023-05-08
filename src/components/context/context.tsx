import { createContext, useReducer } from "react";
import {
  addDriverDetailsReducer,
  addOnsReducer,
  driverDetailsReducer,
} from "./reducers";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

// Types
export type AddOns = {
  id: string;
  title: string;
  isSelected: boolean;
  description: string;
  price: number;
};

export type AdditionalDriverDetails = {
  id: string;
  name: string;
  idType: string | null;
  idNo: string;
  relationship: string | null;
  nationality: string | null;
};

export type DriverDetails = {
  name: string;
  mobileNumber: string;
  email: string;
  nationality: string | null;
  race: string | null;
  drivingExp: string;
  occupation: string | null;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  country: string | null;
  postalCode: string;
};

export type InsuranceState = {
  addOns: AddOns[];
  addDriverDetails: AdditionalDriverDetails[];
  driverDetails: DriverDetails;
};

type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};

export enum AddOnsTypes {
  ToggleAddOnById = "TOGGLE_ADD_ONS_BY_ID",
  UpdateAddOnValue = "UPDATE_ADD_ON_VALUE",
}

export enum AddDriverTypes {
  AddNewDriverDetails = "ADD_NEW_DRIVER_DETAILS",
  UpdateDriverDetails = "UPDATE_DRIVER_DETAILS",
  RemoveDriverDetailsById = "REMOVE_DRIVER_DETAILS",
}

export enum DriverTypes {
  UpdateDriverInfo = "UPDATE_DRIVER_INFO",
}

export type AddOnsActionType = {
  type: "TOGGLE_ADD_ONS_BY_ID";
  payload: string;
};

export type AddOnsPayload = {
  [AddOnsTypes.ToggleAddOnById]: {
    id: string;
  };
  [AddOnsTypes.UpdateAddOnValue]: {
    id: string;
    value: number;
  };
};

export type AddOnsActions =
  ActionMap<AddOnsPayload>[keyof ActionMap<AddOnsPayload>];

export type AddDriverDetailsPayload = {
  [AddDriverTypes.AddNewDriverDetails]: {
    id: string;
    name: string;
    idType: null;
    idNo: string;
    relationship: null;
    nationality: null;
  };
  [AddDriverTypes.UpdateDriverDetails]: {
    id: string;
    prop: string;
    value: string;
  };
  [AddDriverTypes.RemoveDriverDetailsById]: {
    id: string;
  };
};

export type AddDriverActions =
  ActionMap<AddDriverDetailsPayload>[keyof ActionMap<AddDriverDetailsPayload>];

export type DriverDetailsPayload = {
  [DriverTypes.UpdateDriverInfo]: {
    prop: string;
    value: string;
  };
};

export type DriverDetailsActions =
  ActionMap<DriverDetailsPayload>[keyof ActionMap<DriverDetailsPayload>];

const initialInsuranceState: InsuranceState = {
  addOns: [
    {
      id: "addon-2",
      title: "Cover for Windscreens",
      description: "Cover for Windscreens, Windows And Sunroof",
      isSelected: true,
      price: 23,
    },
    {
      id: "addon-1",
      title: "Towing and Cleaning",
      description: "Towing and Cleaning due to Water Damage",
      isSelected: false,
      price: 32,
    },
  ],
  addDriverDetails: [],
  driverDetails: {
    name: "",
    email: "",
    city: "",
    country: "",
    mobileNumber: "",
    drivingExp: "",
    nationality: null,
    occupation: null,
    race: null,
    address1: "",
    address2: "",
    address3: "",
    state: "",
    postalCode: "",
  },
};

export const InsuranceContext = createContext<{
  state: InsuranceState;
  dispatch: React.Dispatch<
    AddOnsActions | AddDriverActions | DriverDetailsActions
  >;
}>({ state: initialInsuranceState, dispatch: () => null });

const mainReducer = (
  { addOns, addDriverDetails, driverDetails }: InsuranceState,
  action: AddOnsActions | AddDriverActions | DriverDetailsActions
) => ({
  addOns: addOnsReducer(addOns, action),
  addDriverDetails: addDriverDetailsReducer(addDriverDetails, action),
  driverDetails: driverDetailsReducer(driverDetails, action),
});

export const InsuranceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [state, dispatch] = useReducer(mainReducer, {
    ...initialInsuranceState,
    driverDetails: {
      ...initialInsuranceState.driverDetails,
      email: user.email,
      mobileNumber: user.mobileNumber,
      postalCode: user.postalCode,
    },
  });

  return (
    <InsuranceContext.Provider value={{ state, dispatch }}>
      {children}
    </InsuranceContext.Provider>
  );
};
