import { useContext } from "react";
import { numberWithCommas } from "./VehicleCoverage";
import {
  AgreedVariantType,
  MarketAndAgreedContext,
  UpdateValuation,
} from "../../context/MarketAndAgreedContext";
import SelectDropdown from "../fields/SelectDropdown";
import InputRange from "../fields/InputRange";

function check(
  listOfAgreed: Array<AgreedVariantType>
): Record<string, AgreedVariantType> {
  const regEx = /(-HIGH|-LOW|-HI|-LO)\s*-?\s*/;

  return listOfAgreed.reduce<Record<string, AgreedVariantType>>(
    (acc: any, currentAgreed: any) => {
      const avCode = currentAgreed.AvCode.replace(regEx, "");

      if (!acc[avCode]) {
        acc[avCode] = {
          Variant:
            "TOYOTA COROLLA | " + currentAgreed.Variant.replace(regEx, ""),
          AvCode: avCode,
          MakeYear: currentAgreed.MakeYear,
          VehicleEngineCC: currentAgreed.VehicleEngineCC,
        };
      }

      if (
        currentAgreed.AvCode.includes("-HI") ||
        currentAgreed.AvCode.includes("-HIGH")
      ) {
        acc[avCode].AvCodeHigh = currentAgreed.AvCode;
        acc[avCode].SumInsuredHigh = currentAgreed.SumInsured;
      } else if (
        currentAgreed.AvCode.includes("-LO") ||
        currentAgreed.AvCode.includes("-LOW")
      ) {
        acc[avCode].AvCodeLow = currentAgreed.AvCode;
        acc[avCode].SumInsuredLow = currentAgreed.SumInsured;
      } else {
        acc[avCode].SumInsured = currentAgreed.SumInsured;
      }

      return acc;
    },
    {}
  );
}

function MarketAndAgreedContainer() {
  const {
    state: { type, market, agreed, variants, types },
    dispatch,
  } = useContext(MarketAndAgreedContext);

  const marketVariantOptionList = variants.map(({ nvic, vehicleVariant }) => ({
    label: vehicleVariant,
    value: nvic,
  }));

  const agreedTypeOptionList = types.map(({ AvCode, Variant }) => ({
    label: Variant,
    value: AvCode,
  }));

  const listOfAgreedVariants = check(types);
  const agreedVariantOptionList = Object.values(listOfAgreedVariants).map(
    ({ AvCode, Variant }) => ({
      label: Variant,
      value: AvCode,
    })
  );

  const minAgreedValue = types.find(
    ({ AvCode }) =>
      AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") === agreed?.avCode &&
      AvCode.includes("-LO")
  );

  const midAgreedValue = types.find(({ AvCode }) => AvCode === agreed?.avCode);

  const maxAgreedValue = types.find(
    ({ AvCode }) =>
      AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") === agreed?.avCode &&
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
        sumInsured: Number(SumInsured),
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
              {numberWithCommas(14000)}
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
                price={market ? market.marketValue : null}
                updateValue={handleTypeChange}
              />
              <ValuationTypeButton
                selectedValue={type}
                title="Agreed Value"
                value="agreed"
                price={agreed ? agreed.sumInsured : null}
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
                      selected={agreed ? agreed.avCode : null}
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
                {agreed?.avCode && (
                  <InputRange
                    type="agreed"
                    value={agreed.sumInsured}
                    minValue={Number(minAgreedValue?.SumInsured)}
                    midValue={Number(midAgreedValue?.SumInsured)}
                    maxValue={Number(maxAgreedValue?.SumInsured)}
                    setValue={() => {}}
                  />
                )}
              </>
            )}
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
  price: number | null;
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
        {price ? (
          <span className="text-base text-center text-current font-normal">
            RM {numberWithCommas(price)}
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
