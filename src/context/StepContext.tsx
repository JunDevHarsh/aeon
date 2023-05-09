import React, { createContext, useReducer } from "react";
import { ActionMap, CurrentStepState } from "./types";
import { currentStepReducer } from "./reducers";
// prop types for StepContext
type CurrentStepProps = {
  children: React.ReactNode;
};

/*---------------Actions---------------*/

export enum MultiFormStepTypes {
  UpdateCurrentStep = "UPDATE_CURRENT_STEP",
}

/*---------------Action Types---------------*/

export type MultiFormStepPayload = {
  [MultiFormStepTypes.UpdateCurrentStep]: {
    newStep: number;
  };
};

export type MultiFormStepAction =
  ActionMap<MultiFormStepPayload>[keyof ActionMap<MultiFormStepPayload>];

/*---------------Initial State/Values---------------*/

const initialStepState: CurrentStepState = {
  currentStep: 1,
};

/*---------------Context---------------*/

export const StepContext = createContext<{
  state: CurrentStepState;
  dispatch: React.Dispatch<any>;
}>({ state: initialStepState, dispatch: () => null });

/*---------------Reducers---------------*/

// const mainReducer = (
//   { currentStep }: CurrentStepState,
//   action: MultiFormStepAction
// ) => ({
//   currentStep: currentStepReducer(currentStep, action),
// });

const StepContextProvider = ({ children }: CurrentStepProps) => {
  const [state, dispatch] = useReducer(currentStepReducer, initialStepState);
  return (
    <StepContext.Provider value={{ state, dispatch }}>
      {children}
    </StepContext.Provider>
  );
};

export default StepContextProvider;
