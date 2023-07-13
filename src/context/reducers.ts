/*---------------Multi Step Form Reducer---------------*/
import {
  AddOns,
  AdditionalDriverDetails,
  AdditionalDriverState,
  DriverDetails,
  QuoteListingStateType,
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
  IsEditedActions,
  IsEditedTypes,
  RoadTaxActions,
  RoadTaxTypes,
  TermsAndConditionActions,
  TermsAndConditionsTypes,
} from "./MultiFormContext";
import { QuotesAction, QuotesTypes } from "./QuoteListing";
import { nanoid } from "@reduxjs/toolkit";
/*---------------Insurance Reducer---------------*/
export const insuranceProviderReducer = (
  state: ProviderState,
  action: InsuranceProviderAction
) => {
  const { type, payload } = action;
  switch (type) {
    case InsuranceProviderTypes.UpdateInsuranceProvider: {
      const { companyId, companyName, price } = payload;
      return {
        ...state,
        id: companyId,
        name: companyName,
        price: price,
      };
    }
    case InsuranceProviderTypes.UpdateQuoteId: {
      const { quoteId } = payload;
      return {
        ...state,
        quoteId: quoteId,
      };
    }
    default:
      return state;
  }
};

/*---------------MultiStepForm Reducer---------------*/
export const addOnsReducer = (
  state: AddOns[],
  action:
    | AddOnsActions
    | AddDriverActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
    | IsEditedActions
) => {
  const { type, payload } = action;
  switch (type) {
    case AddOnsTypes.UpdateAddOnById: {
      const { coverCode, sumInsured, isSelected } = payload;
      const updatedAddOns = state.map((addOn) =>
        addOn.coverCode === coverCode
          ? {
              ...addOn,
              isSelected: isSelected,
              coverSumInsured: sumInsured,
            }
          : addOn
      );
      return [...updatedAddOns];
    }
    case AddOnsTypes.UpdateAddOnList: {
      const { updatedAddOns } = payload;
      return [...updatedAddOns];
    }
    default:
      return state;
  }
};

export const isEditedReducer = (
  state: boolean,
  action:
    | AddDriverActions
    | AddOnsActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
    | IsEditedActions
) => {
  const { type, payload } = action;
  switch (type) {
    case IsEditedTypes.ToggleIsEdited: {
      return payload.isEdited;
    }
    default:
      return state;
  }
};

/*---------------Additional Driver Details Reducer---------------*/
export const addDriverDetailsReducer = (
  state: AdditionalDriverState,
  action:
    | AddDriverActions
    | AddOnsActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
    | IsEditedActions
) => {
  const { type, payload } = action;
  switch (type) {
    case AddDriverTypes.AddNewDriverDetails: {
      const newDetails: AdditionalDriverDetails = {
        id: nanoid(),
        idNo: "",
        idType: "NRIC",
        name: "",
        nationality: "Malaysia",
        relationship: "Insured",
      };
      return {
        ...state,
        hasUpdated: true,
        shouldUpdate: true,
        driverDetails: [...state.driverDetails, newDetails],
      };
    }
    case AddDriverTypes.UpdateDriverDetails: {
      // console.log(payload.updatedValue.);
      const updatedProp = state.driverDetails.map((detail) =>
        detail.id === payload.id
          ? {
              ...detail,
              ...payload.updatedValue,
            }
          : detail
      );
      // console.log(updatedProp);
      return {
        ...state,
        hasUpdated: true,
        shouldUpdate: true,
        driverDetails: [...updatedProp],
      };
    }
    case AddDriverTypes.RemoveDriverDetailsById: {
      const updatedDrivderDetails = state.driverDetails.filter(
        (detail) => detail.id !== payload.id
      );
      if (updatedDrivderDetails.length === 0) {
        return {
          ...state,
          selectedDriverType: "",
          isSelected: false,
          hasUpdated: state.hasSubmitted,
          shouldUpdate: state.hasSubmitted,
        };
      }
      return {
        ...state,
        hasUpdated: true,
        shouldUpdate: true,
        driverDetails: updatedDrivderDetails,
      };
    }
    case AddDriverTypes.SelectAdditionalDriver: {
      const { val } = payload;
      if (val === "named") {
        return {
          ...state,
          selectedDriverType: val,
          isSelected: true,
          hasUpdated: true,
          shouldUpdate: true,
          driverDetails: [
            {
              id: nanoid(),
              idNo: "",
              idType: "NRIC",
              name: "",
              nationality: "Malaysia",
              relationship: "Insured",
            },
          ],
        };
      }
      return {
        ...state,
        selectedDriverType: val,
        isSelected: true,
        hasUpdated: true,
        shouldUpdate: true,
        driverDetails: [],
      };
    }
    case AddDriverTypes.UnSelectAdditionalDriver: {
      const { val } = payload;
      return {
        ...state,
        selectedDriverType: val,
        isSelected: false,
        hasUpdated: state.hasSubmitted,
        shouldUpdate: state.hasSubmitted,
        driverDetails: [],
      };
    }
    case AddDriverTypes.SubmitAddDriverDetails: {
      return {
        ...state,
        hasUpdated: false,
        shouldUpdate: false,
        hasSubmitted: true,
      };
    }
    case AddDriverTypes.AddErrors: {
      const { updatedDrivers } = payload;
      return {
        ...state,
        driverDetails: updatedDrivers,
      };
    }
    default:
      return state;
  }
};

/*---------------Driver Details Reducer---------------*/
export const driverDetailsReducer = (
  state: DriverDetails,
  action:
    | AddOnsActions
    | AddDriverActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
    | IsEditedActions
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
    case DriverTypes.AddDriverInfoErrors: {
      const { updatedValues } = payload;
      const updatedDriverDetails = {
        ...state,
        errors: updatedValues,
      };
      return updatedDriverDetails;
    }
    default:
      return state;
  }
};

export const quotesReducer = (
  state: QuoteListingStateType,
  action: QuotesAction
): QuoteListingStateType => {
  const { type, payload } = action;
  switch (type) {
    case QuotesTypes.AddQuotes: {
      const { quotes } = payload;
      // return [...quotes];
      return { ...state, quotes: [...quotes] };
    }
    case QuotesTypes.UpdateQuoteById: {
      const { productId, data } = payload;
      const updatedQuotes = state.quotes.map((quote) =>
        quote.productId === productId ? { ...quote, ...data } : quote
      );
      return { ...state, quotes: updatedQuotes };
    }
    default:
      return state;
  }
};

export const roadTaxReducer = (
  state: boolean,
  action:
    | AddDriverActions
    | AddOnsActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
    | IsEditedActions
) => {
  const { type, payload } = action;
  switch (type) {
    case RoadTaxTypes.UpdateRoadTax: {
      const { roadTax } = payload;
      return roadTax;
    }
    default:
      return state;
  }
};

export const termsAndConditionsReducer = (
  state: boolean,
  action:
    | AddDriverActions
    | AddOnsActions
    | DriverDetailsActions
    | RoadTaxActions
    | TermsAndConditionActions
    | IsEditedActions
) => {
  const { type, payload } = action;
  switch (type) {
    case TermsAndConditionsTypes.UpdateTermsAndConditions: {
      const { termsAndConditions } = payload;
      return termsAndConditions;
    }
    default:
      return state;
  }
};
