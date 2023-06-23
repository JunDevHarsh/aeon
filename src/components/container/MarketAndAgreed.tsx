import { useContext } from "react";
import { numberWithCommas } from "./VehicleCoverage";
import {
  AgreedVariantType,
  MarketAndAgreedContext,
  UpdateValuation,
} from "../../context/MarketAndAgreedContext";
import SelectDropdown from "../fields/SelectDropdown";
import InputRange from "../fields/InputRange";
import { Link } from "react-router-dom";

function o(types: AgreedVariantType[]) {
  const regEx = /(-HIGH|-LOW|-HI|-LO)\s*-?\s*/;
  return types.reduce((acc: any, curr: any) => {
    const { AvCode, Variant } = curr;
    const key = AvCode.replace(regEx, "");
    if (!acc[key]) {
      acc[key] = {
        AvCode: AvCode,
        SumInsured: curr.SumInsured,
        Variant: Variant.replace(regEx, ""),
        VehicleEngineCC: curr.VehicleEngineCC,
        MakeYear: curr.MakeYear,
      };
    }
    if (key === AvCode) {
      acc[key] = {
        ...acc[key],
        AvCode: key,
        SumInsured: curr.SumInsured,
      };
    }
    return acc;
  }, {});
}

// function check(listOfAgreed: AgreedVariantType[]) {
//   // const regEx = /(-HIGH|-LOW|-HI|-LO)\s*-?\s*/;

//   const listOfAgreedVariants = listOfAgreed.filter((currAgreedVariant) => {
//     const { AvCode } = currAgreedVariant;

//     if (!AvCode.includes("-LO") && !AvCode.includes("-HI")) {
//       return true;
//     }
//   });
//   return listOfAgreedVariants;
// }

function MarketAndAgreedContainer() {
  const {
    state: { type, market, agreed, variants, types, previousValue },
    dispatch,
  } = useContext(MarketAndAgreedContext);

  const marketVariantOptionList = variants.map(({ nvic, vehicleVariant }) => ({
    label: vehicleVariant,
    value: nvic,
  }));

  // const listOfAgreedVariants = check(types);
  const listOfAgreedVariants: AgreedVariantType[] = Object.values(o(types));

  const agreedVariantOptionList = listOfAgreedVariants.map(
    ({ AvCode, Variant }) => ({
      label: "TOYOTA COROLLA | " + Variant,
      value: AvCode,
    })
  );

  const minAgreedValue = types.find(
    ({ AvCode }) =>
      AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") ===
        agreed?.avCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") &&
      AvCode.includes("-LO")
  );

  const midAgreedValue = types.find(
    ({ AvCode }) =>
      AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") ===
        agreed?.avCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") &&
      !/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/.test(AvCode)
  );

  const maxAgreedValue = types.find(
    ({ AvCode }) =>
      AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") ===
        agreed?.avCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") &&
      AvCode.includes("-HI")
  );

  function handleTypeChange(val: "agreed" | "market") {
    dispatch({ type: UpdateValuation.UpdateType, payload: { type: val } });
  }

  function handleAgreedTypeChange(val: string) {
    const selectedType = types.find((type) => type.AvCode === val);
    if (!selectedType) return;
    const { AvCode, SumInsured, Variant } = selectedType;
    dispatch({
      type: UpdateValuation.UpdateAgreedType,
      payload: {
        avCode: AvCode,
        sumInsured: SumInsured,
        type: Variant,
      },
    });
  }

  function changeVariant(val: string, type: "agreed" | "market") {
    const selectedVariant = variants.find((variant) => variant.nvic === val);
    if (!selectedVariant) return;
    const { nvic, vehicleMarketValue, vehicleVariant } = selectedVariant;
    dispatch({
      type: UpdateValuation.UpdateVariant,
      payload: {
        nvic: nvic,
        marketValue: vehicleMarketValue,
        variant: vehicleVariant,
        variantType: type === "market" ? "market" : "agreed",
      },
    });
  }

  return (
    <div className="relative py-10 px-4 flex items-center justify-center w-full">
      <div className="relative py-10 px-10 mx-auto flex flex-col md:flex-row items-center md:items-start justify-center max-w-lg md:max-w-5xl w-full bg-white rounded-xl shadow-container">
        <div className="flex flex-col items-start max-w-md w-full">
          <div className="p-2 flex items-center justify-start w-auto bg-[#FDC9F1] rounded-lg">
            <svg
              width="24"
              height="22"
              viewBox="0 0 24 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.59026 21.6911L6.65438 18.3814L2.80763 17.5885L3.24458 13.8477L0.802734 10.9999L3.24458 8.17707L2.80763 4.43032L6.65438 3.64337L8.59026 0.308594L12 1.88249L15.4158 0.308594L17.3707 3.64337L21.1924 4.43032L20.7555 8.17707L23.1973 10.9999L20.7555 13.8477L21.1924 17.5885L17.3707 18.3814L15.4158 21.6911L12 20.1173L8.59026 21.6911ZM10.925 14.3727L16.6479 8.69989L15.4691 7.62707L10.925 12.1271L8.55601 9.64609L7.35221 10.8249L10.925 14.3727Z"
                fill="#A5308A"
              />
            </svg>
            {/* will be fixed for first time */}
            <p className="text-sm text-center text-primary-pink font-bold">
              The Current market value for your vehicle is RM{" "}
              {numberWithCommas(Number(previousValue))}
            </p>
          </div>
          <div className="mt-4 flex flex-col items-start w-full">
            <h2 className="text-base text-center text-primary-black font-bold">
              Select your preferred coverage type
            </h2>
            <div className="mt-2 flex flex-col mobile-l:flex-row items-center justify-start w-full">
              <ValuationTypeButton
                value="market"
                title="Market Value"
                selectedValue={type}
                price={market?.marketValue.toString() || ""}
                updateValue={handleTypeChange}
              />
              <ValuationTypeButton
                selectedValue={type}
                title="Agreed Value"
                value="agreed"
                price={agreed ? agreed.sumInsured : ""}
                updateValue={handleTypeChange}
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start w-full">
            <h2 className="mb-2 text-base text-center text-primary-black font-bold">
              Select your car variant to estimate its value
            </h2>
            {type === "market" ? (
              <SelectDropdown
                id="asdf"
                optionList={marketVariantOptionList}
                onChange={(val: string) => changeVariant(val, "market")}
                selected={market ? market.nvic : null}
              />
            ) : (
              <>
                <div className="flex flex-col items-start w-full">
                  <div className="relative pb-4 flex flex-col items-start w-full h-auto">
                    <span className="mb-2 text-lg text-center text-primary-black font-semibold">
                      Car Type
                    </span>
                    <SelectDropdown
                      id="asda"
                      selected={
                        agreed
                          ? agreed.avCode.replace(
                              /(-HIGH|-LOW|-HI|-LO)\s*-?\s*/,
                              ""
                            )
                          : null
                      }
                      optionList={agreedVariantOptionList}
                      onChange={(val: string) => handleAgreedTypeChange(val)}
                    />
                  </div>
                  <div className="relative pb-4 flex flex-col items-start w-full h-auto">
                    <span className="mb-2 text-lg text-center text-primary-black font-semibold">
                      Car Variant
                    </span>
                    <SelectDropdown
                      id="asd"
                      selected={agreed?.nvic ? agreed.nvic : null}
                      optionList={marketVariantOptionList}
                      onChange={(val: string) => changeVariant(val, "agreed")}
                    />
                  </div>
                </div>
                {agreed && agreed.avCode !== "" && (
                  <InputRange
                    value={Number(agreed.sumInsured)}
                    minValue={minAgreedValue || null}
                    midValue={midAgreedValue || null}
                    maxValue={maxAgreedValue || null}
                    setValue={({
                      AvCode: avCode,
                      SumInsured: sumInsured,
                      Variant: type,
                    }: AgreedVariantType) => {
                      dispatch({
                        type: UpdateValuation.UpdateAgreedType,
                        payload: {
                          avCode,
                          sumInsured,
                          type,
                        },
                      });
                    }}
                  />
                )}
              </>
            )}
            <div className="mt-4 flex items-center justify-start gap-x-2 w-full">
              <Link
                to="/insurance/plan-add-ons"
                className="relative mt-4 py-2.5 px-8 flex items-center justify-center w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
              >
                <span className="text-base text-center font-medium text-white">
                  Submit
                </span>
              </Link>
            </div>
          </div>
        </div>
        {/* Description */}
        <div className="ml-0 md:ml-8 mt-8 md:mt-0 relative max-w-sm w-full bg-[#F8F8F8] rounded-lg overflow-hidden shadow-container">
          <div className="py-2 flex items-center justify-center w-full bg-[#283CC6]">
            <h3 className="text-xl text-center text-white font-semibold">
              Description
            </h3>
          </div>
          <div className="p-6 flex flex-col items-start justify-start gap-y-4 w-full">
            <div className="flex flex-col items-start w-full">
              <span className="text-base text-primary-black text-center font-bold">
                Market Value
              </span>
              <span className="text-base text-primary-black text-left font-normal">
                Market value refers to the current calculated worth of your car.
                If you choose the market value, your car is covered for what it
                is currently worth in the market. Say that you choose the market
                value as the sum insured for your car, your insurer will give
                you a payout according to the market value of your car at the
                time of theft or loss (not the market value at the time of your
                insurance renewal).
              </span>
            </div>
            <div className="flex flex-col items-start w-full">
              <span className="text-base text-primary-black text-center font-bold">
                Agreed Value
              </span>
              <span className="text-base text-primary-black text-left font-normal">
                Agreed value is the value agreed by both the insurer and
                policyholder at the time of insurance renewal. Insurers
                determine the agreed value based on a few underwriting factors
                and risk assessment. Say that you choose the agreed value as the
                sum insured for your car, your insurer will give you a payout
                exactly as the agreed value.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type ValuationTypeButtonProps = {
  value: "market" | "agreed";
  title: string;
  price: string;
  selectedValue: string;
  updateValue: (value: "market" | "agreed") => void;
};

function ValuationTypeButton({
  value,
  title,
  updateValue,
  price,
  selectedValue,
}: ValuationTypeButtonProps) {
  return (
    <div className="relative even:mt-4 mobile-l:even:mt-0 even:ml-0 mobile-l:even:ml-4 inline-block w-full mobile-l:w-auto">
      <button
        onClick={() => updateValue(value)}
        className={`relative px-4 py-4 flex flex-col items-start justify-center w-full mobile-l:w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent focus-visible:outline-primary-black cursor-pointer ${
          selectedValue === value
            ? "border-[#4B5EAA] text-primary-blue"
            : "border-transparent text-primary-black"
        } shadow-[0_8px_10px_0_#00000024]`}
      >
        <span className="text-sm text-center text-current font-bold">
          {title}
        </span>
        {price !== "" ? (
          <span className="text-base text-center text-current font-normal">
            RM {numberWithCommas(Number(price))}
          </span>
        ) : (
          <span className="text-xs text-left text-current font-normal">
            Select variant to estimate value
          </span>
        )}
      </button>
    </div>
  );
}

export default MarketAndAgreedContainer;
