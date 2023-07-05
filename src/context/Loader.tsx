import { createContext, useReducer } from "react";
import { ActionMap } from "./types";

// types
type LoaderProviderProps = {
  children: React.ReactNode;
};

type LoaderContextType = {
  state: LoaderContextState;
  dispatch: React.Dispatch<LoadingActions>;
};

type LoaderContextState = {
  isLoading: boolean;
};

export enum LoaderActionTypes {
  ToggleLoading = "TOGGLE_LOADING",
}

export type LoadingPayload = {
  [LoaderActionTypes.ToggleLoading]: boolean;
};

export type LoadingActions =
  ActionMap<LoadingPayload>[keyof ActionMap<LoadingPayload>];

const initialState: LoaderContextState = {
  isLoading: false,
};

// context
export const LoaderContext = createContext<LoaderContextType>({
  state: initialState as LoaderContextState,
  dispatch: () => null,
});

// reducer
function LoaderReducer(state: LoaderContextState, action: LoadingActions) {
  const { type, payload } = action;
  switch (type) {
    case LoaderActionTypes.ToggleLoading: {
      return {
        ...state,
        isLoading: payload,
      };
    }
    default:
      return state;
  }
}

function LoaderProvider({ children }: LoaderProviderProps) {
  const [state, dispatch] = useReducer(LoaderReducer, initialState);
  const { isLoading } = state;

  return (
    <LoaderContext.Provider value={{ state, dispatch }}>
      {isLoading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 h-full w-full bg-gradient-to-tr from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-10">
          <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full h-full z-20">
            <div className="lds-spinner">
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
              <div />
            </div>
          </div>
        </div>
      )}
      {children}
    </LoaderContext.Provider>
  );
}

export default LoaderProvider;
