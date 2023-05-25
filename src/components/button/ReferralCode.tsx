import React, { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { updateReferralCode } from "../../store/slices/insurance";

type CodeProps = {
  validationList: Array<string>;
};

type ReferralCodeStateType = {
  code: string;
  error: string | null;
  isValid: boolean;
};

const ReferralCodeButton: React.FC<CodeProps> = ({ validationList }) => {
  const [state, setState] = useState<ReferralCodeStateType>({
    code: "",
    error: null,
    isValid: false,
  });
  const dispatch = useDispatch();

  const { code, error, isValid } = state;

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    if (value.length > 10) return;
    if (error) {
      setState((prev) => ({ ...prev, error: null }));
    }
    setState((prev) => ({ ...prev, code: value }));
  }

  function handleOnClick() {
    if (code === "") {
      setState((prev) => ({ ...prev, error: "Enter a code" }));
      return;
    }
    const checkValidation = validationList.find((item) => item === code);
    if (!checkValidation) {
      setState((prev) => ({
        ...prev,
        error: "Invalid Referral Code",
        isValid: false,
      }));
      return;
    }
    dispatch(updateReferralCode(code));
    setState((prev) => ({ ...prev, error: null, isValid: true }));
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
            placeholder=""
            maxLength={10}
            className={`pt-2 pb-1 px-2 w-full text-sm text-left text-primary-black border border-solid ${
              error
                ? "border-red-600 placeholder:text-red-600"
                : "border-[#CFD0D7] placeholder:text-[#9ca9b9]"
            }`}
          />
          <button
            type="button"
            onClick={handleOnClick}
            className={`px-4 py-1.5 text-sm text-center text-white ${
              isValid ? "bg-gray-400" : "bg-[#4B5EAA]"
            } font-semibold`}
          >
            Apply
          </button>
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
