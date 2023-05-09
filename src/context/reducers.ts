/*---------------Multi Step Form Reducer---------------*/

import { CurrentStepState, ProviderState } from "./types";
import { MultiFormStepAction, MultiFormStepTypes } from "./StepContext";
import {
  InsuranceProviderAction,
  InsuranceProviderTypes,
} from "./InsuranceContext";

export const currentStepReducer = (
  state: CurrentStepState,
  action: MultiFormStepAction
) => {
  const { type, payload } = action;
  switch (type) {
    case MultiFormStepTypes.UpdateCurrentStep: {
      const { newStep } = payload;
      return {
        currentStep: newStep,
      };
    }
    default:
      return state;
  }
};

/*---------------Insurance Reducer---------------*/
export const insuranceProviderReducer = (
  state: ProviderState | null,
  action: InsuranceProviderAction
) => {
  const { type, payload } = action;
  switch (type) {
    case InsuranceProviderTypes.UpdateInsuranceProvider: {
      const { companyId, companyName, price } = payload;
      if (!state) {
        return {
          id: companyId,
          name: companyName,
          price: price,
        };
      }
      return {
        ...state,
        id: companyId,
        name: companyName,
        price: price,
      };
    }
    default:
      return state;
  }
};
