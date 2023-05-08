import { useState } from "react";
import SelectDropdown from "../components/fields/SelectDropdown";
import InputRange from "../components/fields/InputRange";
import { updateInsuranceCoverage } from "../store/slices/insurance";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

interface CoverageType {
  type: "market" | "aggreed";
  carType: string | null;
  carVariant: string | null;
  variant: string | null;
}

const MIN_VALUE = 14000;
const MAX_VALUE = 21000;

/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomNumber(min: number, max: number): number {
  return Math.round(Math.random() * (max - min) + min);
}

export function numberWithCommas(x: number): string {
  return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

function getRandomVehicleValue(minValue: number, maxValue: number) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(getRandomNumber(minValue, maxValue));
    }, 1000);
  });
}

const PolicyCoveragePage = () => {
  const [value, setValue] = useState<number>(0);
  const [coverage, setCovergae] = useState<CoverageType>({
    type: "market",
    carType: null,
    carVariant: null,
    variant: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit() {
    const val: number = coverage.type === "market" ? 14000 : value;
    dispatch(updateInsuranceCoverage({ type: coverage.type, value: val }));
    navigate("/insurance");
  }

  function updateCoverage(
    prop: "type" | "carType" | "carVariant" | "variant",
    value: string | number | null
  ) {
    setCovergae((prev) => ({ ...prev, [prop]: value }));
  }

  return (
    <div className="relative py-10 px-4 flex items-center justify-center w-full">
      <div className="relative py-10 px-10 mx-auto flex items-start justify-center gap-x-8 max-w-5xl w-full bg-white rounded-xl">
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
              <div className="relative inline-block w-auto">
                <input
                  type="radio"
                  name="coverage-type"
                  id="marketValue1"
                  value="market"
                  checked={coverage.type === "market"}
                  onChange={(e) => updateCoverage("type", e.target.value)}
                  className="peer absolute top-0 left-0 opacity-0 -z-10"
                />
                <label
                  htmlFor="marketValue1"
                  className={`relative px-4 py-4 flex flex-col items-start justify-center w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent peer-focus-visible:outline-primary-black cursor-pointer ${
                    coverage.type === "market"
                      ? "border-[#4B5EAA] text-primary-blue"
                      : "border-transparent text-primary-black"
                  } shadow-[0_8px_10px_0_#00000024]`}
                >
                  <span className="text-sm text-center text-current font-bold">
                    Market Value
                  </span>
                  <span className="text-base text-center text-current font-normal">
                    RM 14,000
                  </span>
                </label>
              </div>
              <div className="relative inline-block w-auto">
                <input
                  type="radio"
                  name="coverage-type"
                  id="marketValue2"
                  value="aggreed"
                  checked={coverage.type === "aggreed"}
                  onChange={(e) => updateCoverage("type", e.target.value)}
                  className="peer absolute top-0 left-0 opacity-0 -z-10"
                />
                <label
                  htmlFor="marketValue2"
                  className={`relative px-3 py-4 flex flex-col items-start justify-center w-[157px] h-[82px] border border-solid rounded-xl outline outline-2 outline-transparent peer-focus-visible:outline-primary-black cursor-pointer ${
                    coverage.type === "aggreed"
                      ? "border-[#4B5EAA] text-primary-blue"
                      : "border-transparent text-primary-black"
                  } shadow-[0_8px_10px_0_#00000024]`}
                >
                  <span className="text-sm text-center text-current font-bold">
                    Agreed Value
                  </span>

                  {coverage.type === "aggreed" ? (
                    <span className="text-base text-center text-current font-normal">
                      RM {numberWithCommas(value)}
                    </span>
                  ) : (
                    <span className="mt-2 text-xs text-center text-current font-normal">
                      Click to estimate value
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
            {coverage.type === "market" ? (
              <SelectDropdown
                optionList={[
                  {
                    value: "mitsubishi asx 2wd-itx144",
                    label: "MITSUBISHI ASX 2WD-ITX144",
                  },
                ]}
                id="hello"
                onChange={(val: string) => updateCoverage("variant", val)}
                selected={coverage.variant}
              />
            ) : (
              <div className="flex flex-col items-start gap-y-4 w-full">
                <div className="relative flex flex-col items-start gap-y-2 w-full h-auto">
                  <span className="text-lg text-center text-primary-black font-semibold">
                    Car Type
                  </span>
                  <SelectDropdown
                    selected={coverage.carType}
                    optionList={[{ label: "Suzuki", value: "suzuki" }]}
                    onChange={(val: string) => updateCoverage("carType", val)}
                    id="asd"
                  />
                </div>
                <div className="relative flex flex-col items-start gap-y-2 w-full h-auto">
                  <span className="text-lg text-center text-primary-black font-semibold">
                    Car Variant
                  </span>
                  <SelectDropdown
                    selected={coverage.carVariant}
                    optionList={[
                      {
                        label: "MITSUBISHI ASX 2WD-ITX144",
                        value: "mitsubishi asx 2wd-itx144",
                      },
                    ]}
                    id="ads"
                    onChange={(val: string) =>
                      updateCoverage("carVariant", val)
                    }
                    placeholder="MITSUBISHI ASX 2WD-ITX144"
                  />
                </div>
              </div>
            )}
          </div>
          <InputRange
            value={value}
            setValue={setValue}
            minValue={MIN_VALUE}
            maxValue={MAX_VALUE}
          />
          <div className="mt-4 flex items-center justify-start gap-x-2 w-full">
            <button
              onClick={handleSubmit}
              className="relative mt-4 py-2.5 px-8 w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                Submit
              </span>
            </button>
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

export default PolicyCoveragePage;
