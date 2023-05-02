import { createContext, useReducer } from "react";
import { addDriverDetailsReducer, addOnsReducer } from "./reducers";

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
};

export type InsuranceState = {
  addOns: AddOns[];
  addDriverDetails: AdditionalDriverDetails[];
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
};

export const InsuranceContext = createContext<{
  state: InsuranceState;
  dispatch: React.Dispatch<any>;
}>({ state: initialInsuranceState, dispatch: () => null });

const mainReducer = (
  { addOns, addDriverDetails }: InsuranceState,
  action: AddOnsActions | AddDriverActions
) => ({
  addOns: addOnsReducer(addOns, action),
  addDriverDetails: addDriverDetailsReducer(addDriverDetails, action),
});

export const InsuranceProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(mainReducer, initialInsuranceState);
  return (
    <InsuranceContext.Provider value={{ state, dispatch }}>
      {children}
    </InsuranceContext.Provider>
  );
};
