import React, { useState } from "react";
// import { AddOnsTypes } from "./MultiStepForm";

export type AddOnsState = {
  title: string;
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
  requiredinfo: "0" | "1";
  moredetail?: {
    question: string;
    fieldtype: "Dropdown" | "Text Box";
    options: Option | string;
  };
};

type Option = {
  code: string;
  label: string;
  value: string;
};

type AddOnsStateType = {
  addOns: AddOnsState[];
  isEdited: boolean;
};

export const NewAddOnsContext = React.createContext<{
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

const NewAddOnsProvider = ({ children }: AddOnsProviderProps) => {
  const [state, dispatch] = useState<AddOnsStateType>({
    addOns: [],
    isEdited: false,
  });

  return (
    <NewAddOnsContext.Provider value={{ state, dispatch }}>
      {children}
    </NewAddOnsContext.Provider>
  );
};

export default NewAddOnsProvider;
