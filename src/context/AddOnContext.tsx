import React, { useState, createContext } from "react";

export type AddOnType = {
  id: string;
  title: string;
  description: string;
  price: number;
  sumInsured: number;
  isEditable: boolean;
  isSelected: boolean;
  localImgName:
    | "BodyInjuryIcon"
    | "CarAccidentIcon"
    | "CarSlideIcon"
    | "TowingIcon"
    | "WindScreenIcon"
    | "CarOilIcon"
    | "CarProperty1Icon"
    | "CarRainIcon";
  customImgName: string;
};

type AddOnsState = {
  addOns: AddOnType[];
  isEdited: boolean;
};

// context for Add-Ons
export const AddOnsContext = createContext<{
  state: AddOnsState;
  dispatch: React.Dispatch<React.SetStateAction<AddOnsState>>;
}>({
  state: { addOns: [], isEdited: false },
  dispatch: () => null,
});

const AddOnContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useState<AddOnsState>({
    addOns: [],
    isEdited: false,
  });

  return (
    <AddOnsContext.Provider value={{ state, dispatch }}>
      {children}
    </AddOnsContext.Provider>
  );
};

export default AddOnContextProvider;
