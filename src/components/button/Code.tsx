import React, { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  checkPromoCode,
  checkTokenIsExpired,
  generateSessionName,
  generateToken,
} from "../../utils/helpers";
import {
  SessionType,
  TokenType,
  addSessionName,
  addToken,
} from "../../store/slices/credentials";

type CodeProps = {
  title: string;
  placeholder?: string;
  validationList: Array<string>;
  updateCode?: React.Dispatch<React.SetStateAction<any>>;
};

const Code: React.FC<CodeProps> = ({
  title,
  placeholder = "Placeholder",
  // updateCode,
}) => {
  const [state, setState] = useState<{
    code: string;
    error: string | null;
    isValid: boolean;
    isLoading: boolean;
  }>({
    code: "",
    error: null,
    isValid: false,
    isLoading: false,
  });

  const { token, session, requestId } = useSelector(
    (state: RootState) => state.credentials
  );

  const dispatch = useDispatch();

  const { code, error, isLoading, isValid } = state;

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    if (value.length > 15) return;
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }
    setState((prev) => ({ ...prev, code: value }));
  }

  async function handleOnClick() {
    try {
      if (code === "") {
        setState((prev) => ({ ...prev, error: "Enter a code" }));
        return;
      }
      setState((prev) => ({ ...prev, isLoading: true }));
      let tokenInfo = token;
      let sessionInfo = session;

      if (
        tokenInfo === null ||
        sessionInfo === null ||
        checkTokenIsExpired(tokenInfo)
      ) {
        const getToken: TokenType = await generateToken(
          "https://app.agiliux.com/aeon/webservice.php?operation=getchallenge&username=admin",
          10000
        );
        tokenInfo = getToken;
        dispatch(addToken({ ...getToken }));
        const sessionApiResponse: SessionType = await generateSessionName(
          "https://app.agiliux.com/aeon/webservice.php",
          10000,
          tokenInfo.token,
          "bwJrIhxPdfsdialE"
        );
        sessionInfo = sessionApiResponse;
        // update credentials context with new token and session
        dispatch(
          addSessionName({
            userId: sessionApiResponse.userId,
            sessionName: sessionApiResponse.sessionName,
          })
        );
      }

      const apiResponse = await checkPromoCode(
        "https://app.agiliux.com/aeon/webservice.php",
        10000,
        sessionInfo.sessionName,
        requestId,
        code
      );
      if (apiResponse.isValid === 1) {
        setState((prev) => ({
          ...prev,
          error: null,
          isValid: true,
          isLoading: false,
        }));
        return;
      }
      setState((prev) => ({
        ...prev,
        error: apiResponse.message,
        isValid: false,
        isLoading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Something went wrong",
      }));
      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-start max-w-[365px] w-full h-auto">
      <div className="relative px-2.5 pt-1.5 pb-6 flex flex-col items-start justify-center gap-y-2 w-full h-auto bg-[#EEF4FF] rounded">
        <label
          htmlFor="code"
          className="text-base text-center text-primary-black font-semibold"
        >
          {title}
        </label>
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            id="code"
            value={code}
            onChange={handleOnChange}
            disabled={isValid}
            aria-disabled={isValid}
            placeholder={placeholder}
            className={`pt-2 pb-1 px-2 w-full text-sm text-left text-primary-black border border-solid ${
              error
                ? "border-red-600 placeholder:text-red-600"
                : "border-[#CFD0D7] placeholder:text-[#9ca9b9]"
            }`}
          />
          {isLoading || isValid ? (
            <div
              className={`${
                isLoading ? "animate-pulse bg-[#4B5EAA]" : "bg-gray-400"
              } px-4 py-1.5 text-sm text-center text-white font-semibold`}
            >
              {isLoading ? "Loading..." : "Applied"}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOnClick}
              className={`px-4 py-1.5 text-sm text-center text-white ${
                isValid ? "bg-gray-400" : "bg-[#4B5EAA]"
              } font-semibold`}
            >
              Apply
            </button>
          )}
        </div>
        {error && (
          <span
            className="absolute bottom-0 left-0 px-4 text-sm text-left font-medium text-red-600"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Code;
