import { useId, useState } from "react";
import { numberWithCommas } from "../container/VehicleCoverage";
import AddOnInputPopup from "../popup/AddOnInput";
import { MoreDetail } from "../../context/AddOnsContext";

interface AddOnsCardProps {
  id: string;
  title: string;
  isSelected: boolean;
  description: string;
  customImgName: string;
  requiredinfo: "0" | "1";
  sumInsured: number;
  moredetail?: MoreDetail;
  updateAddOn: (
    id: string,
    isSelected: boolean,
    coverSumInsured: number
  ) => void;
}

const AddOnsCard: React.FC<AddOnsCardProps> = ({
  id,
  title,
  isSelected,
  description,
  customImgName,
  sumInsured,
  moredetail,
  requiredinfo,
  updateAddOn,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const uid = useId();

  function handleAddOnChange(coverCode: string) {
    if (requiredinfo === "0") {
      updateAddOn(coverCode, isSelected, sumInsured);
      return;
    }
    if (!isSelected) {
      setOpen(true);
      return;
    }
    updateAddOn(coverCode, isSelected, sumInsured);
  }

  function handleOnSave(val: string) {
    updateAddOn(id, false, Number(val));
  }

  return (
    <>
      {open && moredetail && (
        <AddOnInputPopup
          open={open}
          submitValue={handleOnSave}
          setOpen={setOpen}
          initialvalue={sumInsured.toString()}
          moredetail={moredetail}
        />
      )}
      <div className="relative w-full min-h-[184px] h-full">
        <input
          type="checkbox"
          name="addOns"
          id={uid}
          className="peer/checkbox absolute top-0 left-0 -z-10 opacity-0"
          checked={isSelected}
          onChange={() => {
            handleAddOnChange(id);
          }}
        />
        <label
          htmlFor={uid}
          className={`p-2 flex flex-col items-center justify-center h-full border border-solid ${
            isSelected
              ? "border-transparent shadow-add-selected"
              : "border-[#bcbcbc] shadow-none"
          } rounded-lg cursor-pointer outline outline-2 outline-transparent peer-focus-visible/checkbox:outline-primary-black`}
        >
          <div className="group/info absolute top-1 right-2 h-4 w-4 cursor-pointer">
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.43734 13.1667H9.68734V8.16669H8.43734V13.1667ZM8.99984 6.62502C9.19428 6.62502 9.35748 6.56252 9.48942 6.43752C9.62136 6.31252 9.68734 6.1528 9.68734 5.95835C9.68734 5.76391 9.62136 5.59724 9.48942 5.45835C9.35748 5.31946 9.19428 5.25002 8.99984 5.25002C8.80539 5.25002 8.6422 5.31946 8.51025 5.45835C8.37831 5.59724 8.31234 5.76391 8.31234 5.95835C8.31234 6.1528 8.37831 6.31252 8.51025 6.43752C8.6422 6.56252 8.80539 6.62502 8.99984 6.62502ZM8.99984 17.3334C7.86095 17.3334 6.78456 17.1146 5.77067 16.6771C4.75678 16.2396 3.87137 15.6424 3.11442 14.8854C2.35748 14.1285 1.76025 13.2431 1.32275 12.2292C0.885254 11.2153 0.666504 10.132 0.666504 8.97919C0.666504 7.8403 0.885254 6.76391 1.32275 5.75002C1.76025 4.73613 2.35748 3.85419 3.11442 3.10419C3.87137 2.35419 4.75678 1.76044 5.77067 1.32294C6.78456 0.885437 7.86789 0.666687 9.02067 0.666687C10.1596 0.666687 11.2359 0.885437 12.2498 1.32294C13.2637 1.76044 14.1457 2.35419 14.8957 3.10419C15.6457 3.85419 16.2394 4.73613 16.6769 5.75002C17.1144 6.76391 17.3332 7.84724 17.3332 9.00002C17.3332 10.1389 17.1144 11.2153 16.6769 12.2292C16.2394 13.2431 15.6457 14.1285 14.8957 14.8854C14.1457 15.6424 13.2637 16.2396 12.2498 16.6771C11.2359 17.1146 10.1526 17.3334 8.99984 17.3334Z"
                fill="#959698"
              />
            </svg>
            <div className="group-hover/info:inline-block hidden absolute top-[calc(100%+14px)] left-2 -translate-x-1/2 p-2 min-w-[250px] max-w-[250px] w-auto bg-[#959698] rounded-xl z-[2]">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 inline-block w-4 h-4 bg-[#959698] rotate-45" />
              <p className="text-xs text-center text-white font-normal">
                {description}
              </p>
            </div>
          </div>
          <div className="w-auto h-auto">
            {/* <ImageToDisplay pathColor={isSelected ? "#4B5EAA" : "#BCBCBC"} /> */}
            <img
              src={customImgName}
              alt="addon-img"
              className="max-w-[100px] w-full h-auto"
            />
          </div>
          <p className="text-base text-center text-primary-black font-bold">
            {title}
          </p>
          {isSelected && sumInsured !== 0 && (
            <>
              <div className="block my-1.5 h-[2px] w-2/3 bg-[#D9D9D9]" />
              <div className="flex items-center justify-center  w-full">
                <span className="mr-2 text-sm text-center text-primary-black font-medium">
                  Sum Insured
                </span>
                {requiredinfo === "1" ? (
                  <button
                    className="flex items-center justify-center w-auto"
                    onClick={() => setOpen(true)}
                  >
                    <span className="text-sm text-center text-primary-black font-normal">
                      RM {numberWithCommas(sumInsured)}
                    </span>
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1"
                    >
                      <path
                        d="M11.4176 3.62363L9.40265 1.60869L10.0439 0.963642C10.2285 0.77909 10.458 0.688793 10.7323 0.692752C11.0066 0.69671 11.2398 0.792215 11.4319 0.979267L12.0664 1.61003C12.2584 1.79957 12.3513 2.02954 12.3451 2.29992C12.3388 2.5703 12.2435 2.79777 12.0589 2.98233L11.4176 3.62363ZM10.7651 4.27614L2.8714 12.1698H0.856445V10.1549L8.7464 2.26494L10.7651 4.27614Z"
                        fill="#A5308A"
                      />
                    </svg>
                  </button>
                ) : (
                  <span className="text-sm text-center text-primary-black font-normal">
                    RM {numberWithCommas(sumInsured)}
                  </span>
                )}
              </div>
            </>
          )}
        </label>
      </div>
    </>
  );
};

export default AddOnsCard;
