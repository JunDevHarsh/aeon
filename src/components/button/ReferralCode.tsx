import { ChangeEvent, useContext, useState } from "react";
import { useDispatch } from "react-redux";
import { addReferralCode } from "../../store/slices/user";
import { checkReferralCode } from "../../services/apiServices";
import { CredentialContext, CredentialTypes } from "../../context/Credential";
import { LoaderActionTypes, LoaderContext } from "../../context/Loader";
import { checkSession } from "../../services/apiServices";

type ReferralCodeStateType = {
  code: string;
  error: string | null;
  isValid: boolean;
};

const ReferralCodeButton = () => {
  const {
    state: { token, session },
    dispatch: credentialDispatch
  } = useContext(CredentialContext);

  const {
    state: { isLoading },
    dispatch: loaderDispatch,
  } = useContext(LoaderContext);

  const [state, setState] = useState<ReferralCodeStateType>({
    code: "",
    error: null,
    isValid: false,
  });

  const dispatch = useDispatch();

  const { code, error, isValid } = state;

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

      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: true,
      });

      let tokenInfo = token;
      let sessionInfo = session;
      
      if(!tokenInfo || !sessionInfo) {
        const reponse: any = await checkSession(tokenInfo, sessionInfo);

        credentialDispatch({
          type: CredentialTypes.UpdateCredential,
          payload: {
            values: {
              token: reponse.token,
              session: reponse.session,
            },
          },
        });

        tokenInfo = reponse.token;
        sessionInfo = reponse.session;
      }

      if (sessionInfo) {
        const apiResponse = await checkReferralCode(
          sessionInfo.sessionName,
          code
        );

        if (apiResponse.isValid === 1) {

          setState((prev) => ({
            ...prev,
            error: null,
            isValid: true,
          }));

          dispatch(addReferralCode(code));

          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });

          return;
        }

        setState((prev) => ({
          ...prev,
          error: "Invalid Referral Code",
          isValid: false,
        }));

        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: false,
        });
      }
    } catch (error) {
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });
      
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
              className="px-4 py-1.5 text-sm text-center text-white bg-gray-400 font-medium"
            >
              {isLoading ? "Apply" : "Applied"}
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
