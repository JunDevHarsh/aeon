import React from "react";
import Popup from "reactjs-popup";

type AddOnDriverWarningProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  updateAddOnDriver: (val: string, isSelected: boolean) => void;
};

function AddOnDriverWarning({ open, setOpen, updateAddOnDriver}: AddOnDriverWarningProps) {
  function closePopup() {
    setOpen(false);
  }

  function handleOnSave() {
    updateAddOnDriver("unlimited", false);
    closePopup();
  }

  return (
    <Popup open={open} closeOnEscape onClose={closePopup}>
      <div
        onClick={closePopup}
        className="fixed top-0 left-0 right-0 bottom-0 h-full w-full bg-gradient-to-tr from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-[20]F"
      />
      <div className="relative min-w-[300px] max-w-lg h-auto bg-white rounded">
        <div className="relative px-4 py-2 flex flex-row items-center justify-end w-full h-auto border-b-2 border-solid border-b-[#c3c3c3]">
          <button
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
          </button>
        </div>
        <div className="relative px-4 pt-4 pb-6 w-full">
          <h2 className="text-lg text-left text-primary-black font-medium">
            At maximum number of named drivers
          </h2>
          <p className="mt-4 text-left text-base text-primary-black font-medium">
            Would you like to get coverage for unlimited drivers instead?
          </p>
          <div className="flex items-center justify-end w-full">
            <button
              onClick={handleOnSave}
              className="inline-block px-4 py-2 text-sm text-center text-white bg-primary-blue font-medium rounded"
            >
              Save
            </button>
            <button
              onClick={closePopup}
              className="inline-block ml-2 px-4 py-2 text-sm text-center text-white bg-primary-blue font-medium rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
      AddOnDriverWarning
    </Popup>
  );
}

export default AddOnDriverWarning;
