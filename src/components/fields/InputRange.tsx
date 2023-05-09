import React from "react";
import { numberWithCommas } from "../../pages/PolicyCoverage";

const InputRange = ({
  type,
  value,
  setValue,
  minValue,
  maxValue,
}: {
  type: "market" | "agreed";
  value: number;
  setValue: (type: "market" | "agreed", value: number) => void;
  minValue: number;
  maxValue: number;
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(type, parseInt(e.target.value));
  };

  const labelPosition = `${(
    ((value - minValue) / (maxValue - minValue)) *
    100
  ).toFixed(2)}%`;

  return (
    <div className="mt-4 flex flex-col items-start w-full">
      <h2 className="mb-2 text-base text-center text-primary-black font-bold">
        Choose your preferred sum insured
      </h2>
      <div className="relative pt-7 flex items-center justify-center w-full">
        <input
          type="range"
          name="value"
          value={value}
          onChange={handleSliderChange}
          id="insuredValue"
          min={minValue}
          max={maxValue}
          step={maxValue - minValue}
          className="peer w-full"
        />
        <label
          htmlFor="insuredValue"
          className={
            "absolute top-0 left-1/2 px-1.5 -translate-x-1/2 bg-[#888686] rounded z-[1]"
          }
          style={{ left: labelPosition }}
        >
          <span className="text-sm text-center text-white font-medium whitespace-nowrap">
            RM {numberWithCommas(value)}
          </span>
        </label>
        <div className="absolute -bottom-6 -left-6">
          <span className="text-sm text-center text-primary-black font-bold">
            RM {numberWithCommas(minValue)}
          </span>
        </div>
        <div className="absolute -bottom-6 -right-6">
          <span className="text-sm text-center text-primary-black font-bold">
            RM {numberWithCommas(maxValue)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default InputRange;
