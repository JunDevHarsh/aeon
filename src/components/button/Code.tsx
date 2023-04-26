import React, { ChangeEvent, useState } from "react";

type CodeProps = {
  title: string;
  textToDisplay: string;
  placeholder?: string;
  maxLength?: number;
};

const Code: React.FC<CodeProps> = ({
  title,
  textToDisplay,
  placeholder = "Placeholder",
  maxLength = 10,
}) => {
  const [code, setCode] = useState<string>("");
  const [showButton, setShowButton] = useState<boolean>(false);
  function toggleShowButton() {
    setShowButton(!showButton);
  }

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    if (value.length > maxLength) return;
    setCode(value);
  }

  return (
    <div className="flex items-center justify-start max-w-[365px] w-full h-auto">
      {showButton ? (
        <div className="px-2.5 pt-1.5 pb-4 flex flex-col items-start justify-center gap-y-2 w-full h-auto bg-[#EEF4FF] rounded">
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
              placeholder={placeholder}
              maxLength={maxLength}
              className="py-1.5 px-2 w-full text-sm text-left text-primary-black border border-solid border-[#CFD0D7]"
            />
            <button
              type="button"
              className="px-4 py-1.5 text-sm text-center text-white bg-[#4B5EAA] font-semibold"
            >
              Apply
            </button>
          </div>
        </div>
      ) : (
        <div className="relative py-6 block w-full">
          <button
            type="button"
            className="text-base text-center text-primary-pink font-medium"
            onClick={toggleShowButton}
          >
            {textToDisplay}
          </button>
        </div>
      )}
    </div>
  );
};

export default Code;
