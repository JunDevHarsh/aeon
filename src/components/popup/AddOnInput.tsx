import { useState } from "react";
import Popup from "reactjs-popup";
import { MoreDetail } from "../../context/AddOnsContext";
import SelectDropdown from "../fields/SelectDropdown";

type AddOnInputProps = {
  open: boolean;
  initialvalue: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moredetail: MoreDetail;
  submitValue: (val: string) => void;
};

function AddOnInputPopup({
  open,
  setOpen,
  moredetail,
  initialvalue,
  submitValue,
}: AddOnInputProps) {
  const [state, setState] = useState<{
    value: string;
    error: string | null;
  }>({
    value: initialvalue,
    error: null,
  });

  const { question, fieldtype, options } = moredetail;
  const { error, value } = state;

  function handleTextOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    let { value } = e.target;
    value = value.replace(/\D/g, "");
    const numberValue = Number(value);
    if (numberValue < 500) {
      setState({
        error: "Minimum value should be 500",
        value: value,
      });
      return;
    }
    setState({
      error: null,
      value: value,
    });
  }

  function handleSelectOnChange(val: string) {
    setState({
      error: null,
      value: val,
    });
  }

  function handleOnSave() {
    if (error) return;
    if (!value || value === "0") {
      setState({
        error: "Select an option from the dropdown",
        value: value,
      });
      return;
    }
    submitValue(value);
    closePopup();
  }

  function handleOnCancel() {
    setState({
      error: null,
      value: initialvalue,
    });
    closePopup();
  }

  function closePopup() {
    setOpen(false);
  }

  return (
    <Popup open={open} closeOnEscape onClose={closePopup}>
      <div
        onClick={closePopup}
        className="fixed top-0 left-0 right-0 bottom-0 h-full w-full bg-gradient-to-tr from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-[20]F"
      />
      <div className="relative min-w-[300px] h-auto bg-white rounded">
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
          <div className="relative inline-block w-full">
            <h3 className="text-lg text-left text-primary-black font-medium">
              {question}
            </h3>
            <div className="relative mt-2 w-full">
              {fieldtype === "Text Box" ? (
                <>
                  <div className="relative w-full">
                    <span className="absolute top-[2px] left-[2px] px-2 h-[calc(100%-4px)] flex items-center justify-center w-auto bg-[#f6f6f6] rounded-tl-[3px] rounded-bl-[3px]">
                      <span className="text-sm text-center text-primary-black font-medium">
                        RM
                      </span>
                    </span>
                    <input
                      type="text"
                      name="inputText"
                      className="inline-bloc pl-12 pr-2 py-0.5 w-full text-left text-base text-primary-black font-medium border border-solid border-[#c3c3c3] rounded"
                      value={value}
                      onChange={handleTextOnChange}
                    />
                  </div>
                  <span className="relative text-sm text-left font-medium text-primary-black">
                    Minimum sum insured is RM 500
                  </span>
                </>
              ) : (
                <SelectDropdown
                  id=""
                  onChange={handleSelectOnChange}
                  optionList={
                    options instanceof Array
                      ? options.map(({ value, label }) => ({
                          label,
                          value,
                        }))
                      : []
                  }
                  selected={value}
                />
              )}
            </div>
            {error && (
              <span
                className="relative text-sm text-left font-medium text-red-600"
                role="alert"
              >
                {error}
              </span>
            )}
          </div>
        </div>
        <div className="px-4 py-2 flex items-center justify-end w-full">
          <button
            onClick={handleOnSave}
            className="inline-block px-4 py-2 text-sm text-center text-white bg-primary-blue font-medium rounded"
          >
            Save
          </button>
          <button
            onClick={handleOnCancel}
            className="inline-block ml-2 px-4 py-2 text-sm text-center text-white bg-primary-blue font-medium rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </Popup>
  );
}

export default AddOnInputPopup;
