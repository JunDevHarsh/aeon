import React, { useState } from "react";

type AddOnProps = {
  id: string;
  title: string;
  defaultValue?: string;
  closeAddOnPopup: () => void;
  updateAddOnPrice: (id: string, price: string) => void;
  toggleAddOnsById: (id: string) => void;
};

const AddOnPopup = ({
  id,
  title,
  defaultValue,
  toggleAddOnsById,
  closeAddOnPopup,
  updateAddOnPrice,
}: AddOnProps) => {
  const [value, setValue] = useState<string>(defaultValue ?? "");
  // const hasError = Number(value) < Number(defaultValue);

  function handleOnSubmit(id: string, price: string) {
    if (value === "") return;
    updateAddOnPrice(id, price);
  }

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-[20]">
      <div className="relative flex items-center justify-center h-screen w-screen">
        <div className="relative max-w-[412px] bg-white w-full rounded">
          <div className="relative px-6 pt-4 pb-6 flex flex-col items-center w-full border-b border-solid border-gray-300">
            <div className="mb-6 flex items-center justify-between w-full">
              <h3 className="text-base text-center text-primary-black font-bold">
                Sum insured for {title}
              </h3>
              <button
                className="inline-block w-auto h-auto"
                onClick={closeAddOnPopup}
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
              </button>
            </div>
            <input
              type="text"
              value={value}
              autoFocus
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                let { value } = event.currentTarget;
                value = value.replace(/\D/g, "");
                return setValue(value);
              }}
              placeholder="Placeholder"
              className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink border-[#CFD0D7] focus-visible:border-primary-pink"
            />
            {Number(value) === 0 && (
              <span
                role="alert"
                className="absolute bottom-0.5 left-0 px-6 text-sm text-left font-medium text-[#e57398]"
              >
                Sum insured value should be or more than RM 0
              </span>
            )}
          </div>
          <div
            className="px-6 py-3 flex items-center justify-end w-full"
            onClick={() => {
              toggleAddOnsById(id);
              handleOnSubmit(id, value);
            }}
          >
            <button className="relative py-1 px-2 w-auto h-auto bg-primary-blue rounded-lg">
              <span className="text-sm text-center text-white font-medium">
                Submit
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddOnPopup;
