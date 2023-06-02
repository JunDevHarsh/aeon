import { createContext, useReducer } from "react";
import {
  ActionMap,
  InsurerQuoteStateType,
  QuoteListingPropType,
  QuoteListingStateType,
  QuotesFilterPlanType,
} from "./types";
import { quoteFilterReducer, quotesReducer } from "./reducers";

/*---------------Actions---------------*/
export enum QuoteFilterTypes {
  UpdateFilterSort = "UPDATE_FILTER_SORT",
  UpdateFilterPlan = "UPDATE_FILTER_PLAN",
}

export enum QuotesTypes {
  ToggleQuoteSelection = "TOGGLE_QUOTE_SELECTION",
}

/*---------------Payload Types---------------*/
// Provider
export type QuoteFilterPayload = {
  [QuoteFilterTypes.UpdateFilterSort]: {
    value: string;
  };
  [QuoteFilterTypes.UpdateFilterPlan]: {
    list: QuotesFilterPlanType[];
  };
};

export type QuotesPayload = {
  [QuotesTypes.ToggleQuoteSelection]: {
    id: string;
  };
};

export type QuoteFilterAction =
  ActionMap<QuoteFilterPayload>[keyof ActionMap<QuoteFilterPayload>];

export type QuotesAction =
  ActionMap<QuotesPayload>[keyof ActionMap<QuotesPayload>];

// default quotes state
const defaultQuotes: InsurerQuoteStateType[] = [
  {
    id: "101",
    insurerId: "1001",
    insurerName: "Allianz",
    planType: "comprehensive",
    imgUrl: "allianz",
    price: 671.67,
    popular: true,
    isSelected: false,
    benefits: [
      "Third party body injury and death",
      "Third party property loss or damage",
      "Driver's Personal Accident",
      "Full special perils",
      "Legal liability to passengers",
      "6 months warranty on repairs",
      "Loss or Damage due to accident",
    ],
  },
  {
    id: "102",
    insurerId: "1002",
    insurerName: "MSIG",
    planType: "third-party",
    imgUrl: "msig",
    price: 700,
    popular: false,
    isSelected: false,
    benefits: [
      "Driver's Personal Accident",
      "Legal liability to passengers",
      "6 months warranty on repairs",
      "Loss or Damage due to accident",
    ],
  },
  {
    id: "103",
    insurerId: "1003",
    insurerName: "Zurich",
    planType: "comprehensive",
    imgUrl: "zurich",
    price: 709,
    popular: false,
    isSelected: false,
    benefits: [
      "Third party body injury and death",
      "Driver's Personal Accident",
      "Full special perils",
      "6 months warranty on repairs",
    ],
  },
];

// default state for context
const defaultQuoteListingState: QuoteListingStateType = {
  filter: {
    sort: null,
    plan: [
      { value: "comprehensive", label: "Comprehensive", isSelected: true },
      {
        value: "third-party",
        label: "Third Party, Fire and Theft",
        isSelected: false,
      },
    ],
  },
  quotes: defaultQuotes,
};

export const QuoteListingContext = createContext<{
  state: QuoteListingStateType;
  dispatch: React.Dispatch<QuotesAction | QuoteFilterAction>;
}>({
  state: defaultQuoteListingState,
  dispatch: () => null,
});

const mainReducer = (
  { filter, quotes }: QuoteListingStateType,
  actions: QuoteFilterAction | QuotesAction
) => ({
  filter: quoteFilterReducer(filter, actions),
  quotes: quotesReducer(quotes, actions),
});

const QuoteListingProvider = ({ children }: QuoteListingPropType) => {
  const [state, dispatch] = useReducer(mainReducer, defaultQuoteListingState);
  return (
    <QuoteListingContext.Provider value={{ state, dispatch }}>
      {children}
    </QuoteListingContext.Provider>
  );
};

export default QuoteListingProvider;
