import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { ActionMap } from "./types";
import Popup from "reactjs-popup";
import { checkSession } from "../services/apiServices";
import { LoaderActionTypes, LoaderContext } from "./Loader";

// types
type CredentialProviderProps = {
  children: React.ReactNode;
};

type CredentialContextType = {
  state: CredentialContextState;
  dispatch: React.Dispatch<CredentialActions>;
};

type CredentialContextState = {
  token: Token | null;
  session: Session | null;
  requestId: string;
  accountId: string;
  inquiryId: string;
  vehicleId: string;
  hasTokenExpired: boolean;
};

export type Token = {
  token: string;
  serverTime: number;
  expireTime: number;
};

export type Session = {
  sessionName: string;
  userId: string;
};

export enum CredentialTypes {
  UpdateToken = "UPDATE_TOKEN",
  UpdateSession = "UPDATE_SESSION",
  UpdateRequestId = "UPDATE_REQUEST_ID",
  UpdateCredential = "UPDATE_CREDENTIAL",
  ToggleTokenHasExpired = "TOGGLE_TOKEN_HAS_EXPIRED",
}

export type CredentialPayload = {
  [CredentialTypes.UpdateToken]: Token;
  [CredentialTypes.UpdateSession]: Session;
  [CredentialTypes.UpdateRequestId]: string;
  [CredentialTypes.UpdateCredential]: {
    values: Partial<CredentialContextState>;
  };
  [CredentialTypes.ToggleTokenHasExpired]: boolean;
};

export type CredentialActions =
  ActionMap<CredentialPayload>[keyof ActionMap<CredentialPayload>];

const initialState: CredentialContextState = {
  token: null,
  session: null,
  requestId: "",
  accountId: "",
  inquiryId: "",
  vehicleId: "",
  hasTokenExpired: false,
};

// context
export const CredentialContext = createContext<CredentialContextType>({
  state: initialState as CredentialContextState,
  dispatch: () => null,
});

// reducer
function credentialReducer(
  state: CredentialContextState,
  action: CredentialActions
) {
  const { type, payload } = action;
  switch (type) {
    // update token
    case CredentialTypes.UpdateToken: {
      return {
        ...state,
        token: payload,
      };
    }
    // update session
    case CredentialTypes.UpdateSession: {
      return {
        ...state,
        session: payload,
      };
    }
    // update request id
    case CredentialTypes.UpdateRequestId: {
      return {
        ...state,
        requestId: payload,
      };
    }
    // update credential
    case CredentialTypes.UpdateCredential: {
      return {
        ...state,
        ...payload.values,
      };
    }
    // toggle token has expired
    case CredentialTypes.ToggleTokenHasExpired: {
      return {
        ...state,
        hasTokenExpired: payload,
      };
    }
    default:
      return state;
  }
}

function CredentialProvider({ children }: CredentialProviderProps) {
  const [state, dispatch] = useReducer(credentialReducer, initialState);

  const { dispatch: loaderDispatch } = useContext(LoaderContext);

  const { token, session, hasTokenExpired } = state;

  async function generateNewTokenSession() {
    try {
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: true,
      });
      const response = await checkSession(token, session);

      dispatch({
        type: CredentialTypes.UpdateCredential,
        payload: {
          values: {
            token: response.token,
            session: response.session,
          },
        },
      });
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });
    } catch (err) {
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });
      console.log(err);
    }
  }

  function handleSetOpen(open: boolean) {
    dispatch({
      type: CredentialTypes.ToggleTokenHasExpired,
      payload: open,
    });
  }

  return (
    <CredentialContext.Provider value={{ state, dispatch }}>
      {hasTokenExpired && (
        <TokenExpiredWarningPopup
          open={hasTokenExpired}
          setOpen={handleSetOpen}
          handleOnConnect={generateNewTokenSession}
        />
      )}
      {children}
    </CredentialContext.Provider>
  );
}

type TokenExpiredWarningPopupProps = {
  open: boolean;
  setOpen: (val: boolean) => void;
  handleOnConnect: () => void;
};

function TokenExpiredWarningPopup({
  open,
  setOpen,
  handleOnConnect,
}: TokenExpiredWarningPopupProps) {
  const [timer, setTimer] = useState<number>(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    if (timer <= 0) {
      clearInterval(interval);
      setOpen(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  function closePopup() {
    setOpen(false);
  }

  function handleOnConnectButton() {
    handleOnConnect();
    closePopup();
  }

  return (
    <Popup open={open} closeOnDocumentClick={false} closeOnEscape={false}>
      <div className="fixed top-0 left-0 right-0 bottom-0 h-full w-full bg-gradient-to-tr from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-[20]F" />
      <div className="relative p-4 w-auto">
        <div className="relative min-w-[300px] max-w-lg h-auto bg-white rounded">
          <div className="relative px-4 py-2 flex flex-row items-center justify-start w-full h-auto border-b-2 border-solid border-b-[#c3c3c3]">
            {/* <button
              className="inline-block w-auto h-auto rounded"
              onClick={closePopup}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#6C6F75"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#6C6F75"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button> */}
            <h2 className="text-lg text-center text-primary-black font-medium">
              SESSION EXPIRED
            </h2>
          </div>
          <div className="relative py-4 px-6 w-full">
            <p className="text-left text-base text-primary-black font-medium">
              You session has expired due to inactivity. You will be redirect to
              homepage in {`${timer + (timer <= 1 ? " second" : " seconds")}`}.
              Click Stay Connect to continue your session.
            </p>
          </div>
          <div className="px-4 pt-2 pb-4 flex items-center justify-start w-full">
            <button
              onClick={handleOnConnectButton}
              className="inline-block px-4 py-2 text-sm text-center text-white bg-primary-blue font-medium rounded"
            >
              Stay Connect
            </button>
          </div>
        </div>
      </div>
    </Popup>
  );
}

export default CredentialProvider;
