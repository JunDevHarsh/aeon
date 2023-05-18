/*---------------Multi Step Form Reducer---------------*/
import {
  AddOns,
  AdditionalDriverDetails,
  DriverDetails,
  ProviderState,
} from "./types";
import {
  CurentStepTypes,
  CurrentStepAction,
  InsuranceProviderAction,
  InsuranceProviderTypes,
  IsMVContainerVisibleAction,
  IsMVContainerVisibleTypes,
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
  state: number,
  action:
    | CurrentStepAction
    | InsuranceProviderAction
    | IsMVContainerVisibleAction
) => {
  const { type, payload } = action;
  switch (type) {
    case CurentStepTypes.UpdateCurrentStep: {
      const { newStep } = payload;
      return (state = newStep);
    }
    default:
      return state;
  }
};

/*---------------Insurance Reducer---------------*/
export const insuranceProviderReducer = (
  state: ProviderState | null,
  action:
    | InsuranceProviderAction
    | CurrentStepAction
    | IsMVContainerVisibleAction
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
    case AddOnsTypes.UpdateAddOnPrice: {
      const { id, price } = payload;
      const updatedAddOns = state.map((addOn) =>
        addOn.id === id ? { ...addOn, price: price } : addOn
      );
      return [...updatedAddOns];
    }
    default:
      return state;
  }
};

/*---------------IsMVContainerVisible Reducer---------------*/
export const IsMVContainerVisibleReducer = (
  state: boolean,
  action:
    | IsMVContainerVisibleAction
    | InsuranceProviderAction
    | CurrentStepAction
) => {
  const { payload, type } = action;
  switch (type) {
    case IsMVContainerVisibleTypes.UpdateContainerVisibility: {
      const { shouldVisible } = payload;
      return shouldVisible;
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
        idType: "NRIC",
        name: "",
        nationality: "Malaysia",
        relationship: "Insured",
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
