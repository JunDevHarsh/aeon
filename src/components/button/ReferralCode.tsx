import { ChangeEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addReferralCode } from "../../store/slices/user";
import { RootState } from "../../store/store";
import {
  checkReferralCode,
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

type ReferralCodeStateType = {
  code: string;
  error: string | null;
  isValid: boolean;
  isLoading: boolean;
};

const ReferralCodeButton = () => {
  const { token, session } = useSelector(
    (state: RootState) => state.credentials
  );
  const [state, setState] = useState<ReferralCodeStateType>({
    code: "",
    error: null,
    isValid: false,
    isLoading: false,
  });
  const dispatch = useDispatch();

  const { code, error, isValid, isLoading } = state;

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    if (value.length > 15) return;
    if (error) {
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

      if (tokenInfo === null || checkTokenIsExpired(tokenInfo)) {
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

      if (sessionInfo) {
        const apiResponse = await checkReferralCode(
          "https://app.agiliux.com/aeon/webservice.php",
          10000,
          sessionInfo.sessionName,
          code
        );
        if (apiResponse.isValid === 1) {
          setState((prev) => ({
            ...prev,
            error: null,
            isValid: true,
            isLoading: false,
          }));
          dispatch(addReferralCode(code));
          // dispatch((prev) => ({ ...prev, referralCode: code }));
          return;
        }
        setState((prev) => ({
          ...prev,
          error: apiResponse.message,
          isValid: false,
          isLoading: false,
        }));
      }
    } catch (error) {
      setState((prev) => ({ ...prev, isLoading: false }));
      console.log(error);
      setState((prev) => ({ ...prev, error: "Something went wrong" }));
    }
  }

  return (
    <div className="flex items-center justify-start max-w-[365px] w-full h-auto">
      <div className="relative px-2.5 pt-1.5 pb-6 flex flex-col items-start justify-center gap-y-2 w-full h-auto bg-[#EEF4FF] rounded">
        <label
          htmlFor="referralCode"
          className="text-base text-center text-primary-black font-semibold"
        >
          Referral Code
        </label>
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            id="referralCode"
            value={code}
            onChange={handleOnChange}
            disabled={isValid}
            aria-disabled={isValid}
            placeholder="HG23434"
            maxLength={15}
            className={`pt-2 pb-1 px-2 w-full text-sm text-left text-primary-black border border-solid ${
              error
                ? "border-red-600 placeholder:text-red-600"
                : "border-[#CFD0D7] placeholder:text-[#9ca9b9]"
            }`}
          />
          {isLoading || isValid ? (
            <div
              className={`${
                isLoading ? "animate-pulse" : ""
              } px-4 py-1.5 text-sm text-center text-white bg-gray-400 font-medium`}
            >
              {isLoading ? "Loading" : "Applied"}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOnClick}
              className="px-4 py-1.5 text-sm text-center text-white bg-[#4B5EAA] font-medium"
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

export default ReferralCodeButton;
