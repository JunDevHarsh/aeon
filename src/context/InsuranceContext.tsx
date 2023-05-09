import React, { createContext, useReducer } from "react";
import { ActionMap, InsuranceState } from "./types";
import { insuranceProviderReducer } from "./reducers";
// prop types for InsuranceContext
type InsuranceContextProps = {
  children: React.ReactNode;
};

/*---------------Actions---------------*/
// Provider
export enum InsuranceProviderTypes {
  UpdateInsuranceProvider = "UPDATE_INSURANCE_PROVIDER",
}

/*---------------Payload Types---------------*/
// Provider
export type InsuranceProviderPayload = {
  [InsuranceProviderTypes.UpdateInsuranceProvider]: {
    companyId: string;
    companyName: string;
    price: string;
  };
};

// Provider
export type InsuranceProviderAction =
  ActionMap<InsuranceProviderPayload>[keyof ActionMap<InsuranceProviderPayload>];
/*---------------Initial State/Values---------------*/

const initialInsuranceState: InsuranceState = {
  provider: null,
};

/*---------------Context---------------*/

export const InsuranceContext = createContext<{
  state: InsuranceState;
  dispatch: React.Dispatch<InsuranceProviderAction>;
}>({ state: initialInsuranceState, dispatch: () => null });

const mainReducer = (
  { provider }: InsuranceState,
  actions: InsuranceProviderAction
): InsuranceState => ({
  provider: insuranceProviderReducer(provider, actions),
});

const InsuranceContextProvider = ({ children }: InsuranceContextProps) => {
  const [state, dispatch] = useReducer(mainReducer, initialInsuranceState);
  return (
    <InsuranceContext.Provider value={{ state, dispatch }}>
      {children}
    </InsuranceContext.Provider>
  );
};

export default InsuranceContextProvider;
