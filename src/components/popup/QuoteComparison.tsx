import { useState, useContext } from "react";
import { InsurerQuoteStateType } from "../../context/types";
import {
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
import { InsuranceContext } from "../../context/InsuranceContext";
import { useNavigate } from "react-router-dom";

type QuoteComparisonProps = {
  selectedQuotes: InsurerQuoteStateType[];
  shouldComparePopupVisible: React.Dispatch<React.SetStateAction<boolean>>;
  updateSelectedQuotePlans: (val: string) => void;
};

const QuoteComparisonPopup = ({
  selectedQuotes,
  shouldComparePopupVisible,
  updateSelectedQuotePlans,
}: QuoteComparisonProps) => {
  const [showDifference, setShowDifference] = useState<boolean>(false);
  const navigate = useNavigate();
  const { dispatch } = useContext(InsuranceContext);
  const uniqueBenefits = [
    ...new Set(
      selectedQuotes.flatMap((selectedQuote) => selectedQuote.benefits)
    ),
  ];

  /*In this code, the getBenefitRows function uses the forEach method to iterate over the benefits array.
  Inside the forEach loop, the map method is used to create the benefitRow array. The map method is used 
  on the ar array to check if each insurer's benefits include the current benefit.

  The showUniqueOnly condition is applied using an if statement. If showUniqueOnly is true and all the values
  in the benefitRow array are true, the iteration is skipped using the return statement.

  Finally, the resulting benefit row, including the benefit and its corresponding boolean values, is pushed 
  to the finalResult array. */
  function getBenefitRows(
    benefits: Array<string>,
    ar: InsurerQuoteStateType[],
    showUniqueOnly: boolean
  ) {
    const finalResult: any[] = [];

    benefits.forEach((benefit) => {
      const benefitRow = ar.map((insurer) => {
        return insurer.benefits.includes(benefit);
      });

      if (showUniqueOnly && !benefitRow.includes(false)) {
        return;
      }

      finalResult.push([benefit, ...benefitRow]);
    });

    return finalResult;
  }

  // console.log(getBenefitRows(uniqueBenefits, selectedQuotes, false));

  function handleSelectedQuote(id: string) {
    const quotePlan = selectedQuotes.find((quote) => quote.id === id);
    // console.log(quotePlan);
    if (quotePlan) {
      dispatch({
        type: InsuranceProviderTypes.UpdateInsuranceProvider,
        payload: {
          companyId: quotePlan.insurerId,
          companyName: quotePlan.insurerName,
          price: quotePlan.price.toString(),
        },
      });
      navigate("/insurance/market-agreed-value");
    }
  }

  const quotesToDisplay = getBenefitRows(
    uniqueBenefits,
    selectedQuotes,
    showDifference
  );

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 w-screen min-h-screen h-full bg-gradient-to-b from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-[11] overflow-auto">
      <div className="relative p-10 flex items-center justify-center w-full h-auto">
        <div className="relative flex items-center justify-center max-w-6xl w-auto h-auto overflow-auto">
          <div className="relative p-8 w-full h-auto bg-white rounded-lg">
            {/* Close button */}
            <div className="absolute top-2 right-2 w-auto h-auto">
              <button
                className="relative flex items-center justify-center w-auto h-auto"
                onClick={() => shouldComparePopupVisible(false)}
              >
                <svg
                  width="37"
                  height="37"
                  viewBox="0 0 37 37"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.7814 27.1L18.5002 20.3813L25.2189 27.1L27.1002 25.2188L20.3814 18.5L27.1002 11.7813L25.2189 9.90001L18.5002 16.6188L11.7814 9.90001L9.90016 11.7813L16.6189 18.5L9.90016 25.2188L11.7814 27.1ZM18.5002 36.4167C16.0516 36.4167 13.7373 35.9464 11.5575 35.0057C9.37759 34.0651 7.47395 32.7811 5.84652 31.1537C4.21909 29.5262 2.93506 27.6226 1.99443 25.4427C1.05381 23.2629 0.583496 20.9486 0.583496 18.5C0.583496 16.0215 1.05381 13.6924 1.99443 11.5125C2.93506 9.33265 4.21909 7.43647 5.84652 5.82397C7.47395 4.21147 9.37759 2.93491 11.5575 1.99428C13.7373 1.05366 16.0516 0.583344 18.5002 0.583344C20.9786 0.583344 23.3078 1.05366 25.4877 1.99428C27.6675 2.93491 29.5637 4.21147 31.1762 5.82397C32.7887 7.43647 34.0653 9.33265 35.0059 11.5125C35.9465 13.6924 36.4168 16.0215 36.4168 18.5C36.4168 20.9486 35.9465 23.2629 35.0059 25.4427C34.0653 27.6226 32.7887 29.5262 31.1762 31.1537C29.5637 32.7811 27.6675 34.0651 25.4877 35.0057C23.3078 35.9464 20.9786 36.4167 18.5002 36.4167Z"
                    fill="#828282"
                  />
                </svg>
              </button>
            </div>
            {/* Heading */}
            <div className="flex items-center justify-center w-full">
              <h3 className="text-3xl text-center text-primary-black font-bold">
                Comparison
              </h3>
            </div>

            {/* container */}
            <div
              className="mt-8 grid gap-2 w-full overflow-auto"
              style={{
                gridTemplateColumns: `minmax(250px, 2fr) repeat(${selectedQuotes.length}, minmax(210px, 1fr))`,
              }}
            >
              <div className="flex flex-col items-start justify-end w-full span-1">
                <div className="mb-2 flex items-center justify-start w-full">
                  <div className="relative flex items-center w-auto">
                    <input
                      type="checkbox"
                      id="differenceCheckbox"
                      name="differenceCheckbox"
                      checked={showDifference}
                      onChange={() => setShowDifference((prev) => !prev)}
                      className="peer absolute top-0 left-0 -z-10 opacity-0"
                    />
                    <label
                      htmlFor="differenceCheckbox"
                      className={`relative flex items-center p-[2px] w-9 h-5 ${
                        showDifference ? "bg-primary-blue" : "bg-[#8A8A8A]"
                      } cursor-pointer rounded-full outline-2 outline outline-transparent peer-focus-visible:outline-primary-black`}
                    >
                      <span
                        className={`relative ${
                          showDifference ? "left-[calc(100%-16px)]" : "left-0"
                        } inline-block w-4 h-4 bg-white transition-all duration-150 rounded-full`}
                      />
                    </label>
                  </div>
                  <p className="ml-2 text-base text-center text-primary-black font-medium">
                    Only show difference
                  </p>
                </div>
                <h3 className="text-xl text-primary-black text-left font-semibold tracking-wide">
                  Coverage Benefits
                </h3>
              </div>
              {selectedQuotes.map((selectedQuote) => (
                <div
                  key={selectedQuote.id}
                  className="relative py-3 px-5 flex flex-col items-center justify-between w-full col-span-1 bg-[#F4F4F4] rounded-lg"
                >
                  <div className="flex items-start justify-between w-full h-auto">
                    <img
                      src={`/providers/${selectedQuote.imgUrl}.png`}
                      alt={`insurur-${selectedQuote.insurerName}-img`}
                      className="h-8 w-auto"
                    />
                    <button
                      className="relative flex items-center justify-center w-5 h-5"
                      onClick={() => updateSelectedQuotePlans(selectedQuote.id)}
                    >
                      <svg
                        viewBox="0 0 37 37"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.7814 27.1L18.5002 20.3813L25.2189 27.1L27.1002 25.2188L20.3814 18.5L27.1002 11.7813L25.2189 9.90001L18.5002 16.6188L11.7814 9.90001L9.90016 11.7813L16.6189 18.5L9.90016 25.2188L11.7814 27.1ZM18.5002 36.4167C16.0516 36.4167 13.7373 35.9464 11.5575 35.0057C9.37759 34.0651 7.47395 32.7811 5.84652 31.1537C4.21909 29.5262 2.93506 27.6226 1.99443 25.4427C1.05381 23.2629 0.583496 20.9486 0.583496 18.5C0.583496 16.0215 1.05381 13.6924 1.99443 11.5125C2.93506 9.33265 4.21909 7.43647 5.84652 5.82397C7.47395 4.21147 9.37759 2.93491 11.5575 1.99428C13.7373 1.05366 16.0516 0.583344 18.5002 0.583344C20.9786 0.583344 23.3078 1.05366 25.4877 1.99428C27.6675 2.93491 29.5637 4.21147 31.1762 5.82397C32.7887 7.43647 34.0653 9.33265 35.0059 11.5125C35.9465 13.6924 36.4168 16.0215 36.4168 18.5C36.4168 20.9486 35.9465 23.2629 35.0059 25.4427C34.0653 27.6226 32.7887 29.5262 31.1762 31.1537C29.5637 32.7811 27.6675 34.0651 25.4877 35.0057C23.3078 35.9464 20.9786 36.4167 18.5002 36.4167Z"
                          fill="#828282"
                        />
                      </svg>
                    </button>
                  </div>
                  <p className="my-2 text-2xl text-center text-primary-black font-bold">
                    RM {selectedQuote.price}/Year
                  </p>
                  <button
                    onClick={() => handleSelectedQuote(selectedQuote.id)}
                    className="relative py-1 px-3.5 w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
                  >
                    <span className="text-base text-center font-medium text-white">
                      Buy Now
                    </span>
                  </button>
                </div>
              ))}
              {quotesToDisplay.map((benefitRow, rowIndex) =>
                benefitRow.map(
                  (benefitColumn: string | boolean, colIndex: number) =>
                    colIndex === 0 ? (
                      <div
                        key={`benefit-${rowIndex}-of-${colIndex}`}
                        className="p-4 flex items-center justify-center bg-[#F4F4F4] col-span-1 w-full rounded-lg"
                      >
                        <p className="text-lg text-center text-primary-black font-bold w-full">
                          {benefitColumn}
                        </p>
                      </div>
                    ) : benefitColumn === true ? (
                      <div
                        key={`benefit-${rowIndex}-of-${colIndex}`}
                        className="relative flex items-center justify-center px-4 py-5 w-full col-span-1 bg-[#FCF6FF] rounded-lg"
                      >
                        <span className="inline-block w-5 h-5">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                              fill="#A5308A"
                            />
                          </svg>
                        </span>
                      </div>
                    ) : (
                      <div
                        key={`benefit-${rowIndex}-of-${colIndex}`}
                        className="flex items-center justify-center px-4 py-5 w-full bg-[#FCF6FF] rounded-lg"
                      >
                        <span className="inline-block w-5 h-5">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                              fill="#DFDFDF"
                            />
                          </svg>
                        </span>
                      </div>
                    )
                )
              )}
            </div>

            {/*  */}
            {/* <div className="mt-8 flex items-start justify-start w-full gap-x-2 overflow-auto">
              <div className="flex flex-col items-start justify-start gap-y-2 min-w-[245px] w-[358px]">
                <div className="flex flex-col items-start justify-end  w-full h-[136px]">
                  <div className="flex items-center justify-start w-full">
                    <div className="relative flex items-center w-auto">
                      <input
                        type="checkbox"
                        id="differenceCheckbox"
                        name="differenceCheckbox"
                        checked={showDifference}
                        onChange={() => setShowDifference((prev) => !prev)}
                        className="peer absolute top-0 left-0 -z-10 opacity-0"
                      />
                      <label
                        htmlFor="differenceCheckbox"
                        className={`relative flex items-center p-[2px] w-9 h-5 ${
                          showDifference ? "bg-primary-blue" : "bg-[#8A8A8A]"
                        } cursor-pointer rounded-full outline-2 outline outline-transparent peer-focus-visible:outline-primary-black`}
                      >
                        <span
                          className={`relative ${
                            showDifference ? "left-[calc(100%-16px)]" : "left-0"
                          } inline-block w-4 h-4 bg-white transition-all duration-150 rounded-full`}
                        />
                      </label>
                    </div>
                    <p className="ml-2 text-base text-center text-primary-black font-medium">
                      Only show difference
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-start gap-y-4 w-full h-auto">
                  {quoteCoveragesToDisplay.map((coverage) => (
                    <div
                      key={`coverages-item-${coverage.id}`}
                      className="inline-block p-4 bg-[#F4F4F4] w-full rounded-lg"
                    >
                      <p className="text-lg text-center text-primary-black font-bold w-full">
                        {coverage.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-start justify-between gap-x-2">
                {selectedQuotes.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center justify-start min-w-[210px] gap-y-2"
                  >
                    <div className="relative py-2.5 px-5 flex flex-col items-center justify-between gap-y-2 w-full h-[136px] bg-[#F4F4F4] rounded-lg">
                      <div className="flex items-start justify-between w-full h-auto">
                        <img
                          src={`/providers/${item.companyRelImgHref}.png`}
                          alt={`${item.companyName}-logo`}
                          className="h-8 w-auto"
                        />
                        <button
                          className="relative flex items-center justify-center w-5 h-5"
                          onClick={() => updateSelectedQuotePlans(item.id)}
                        >
                          <svg
                            viewBox="0 0 37 37"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M11.7814 27.1L18.5002 20.3813L25.2189 27.1L27.1002 25.2188L20.3814 18.5L27.1002 11.7813L25.2189 9.90001L18.5002 16.6188L11.7814 9.90001L9.90016 11.7813L16.6189 18.5L9.90016 25.2188L11.7814 27.1ZM18.5002 36.4167C16.0516 36.4167 13.7373 35.9464 11.5575 35.0057C9.37759 34.0651 7.47395 32.7811 5.84652 31.1537C4.21909 29.5262 2.93506 27.6226 1.99443 25.4427C1.05381 23.2629 0.583496 20.9486 0.583496 18.5C0.583496 16.0215 1.05381 13.6924 1.99443 11.5125C2.93506 9.33265 4.21909 7.43647 5.84652 5.82397C7.47395 4.21147 9.37759 2.93491 11.5575 1.99428C13.7373 1.05366 16.0516 0.583344 18.5002 0.583344C20.9786 0.583344 23.3078 1.05366 25.4877 1.99428C27.6675 2.93491 29.5637 4.21147 31.1762 5.82397C32.7887 7.43647 34.0653 9.33265 35.0059 11.5125C35.9465 13.6924 36.4168 16.0215 36.4168 18.5C36.4168 20.9486 35.9465 23.2629 35.0059 25.4427C34.0653 27.6226 32.7887 29.5262 31.1762 31.1537C29.5637 32.7811 27.6675 34.0651 25.4877 35.0057C23.3078 35.9464 20.9786 36.4167 18.5002 36.4167Z"
                              fill="#828282"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[22px] text-center text-primary-black font-bold">
                        RM {item.price}/Year
                      </p>
                      <button
                        onClick={() => handleSelectedQuote(item.id)}
                        className="relative py-1 px-3.5 w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
                      >
                        <span className="text-base text-center font-medium text-white">
                          Buy Now
                        </span>
                      </button>
                    </div>
                    <div className="flex flex-col items-center justify-start w-full gap-y-4">
                      {quoteCoveragesToDisplay.map((coverage: Coverage) =>
                        item.coverages[coverage.id] ? (
                          <div
                            key={`coverage-${item.id}-${coverage.id}`}
                            className="flex items-center justify-center px-4 py-5 w-full bg-[#FCF6FF] rounded-lg"
                          >
                            <span className="inline-block w-5 h-5 bg-white">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                                  fill="#A5308A"
                                />
                              </svg>
                            </span>
                          </div>
                        ) : (
                          <div
                            key={`coverage-${item.id}-${coverage.id}`}
                            className="flex items-center justify-center px-4 py-5 w-full bg-[#FCF6FF] rounded-lg"
                          >
                            <span className="inline-block w-5 h-5 bg-white">
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                                  fill="#DFDFDF"
                                />
                              </svg>
                            </span>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteComparisonPopup;
