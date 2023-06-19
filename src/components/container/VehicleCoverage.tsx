import { useContext } from "react";
import SelectDropdown from "../fields/SelectDropdown";
import InputRange from "../fields/InputRange";
import { VehicleCoverageContext } from "../../context/VehicleCoverage";
// import { useSelector } from "react-redux";
// import { RootState } from "../../store/store";
import { Link } from "react-router-dom";

export function numberWithCommas(x: number): string {
  return x.toLocaleString();
}

const VehicleCoverageContainer = () => {
  const {
    state: { type, market, agreed },
    setState,
  } = useContext(VehicleCoverageContext);
  // const vehicleInfo = useSelector((state: RootState) => state.vehicle);
  // const variantOptionList = vehicleInfo.nvicList.map((variant) => ({
  //   label: variant.vehicleVariant,
  //   value: variant.vehicleVariant,
  // }));

  const marketVariantOptionList = market.nvicList.map(({ vehicleVariant }) => ({
    label: vehicleVariant,
    value: vehicleVariant,
  }));

  // function handleSubmit() {
  //   setState((prev) => ({
  //     ...prev,
  //     selectedCoverage: {
  //       type: type,
  //       price: type === "market" ? market.price : agreed.price,
  //     },
  //   }));
  // }

  // function updateSlider(type: "market" | "agreed", value: number) {
  //   setState((prev) => ({
  //     ...prev,
  //     [type]: {
  //       ...prev[type],
  //       price: value,
  //     },
  //   }));
  // }

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
            <p className="text-sm text-center text-primary-pink font-bold">
              The Current market value for your vehicle is RM{" "}
              {numberWithCommas(
                market.nvic ? market.nvic?.vehicleMarketValue : 0
              )}
            </p>
          </div>
          <div className="mt-4 flex flex-col items-start w-full">
            <h2 className="text-base text-center text-primary-black font-bold">
              Select your preferred coverage type
            </h2>
            <div className="mt-2 flex flex-col mobile-l:flex-row items-center justify-start w-full">
              {/* Market value */}
              <div className="relative inline-block w-full mobile-l:w-auto">
                <input
                  type="radio"
                  name="coverage-type"
                  id="marketValue1"
                  value="market"
                  checked={type === "market"}
                  onChange={() =>
                    setState((prev) => ({
                      ...prev,
                      type: "market",
                    }))
                  }
                  className="peer absolute top-0 left-0 opacity-0 -z-10"
                />
                <label
                  htmlFor="marketValue1"
                  className={`relative px-4 py-4 flex flex-col items-start justify-center w-full mobile-l:w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent peer-focus-visible:outline-primary-black cursor-pointer ${
                    type === "market"
                      ? "border-[#4B5EAA] text-primary-blue"
                      : "border-transparent text-primary-black"
                  } shadow-[0_8px_10px_0_#00000024]`}
                >
                  <span className="text-sm text-center text-current font-bold">
                    Market Value
                  </span>
                  {market.nvic?.vehicleMarketValue ? (
                    <span className="text-base text-center text-current font-normal">
                      RM {numberWithCommas(market.nvic.vehicleMarketValue)}
                    </span>
                  ) : (
                    <span className="text-xs text-left text-current font-normal">
                      Select variant to estimate value
                    </span>
                  )}
                </label>
              </div>
              {/* Agreed Value */}
              <div className="mt-4 mobile-l:mt-0 ml-0 mobile-l:ml-4 relative inline-block w-full mobile-l:w-auto">
                <input
                  type="radio"
                  name="coverage-type"
                  id="marketValue2"
                  value="agreed"
                  checked={type === "agreed"}
                  // onChange={(e) => updateCoverage("type", e.target.value)}
                  onChange={() =>
                    setState((prev) => ({
                      ...prev,
                      type: "agreed",
                    }))
                  }
                  className="peer absolute top-0 left-0 opacity-0 -z-10"
                />
                <label
                  htmlFor="marketValue2"
                  className={`relative px-3 py-4 flex flex-col items-start justify-center w-full mobile-l:w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent peer-focus-visible:outline-primary-black cursor-pointer ${
                    type === "agreed"
                      ? "border-[#4B5EAA] text-primary-blue"
                      : "border-transparent text-primary-black"
                  } shadow-[0_8px_10px_0_#00000024]`}
                >
                  <span className="text-sm text-center text-current font-bold">
                    Agreed Value
                  </span>
                  {agreed.nvic?.vehicleMarketValue ? (
                    <span className="text-base text-center text-current font-normal">
                      RM {numberWithCommas(agreed.nvic.vehicleMarketValue)}
                    </span>
                  ) : (
                    <span className="text-xs text-left text-current font-normal">
                      Click to estimate the value
                    </span>
                  )}
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-start w-full">
            <h2 className="mb-2 text-base text-center text-primary-black font-bold">
              Select your car variant to estimate its value
            </h2>
            {type === "market" ? (
              <SelectDropdown
                optionList={marketVariantOptionList}
                id="hello"
                onChange={(val: string) =>
                  setState((prev) => ({
                    ...prev,
                    market: {
                      ...prev.market,
                      variant: val,
                    },
                  }))
                }
                selected={market.nvic ? market.nvic.vehicleVariant : null}
              />
            ) : (
              <div className="flex flex-col items-start w-full">
                <div className="relative pb-4 flex flex-col items-start w-full h-auto">
                  <span className="mb-2 text-lg text-center text-primary-black font-semibold">
                    Car Type
                  </span>
                  <span className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium cursor-default border border-solid border-[#CFD0D7] rounded">
                    {agreed.nvic && agreed.nvic.vehicleVariant}
                  </span>
                </div>
                <div className="relative flex flex-col items-start w-full h-auto">
                  <span className="mb-2 text-lg text-center text-primary-black font-semibold">
                    Car Variant
                  </span>
                  <SelectDropdown
                    selected={agreed.nvic ? agreed.nvic.vehicleVariant : null}
                    optionList={marketVariantOptionList}
                    id="ads"
                    onChange={(val: string) =>
                      setState((prev) => ({
                        ...prev,
                        agreed: {
                          ...prev.agreed,
                          variant: val,
                        },
                      }))
                    }
                    placeholder="Select Car Variant"
                  />
                </div>
              </div>
            )}
          </div>
          {type === "agreed" && agreed.nvic && (
            <InputRange
              type="agreed"
              value={50}
              setValue={() => {}}
              minValue={0}
              midValue={50}
              maxValue={100}
            />
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
};

export default VehicleCoverageContainer;
