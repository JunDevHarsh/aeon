import { useContext } from "react";
import SelectDropdown from "../fields/SelectDropdown";
import InputRange from "../fields/InputRange";
import {
  VehicleCoverageContext,
  VehicleCoverageState,
} from "../../pages/Insurance";

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
// function getRandomNumber(min: number, max: number): number {
//   return Math.round(Math.random() * (max - min) + min);
// }

export function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

const VehicleCoverageContainer = () => {
  const {
    store: {
      coverage: { type, agreed, market },
    },
    dispatch,
  } = useContext(VehicleCoverageContext);

  function handleSubmit() {
    dispatch((prev: VehicleCoverageState) => ({
      ...prev,
      isContainerVisible: false,
      selectedCoverage: {
        type: type,
        price: type === "market" ? market.price : agreed.price,
      },
    }));
  }

  function updateSlider(type: "market" | "agreed", value: number) {
    dispatch((prev: VehicleCoverageState) => ({
      ...prev,
      coverage: {
        ...prev.coverage,
        [type]: {
          ...prev.coverage[type],
          price: value,
        },
      },
    }));
  }

  return (
    <div className="relative py-10 px-4 flex items-center justify-center w-full">
      <div className="relative py-10 px-10 mx-auto flex items-start justify-center gap-x-8 max-w-5xl w-full bg-white rounded-xl shadow-container">
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
              The Current market value for your vehicle is RM 14,000
            </p>
          </div>
          <div className="mt-4 flex flex-col items-start w-full">
            <h2 className="text-base text-center text-primary-black font-bold">
              Select your preferred coverage type
            </h2>
            <div className="mt-2 flex items-center justify-start gap-4 w-full">
              {/* Market value */}
              <div className="relative inline-block w-auto">
                <input
                  type="radio"
                  name="coverage-type"
                  id="marketValue1"
                  value="market"
                  checked={type === "market"}
                  // onChange={(e) => updateCoverage("type", e.target.value)}
                  onChange={() =>
                    dispatch((prev) => ({
                      ...prev,
                      coverage: {
                        ...prev.coverage,
                        type: "market",
                      },
                    }))
                  }
                  className="peer absolute top-0 left-0 opacity-0 -z-10"
                />
                <label
                  htmlFor="marketValue1"
                  className={`relative px-4 py-4 flex flex-col items-start justify-center w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent peer-focus-visible:outline-primary-black cursor-pointer ${
                    type === "market"
                      ? "border-[#4B5EAA] text-primary-blue"
                      : "border-transparent text-primary-black"
                  } shadow-[0_8px_10px_0_#00000024]`}
                >
                  <span className="text-sm text-center text-current font-bold">
                    Market Value
                  </span>
                  {market.variant ? (
                    <span className="text-base text-center text-current font-normal">
                      RM {numberWithCommas(market.price)}
                    </span>
                  ) : (
                    <span className="text-xs text-left text-current font-normal">
                      Select variant to estimate value
                    </span>
                  )}
                </label>
              </div>
              {/* Agreed Value */}
              <div className="relative inline-block w-auto">
                <input
                  type="radio"
                  name="coverage-type"
                  id="marketValue2"
                  value="aggreed"
                  checked={type === "agreed"}
                  // onChange={(e) => updateCoverage("type", e.target.value)}
                  onChange={() =>
                    dispatch((prev) => ({
                      ...prev,
                      coverage: {
                        ...prev.coverage,
                        type: "agreed",
                      },
                    }))
                  }
                  className="peer absolute top-0 left-0 opacity-0 -z-10"
                />
                <label
                  htmlFor="marketValue2"
                  className={`relative px-3 py-4 flex flex-col items-start justify-center w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent peer-focus-visible:outline-primary-black cursor-pointer ${
                    type === "agreed"
                      ? "border-[#4B5EAA] text-primary-blue"
                      : "border-transparent text-primary-black"
                  } shadow-[0_8px_10px_0_#00000024]`}
                >
                  <span className="text-sm text-center text-current font-bold">
                    Agreed Value
                  </span>
                  {agreed.variant ? (
                    <span className="text-base text-center text-current font-normal">
                      RM {numberWithCommas(agreed.price)}
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
                optionList={[
                  {
                    value: "mitsubishi asx 2wd-itx144",
                    label: "MITSUBISHI ASX 2WD-ITX144",
                  },
                  {
                    value: "mitsubishi asx",
                    label: "MITSUBISHI ASX",
                  },
                ]}
                id="hello"
                onChange={(val: string) =>
                  dispatch((prev) => ({
                    ...prev,
                    coverage: {
                      ...prev.coverage,
                      market: {
                        ...prev.coverage.market,
                        variant: val,
                      },
                    },
                  }))
                }
                selected={market.variant}
              />
            ) : (
              <div className="flex flex-col items-start gap-y-4 w-full">
                <div className="relative flex flex-col items-start gap-y-2 w-full h-auto">
                  <span className="text-lg text-center text-primary-black font-semibold">
                    Car Type
                  </span>
                  <SelectDropdown
                    selected={agreed.type}
                    optionList={[
                      { label: "Suzuki", value: "suzuki" },
                      { label: "Hero", value: "hero" },
                    ]}
                    onChange={(val: string) =>
                      dispatch((prev) => ({
                        ...prev,
                        coverage: {
                          ...prev.coverage,
                          agreed: {
                            ...prev.coverage.agreed,
                            type: val,
                            variant: null,
                          },
                        },
                      }))
                    }
                    id="carType"
                  />
                </div>
                <div className="relative flex flex-col items-start gap-y-2 w-full h-auto">
                  <span className="text-lg text-center text-primary-black font-semibold">
                    Car Variant
                  </span>
                  <SelectDropdown
                    selected={agreed.variant}
                    optionList={[
                      {
                        label: "MITSUBISHI ASX 2WD",
                        value: "mitsubishi asx 2wd",
                      },
                      {
                        label: "MITSUBISHI ASX 2",
                        value: "mitsubishi asx 2",
                      },
                    ]}
                    id="ads"
                    onChange={(val: string) =>
                      dispatch((prev) => ({
                        ...prev,
                        coverage: {
                          ...prev.coverage,
                          agreed: {
                            ...prev.coverage.agreed,
                            variant: val,
                          },
                        },
                      }))
                    }
                    placeholder="MITSUBISHI ASX 2WD-ITX144"
                  />
                </div>
              </div>
            )}
          </div>
          {type === "market"
            ? market.variant &&
              market.value && (
                <InputRange
                  type="market"
                  value={market.price}
                  setValue={updateSlider}
                  minValue={market.value.min}
                  maxValue={market.value.max}
                />
              )
            : agreed.variant &&
              agreed.value && (
                <InputRange
                  type="agreed"
                  value={agreed.price}
                  setValue={updateSlider}
                  minValue={agreed.value.min}
                  maxValue={agreed.value.max}
                />
              )}
          <div className="mt-4 flex items-center justify-start gap-x-2 w-full">
            {(type === "market" && market.variant) ||
            (type === "agreed" && agreed.type && agreed.variant) ? (
              <button
                onClick={handleSubmit}
                className="relative mt-4 py-2.5 px-8 w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
              >
                <span className="text-base text-center font-medium text-white">
                  Submit
                </span>
              </button>
            ) : (
              <div className="relative mt-4 py-2.5 px-8 w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]">
                <span className="text-base text-center font-medium text-white">
                  Submit
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="relative max-w-sm w-full bg-[#F8F8F8] rounded-lg overflow-hidden">
          <div className="py-2 flex items-center justify-center w-full bg-[#283CC6]">
            <h3 className="text-xl text-center text-white font-bold">
              Summary
            </h3>
          </div>
          <div className="p-6 flex flex-col items-start justify-start gap-y-4 w-full">
            <div className="flex flex-col items-start w-full">
              <span className="text-base text-primary-black text-center font-bold">
                Market Value
              </span>
              <span className="text-base text-primary-black text-left font-normal">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum rerum aliquam officia. Ipsam quibusdam fuga, incidunt
                recusandae velit rem est, dolorem laborum delectus blanditiis
                error itaque amet sit culpa atque.
              </span>
            </div>
            <div className="flex flex-col items-start w-full">
              <span className="text-base text-primary-black text-center font-bold">
                Agreed Value
              </span>
              <span className="text-base text-primary-black text-left font-normal">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Nostrum rerum aliquam officia. Ipsam quibusdam fuga, incidunt
                recusandae velit rem est, dolorem laborum delectus blanditiis
                error itaque amet sit culpa atque.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCoverageContainer;
