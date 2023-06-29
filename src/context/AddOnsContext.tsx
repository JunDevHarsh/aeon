import React, { useState } from "react";
// import { AddOnsTypes } from "./MultiStepForm";

export type AddOnsState = {
  coverCode: string;
  coverName: string;
  coverDescription: string;
  coverNarration: string;
  displayPremium: number;
  coverSumInsured: number;
  selectedIndicator: boolean;
  isSelected: boolean;
  addDisplayInd: boolean;
  sequence: number;
  addonimage: string;
  requiredinfo: string;
  moredetail?: {
    question: string;
    fieldtype: string;
    options: string;
  };
};

type AddOnsStateType = {
  addOns: AddOnsState[];
  isEdited: boolean;
};

export const AddOnContext = React.createContext<{
  state: AddOnsStateType;
  dispatch: React.Dispatch<React.SetStateAction<AddOnsStateType>>;
}>({
  state: {
    addOns: [],
    isEdited: false,
  },
  dispatch: () => null,
});

type AddOnsProviderProps = {
  children: React.ReactNode;
};

const AddOnsProvider = ({ children }: AddOnsProviderProps) => {
  const [state, dispatch] = useState<AddOnsStateType>({
    addOns: [],
    isEdited: false,
  });

  return (
    <AddOnContext.Provider value={{ state, dispatch }}>
      {children}
    </AddOnContext.Provider>
  );
};

export default AddOnsProvider;
