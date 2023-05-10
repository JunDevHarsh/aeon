/*---------------Multi Step Form Reducer---------------*/

import {
  AddOns,
  AdditionalDriverDetails,
  CurrentStepState,
  DriverDetails,
  ProviderState,
} from "./types";
import { MultiFormStepAction, MultiFormStepTypes } from "./StepContext";
import {
  InsuranceProviderAction,
  InsuranceProviderTypes,
} from "./InsuranceContext";
import {
  AddDriverActions,
  AddDriverTypes,
  AddOnsActions,
  AddOnsTypes,
  DriverDetailsActions,
  DriverTypes,
} from "./MultiFormContext";

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

/*---------------MultiStepForm Reducer---------------*/
export const addOnsReducer = (
  state: AddOns[],
  action: AddOnsActions | AddDriverActions | DriverDetailsActions
) => {
  const { type, payload } = action;
  switch (type) {
    case AddOnsTypes.SelectionToggleById: {
      const updatedAddOns = state.map((addOn) =>
        addOn.id === payload.id
          ? { ...addOn, isSelected: !addOn.isSelected }
          : addOn
      );
      return [...updatedAddOns];
    }
    case AddOnsTypes.IncludeAddOns: {
      return [...payload.addOns];
    }
    default:
      return state;
  }
};

/*---------------Additional Driver Details Reducer---------------*/
export const addDriverDetailsReducer = (
  state: AdditionalDriverDetails[],
  action: AddDriverActions | AddOnsActions | DriverDetailsActions
) => {
  const { type, payload } = action;
  switch (type) {
    case AddDriverTypes.AddNewDriverDetails: {
      const newDetails: AdditionalDriverDetails = {
        id: payload.id,
        idNo: "",
        idType: null,
        name: "",
        nationality: null,
        relationship: null,
      };
      return [...state, newDetails];
    }
    case AddDriverTypes.UpdateDriverDetails: {
      const updatedProp = state.map((detail) =>
        detail.id === payload.id
          ? { ...detail, ...payload.updatedValue }
          : detail
      );
      return updatedProp;
    }
    case AddDriverTypes.RemoveDriverDetailsById: {
      const updatedDrivderDetails = state.filter(
        (detail) => detail.id !== payload.id
      );
      return updatedDrivderDetails;
    }
    default:
      return state;
  }
};

/*---------------Driver Details Reducer---------------*/
export const driverDetailsReducer = (
  state: DriverDetails,
  action: AddOnsActions | AddDriverActions | DriverDetailsActions
) => {
  const { type, payload } = action;
  switch (type) {
    case DriverTypes.UpdateDriverInfo: {
      const updatedDriverDetails = {
        ...state,
        ...payload.updatedValues,
      };
      return updatedDriverDetails;
    }
    default:
      return state;
  }
};
