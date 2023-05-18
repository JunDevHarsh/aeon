import React, { createContext, useReducer } from "react";
import { ActionMap, InsuranceState } from "./types";
import {
  IsMVContainerVisibleReducer,
  currentStepReducer,
  insuranceProviderReducer,
} from "./reducers";
// prop types for InsuranceContext
type InsuranceContextProps = {
  children: React.ReactNode;
};

/*---------------Actions---------------*/
// Provider
export enum InsuranceProviderTypes {
  UpdateInsuranceProvider = "UPDATE_INSURANCE_PROVIDER",
}
// Current Step
export enum CurentStepTypes {
  UpdateCurrentStep = "UPDATE_CURRENT_STEP",
}
// IsMVContainerVisible
export enum IsMVContainerVisibleTypes {
  UpdateContainerVisibility = "UPDATE_CONTAINER_VISIBILITY",
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

// CurrentStep
export type CurrentStepPayload = {
  [CurentStepTypes.UpdateCurrentStep]: {
    newStep: number;
  };
};

// IsMVContainerVisible
export type IsMVConatainerVisiblePayload = {
  [IsMVContainerVisibleTypes.UpdateContainerVisibility]: {
    shouldVisible: boolean;
  };
};

// Provider
export type InsuranceProviderAction =
  ActionMap<InsuranceProviderPayload>[keyof ActionMap<InsuranceProviderPayload>];

export type CurrentStepAction =
  ActionMap<CurrentStepPayload>[keyof ActionMap<CurrentStepPayload>];

export type IsMVContainerVisibleAction =
  ActionMap<IsMVConatainerVisiblePayload>[keyof ActionMap<IsMVConatainerVisiblePayload>];

/*---------------Initial State/Values---------------*/

const initialInsuranceState: InsuranceState = {
  provider: null,
  currentStep: 1,
  isMVContainerVisible: false,
};

/*---------------Context---------------*/

export const InsuranceContext = createContext<{
  state: InsuranceState;
  dispatch: React.Dispatch<
    InsuranceProviderAction | CurrentStepAction | IsMVContainerVisibleAction
  >;
}>({ state: initialInsuranceState, dispatch: () => null });

const mainReducer = (
  { provider, currentStep, isMVContainerVisible }: InsuranceState,
  actions:
    | InsuranceProviderAction
    | CurrentStepAction
    | IsMVContainerVisibleAction
): InsuranceState => ({
  provider: insuranceProviderReducer(provider, actions),
  currentStep: currentStepReducer(currentStep, actions),
  isMVContainerVisible: IsMVContainerVisibleReducer(
    isMVContainerVisible,
    actions
  ),
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
