import React, { createContext, useReducer } from "react";
import { ActionMap } from "./types";
import { insuranceProviderReducer } from "./reducers";
// prop types for InsuranceContext
type InsuranceContextProps = {
  children: React.ReactNode;
};
// Provider State
export type ProviderState = {
  id: string;
  name: string;
  quoteId: string;
  price: string;
};

/*---------------Actions---------------*/
// Provider
export enum InsuranceProviderTypes {
  UpdateInsuranceProvider = "UPDATE_INSURANCE_PROVIDER",
  UpdateQuoteId = "UPDATE_QUOTE_ID",
}

/*---------------Payload Types---------------*/
// Provider
export type InsuranceProviderPayload = {
  [InsuranceProviderTypes.UpdateInsuranceProvider]: {
    companyId: string;
    companyName: string;
    price: string;
  };
  [InsuranceProviderTypes.UpdateQuoteId]: {
    quoteId: string;
  };
};

// Provider
export type InsuranceProviderAction =
  ActionMap<InsuranceProviderPayload>[keyof ActionMap<InsuranceProviderPayload>];

/*---------------Initial State/Values---------------*/

const initialInsuranceState: ProviderState = {
  id: "",
  name: "",
  price: "",
  quoteId: "",
};

/*---------------Context---------------*/

export const InsuranceContext = createContext<{
  state: ProviderState;
  dispatch: React.Dispatch<InsuranceProviderAction>;
}>({ state: initialInsuranceState, dispatch: () => null });

const InsuranceContextProvider = ({ children }: InsuranceContextProps) => {
  const [state, dispatch] = useReducer(
    insuranceProviderReducer,
    initialInsuranceState
  );

  return (
    <InsuranceContext.Provider value={{ state, dispatch }}>
      {children}
    </InsuranceContext.Provider>
  );
};

export default InsuranceContextProvider;
