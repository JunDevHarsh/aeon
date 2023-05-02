import {
  AddOnsTypes,
  AddOnsActions,
  AddDriverActions,
  AddDriverTypes,
  AddOns,
  AdditionalDriverDetails,
} from "./context";

export const addOnsReducer = (
  state: AddOns[],
  action: AddOnsActions | AddDriverActions
) => {
  const { type, payload } = action;
  switch (type) {
    case AddOnsTypes.ToggleAddOnById: {
      const updatedAddOns = state.map((addOn) =>
        addOn.id === payload.id
          ? { ...addOn, isSelected: !addOn.isSelected }
          : addOn
      );
      return [...updatedAddOns];
    }
    case AddOnsTypes.UpdateAddOnValue: {
      const updatedAddOns = state.map((addOn) =>
        addOn.id === payload.id ? { ...addOn, price: payload.value } : addOn
      );
      return [...updatedAddOns];
    }
    default:
      return state;
  }
};

export const addDriverDetailsReducer = (
  state: AdditionalDriverDetails[],
  action: AddDriverActions | AddOnsActions
) => {
  const { type, payload } = action;
  switch (type) {
    case AddDriverTypes.AddNewDriverDetails: {
      return [
        ...state,
        {
          ...payload,
        },
      ];
    }
    case AddDriverTypes.UpdateDriverDetails: {
      const updatedProp = state.map((detail) =>
        detail.id === payload.id
          ? { ...detail, [payload.prop]: payload.value }
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
