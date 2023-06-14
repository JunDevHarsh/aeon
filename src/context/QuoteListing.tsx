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
  AddQuotes = "ADD_QUOTES",
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
  [QuotesTypes.AddQuotes]: {
    quotes: InsurerQuoteStateType[];
  }
};

export type QuoteFilterAction =
  ActionMap<QuoteFilterPayload>[keyof ActionMap<QuoteFilterPayload>];

export type QuotesAction =
  ActionMap<QuotesPayload>[keyof ActionMap<QuotesPayload>];

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
  // quotes: defaultQuotes
  quotes: [],
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
