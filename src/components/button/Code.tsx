import React, { ChangeEvent, useState } from "react";

type CodeProps = {
  title: string;
  placeholder?: string;
  maxLength?: number;
  validationList: Array<string>;
  updateCode?: React.Dispatch<React.SetStateAction<any>>;
};

const Code: React.FC<CodeProps> = ({
  title,
  placeholder = "Placeholder",
  maxLength = 10,
  validationList,
  updateCode,
}) => {
  const [code, setCode] = useState<string>("");
  const [state, setState] = useState<{
    error: string | null;
    isValid: boolean;
  }>({
    error: null,
    isValid: false,
  });

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    if (value.length > maxLength) return;
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }
    setCode(value);
  }

  function handleOnClick() {
    if (code === "") {
      setState((prev) => ({ ...prev, error: "Enter a code" }));
      return;
    }
    const checkValidation = validationList.find((item) => item === code);
    if (!checkValidation) {
      setState((prev) => ({ ...prev, error: "Invalid Promo Code" }));
      return;
    }
    if (updateCode) {
      updateCode(10);
    }
    setState((prev) => ({ ...prev, error: null, isValid: true }));
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
            disabled={state.isValid}
            aria-disabled={state.isValid}
            placeholder={placeholder}
            maxLength={maxLength}
            className={`pt-2 pb-1 px-2 w-full text-sm text-left text-primary-black border border-solid ${
              state.error
                ? "border-red-600 placeholder:text-red-600"
                : "border-[#CFD0D7] placeholder:text-[#9ca9b9]"
            }`}
          />
          <button
            type="button"
            onClick={handleOnClick}
            className={`px-4 py-1.5 text-sm text-center text-white ${
              state.isValid ? "bg-gray-400" : "bg-[#4B5EAA]"
            } font-semibold`}
          >
            Apply
          </button>
        </div>
        {state.error && (
          <span
            className="absolute bottom-0 left-0 px-4 text-sm text-left font-medium text-red-600"
            role="alert"
          >
            {state.error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Code;
