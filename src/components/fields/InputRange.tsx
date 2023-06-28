import React from "react";
import { numberWithCommas } from "../container/VehicleCoverage";
import { AgreedVariantType } from "../../context/MarketAndAgreedContext";

type InputRangeProps = {
  value: number;
  minValue: AgreedVariantType | null;
  midValue: AgreedVariantType | null;
  maxValue: AgreedVariantType | null;
  setValue: (input: AgreedVariantType) => void;
};

const InputRange = ({
  value,
  setValue,
  minValue,
  midValue,
  maxValue,
}: InputRangeProps) => {
  function updateRange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    const numValue = Number(value);
    console.log(value)
    if (minValue) {
      if (numValue === parseInt(minValue.SumInsured)) {
        setValue(minValue);
      }
    }
    if (midValue) {
      if (numValue === parseInt(midValue.SumInsured)) {
        setValue(midValue);
      }
    }
    if (maxValue) {
      if (numValue === parseInt(maxValue.SumInsured)) {
        setValue(maxValue);
      }
    }
  }

  let steps = 0;
  let labelCount = 0;

  if (maxValue && minValue) {
    steps =
      (Number(maxValue.SumInsured) - Number(minValue.SumInsured)) /
      (midValue ? 2 : 1);
    labelCount =
      (value - Number(minValue.SumInsured)) /
      (midValue ? steps / 1 : steps / 2);
  } else if (minValue && midValue) {
    steps = Number(midValue.SumInsured) - Number(minValue.SumInsured);

  } else if (midValue && maxValue) {
    steps = (Number(maxValue.SumInsured) - Number(midValue.SumInsured)) / 2;
  }
  // console.log(labelCount, steps);

  // const labelPosition = `${((value - minValue) / 50) * 50}%`;

  return (
    <div className="mt-4 flex flex-col items-start w-full">
      <h2 className="mb-2 text-lg text-center text-primary-black font-bold">
        Choose your preferred sum insured
      </h2>
      <div className="relative pt-7 flex items-center justify-center w-full">
        <input
          type="range"
          name="value"
          value={value}
          // onChange={handleSliderChange}
          onChange={updateRange}
          id="insuredValue"
          {...(minValue && { min: Number(minValue.SumInsured) })}
          {...(maxValue && { max: Number(maxValue.SumInsured) })}
          {...(steps !== 0 && { step: steps })}
          className="peer w-full"
        />
        <label
          htmlFor="insuredValue"
          className={
            "absolute top-0 left-1/2 px-1.5 -translate-x-1/2 bg-[#888686] rounded z-[1]"
          }
          style={{ left: `${labelCount * 50}%` }}
        >
          <span className="text-sm text-center text-white font-medium whitespace-nowrap">
            RM {numberWithCommas(value)}
          </span>
        </label>
        {minValue && (
          <div className="absolute -bottom-6 left-0">
            {/* <span className="absolute -top-4 left-0 w-4 h-4 bg-primary-pink rounded-full" /> */}
            <span className="relative -left-6 text-sm text-center text-primary-black font-bold">
              RM {numberWithCommas(Number(minValue.SumInsured))}
            </span>
          </div>
        )}
        {maxValue && (
          <div className="absolute -bottom-6 right-0">
            <span className="relative -right-6 text-sm text-center text-primary-black font-bold">
              RM {numberWithCommas(Number(maxValue.SumInsured))}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InputRange;
