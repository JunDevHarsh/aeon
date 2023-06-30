import { createContext, useReducer } from "react";
import {
  ActionMap,
  QuoteListingPropType,
  QuoteListingStateType,
} from "./types";
import { quotesReducer } from "./reducers";
import { InsurerQuoteType } from "../data/listOfQuotes";

/*---------------Actions---------------*/

export enum QuotesTypes {
  AddQuotes = "ADD_QUOTES",
  UpdateQuoteById = "UPDATE_QUOTE_BY_ID",
}

/*---------------Payload Types---------------*/

export type QuotesPayload = {
  [QuotesTypes.AddQuotes]: {
    quotes: InsurerQuoteType[];
  };
  [QuotesTypes.UpdateQuoteById]: {
    productId: string;
    data: any;
  };
};

export type QuotesAction =
  ActionMap<QuotesPayload>[keyof ActionMap<QuotesPayload>];

// default state for context
const defaultQuoteListingState: QuoteListingStateType = {
  // quotes: defaultQuotes
  quotes: [],
};

export const QuoteListingContext = createContext<{
  state: QuoteListingStateType;
  dispatch: React.Dispatch<QuotesAction>;
}>({
  state: defaultQuoteListingState,
  dispatch: () => null,
});

const QuoteListingProvider = ({ children }: QuoteListingPropType) => {
  const [state, dispatch] = useReducer(quotesReducer, defaultQuoteListingState);
  
  return (
    <QuoteListingContext.Provider value={{ state, dispatch }}>
      {children}
    </QuoteListingContext.Provider>
  );
};

export default QuoteListingProvider;
