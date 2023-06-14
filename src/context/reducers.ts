/*---------------Multi Step Form Reducer---------------*/
import {
  AddOns,
  AdditionalDriverDetails,
  DriverDetails,
  InsurerQuoteStateType,
  QuotesFilterType,
} from "./types";
import {
  InsuranceProviderAction,
  InsuranceProviderTypes,
  ProviderState,
} from "./InsuranceContext";
import {
  AddDriverActions,
  AddDriverTypes,
  AddOnsActions,
  AddOnsTypes,
  DriverDetailsActions,
  DriverTypes,
} from "./MultiFormContext";
import {
  QuoteFilterAction,
  QuoteFilterTypes,
  QuotesAction,
  QuotesTypes,
} from "./QuoteListing";

/*---------------Insurance Reducer---------------*/
export const insuranceProviderReducer = (
  state: ProviderState,
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

/*---------------Quote Listing Reducer---------------*/
export const quoteFilterReducer = (
  state: QuotesFilterType,
  action: QuoteFilterAction | QuotesAction
) => {
  const { type, payload } = action;
  switch (type) {
    case QuoteFilterTypes.UpdateFilterSort: {
      const updatedState = {
        ...state,
        sort: payload.value,
      };
      return updatedState;
    }
    case QuoteFilterTypes.UpdateFilterPlan: {
      const updatedState = {
        ...state,
        plan: payload.list,
      };
      return updatedState;
    }
    default:
      return state;
  }
};

export const quotesReducer = (
  state: InsurerQuoteStateType[],
  action: QuotesAction | QuoteFilterAction
) => {
  const { type, payload } = action;
  switch (type) {
    case QuotesTypes.ToggleQuoteSelection: {
      const { id } = payload;
      const updatedState = state.map((item) =>
        item.id === id ? { ...item, isSelected: !item.isSelected } : item
      );
      return updatedState;
    }
    case QuotesTypes.AddQuotes: {
      const { quotes } = payload;
      return [...quotes];
    }
    default:
      return state;
  }
};
