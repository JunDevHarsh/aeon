import { useContext } from "react";
import { numberWithCommas } from "./VehicleCoverage";
import {
  AgreedVariantType,
  MarketAndAgreedContext,
  UpdateValuation,
} from "../../context/MarketAndAgreedContext";
import SelectDropdown from "../fields/SelectDropdown";
import InputRange from "../fields/InputRange";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axios from "axios";
import {
  checkTokenIsExpired,
  generateSessionName,
  generateToken,
} from "../../utils/helpers";
import {
  SessionType,
  TokenType,
  addSessionName,
  addToken,
} from "../../store/slices/credentials";
import {
  InsuranceContext,
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
import { QuoteListingContext, QuotesTypes } from "../../context/QuoteListing";
import { useNavigate } from "react-router-dom";

function createUniqueValues(types: AgreedVariantType[]) {
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
  // get token from store
  const {
    token: tokenInStore,
    session: sessionInStore,
    requestId,
    inquiryId,
  } = useSelector((state: RootState) => state.credentials);
  const {
    state: { id: productId },
    dispatch: updateInsuranceDispatch,
  } = useContext(InsuranceContext);
  const { dispatch: updateQuotesDispatch } = useContext(QuoteListingContext);
  const updateStore = useDispatch();
  const {
    reconIndicator,
    // vehicleMake,
    // vehicleModel,
    // region,
    // yearOfManufacture,
  } = useSelector((state: RootState) => state.vehicle);

  const marketVariantOptionList = variants.map(({ nvic, vehicleVariant }) => ({
    label: vehicleVariant,
    value: nvic,
  }));

  const navigate = useNavigate();

  // const listOfAgreedVariants = check(types);
  const listOfAgreedVariants: AgreedVariantType[] = Object.values(
    createUniqueValues(types)
  );

  const agreedVariantOptionList = listOfAgreedVariants.map(
    ({ AvCode, Variant }) => ({
      label: "TOYOTA COROLLA | " + Variant,
      value: AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, ""),
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
    const selectedType = types.find(
      (type) => type.AvCode.replace(/(-HIGH|-LOW|-HI|-LO)\s*-?\s*/, "") === val
    );
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

  // async function getAgreedVariantsList() {
  //   try {
  //     let tokenInfo = tokenInStore;
  //     let sessionInfo = sessionInStore;
  //     if (!tokenInStore || checkTokenIsExpired(tokenInStore)) {
  //       // get new token
  //       const getToken: TokenType = await generateToken(
  //         "https://app.agiliux.com/aeon/webservice.php?operation=getchallenge&username=admin",
  //         5000
  //       );
  //       tokenInfo = getToken;
  //       // add token to store
  //       updateStore(addToken({ ...getToken }));
  //       const sessionApiResponse: SessionType = await generateSessionName(
  //         "https://app.agiliux.com/aeon/webservice.php",
  //         5000,
  //         tokenInfo.token,
  //         "bwJrIhxPdfsdialE"
  //       );
  //       sessionInfo = sessionApiResponse;
  //       // add session name to store state
  //       updateStore(
  //         addSessionName({
  //           userId: sessionApiResponse.userId,
  //           sessionName: sessionApiResponse.sessionName,
  //         })
  //       );
  //     }
  //     const apiRespose = await axios.post(
  //       "https://app.agiliux.com/aeon/webservice.php",
  //       {
  //         element: JSON.stringify({
  //           requestId: requestId,
  //           tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
  //           region: region === "West Malaysia" ? "W" : "E",
  //           makeCode: vehicleMake,
  //           modelCode: vehicleModel,
  //           makeYear: yearOfManufacture,
  //         }),
  //         operation: "getVariant",
  //         sessionName: sessionInfo?.sessionName,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //       }
  //     );
  //     console.log(apiRespose);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  async function updateQuotePremium() {
    try {
      let tokenInfo = tokenInStore;
      let sessionInfo = sessionInStore;
      if (!tokenInStore || checkTokenIsExpired(tokenInStore)) {
        // get new token
        const getToken: TokenType = await generateToken(
          "https://app.agiliux.com/aeon/webservice.php?operation=getchallenge&username=admin",
          5000
        );
        tokenInfo = getToken;
        // add token to store
        updateStore(addToken({ ...getToken }));
        const sessionApiResponse: SessionType = await generateSessionName(
          "https://app.agiliux.com/aeon/webservice.php",
          5000,
          tokenInfo.token,
          "bwJrIhxPdfsdialE"
        );
        sessionInfo = sessionApiResponse;
        // add session name to store state
        updateStore(
          addSessionName({
            userId: sessionApiResponse.userId,
            sessionName: sessionApiResponse.sessionName,
          })
        );
      }
      const quoteResponse = await axios.post(
        "https://app.agiliux.com/aeon/webservice.php",
        {
          element: JSON.stringify({
            requestId: requestId,
            tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
            class: "Private Vehicle",
            additionalCover: [],
            unlimitedDriverInd: false,
            driverDetails: [],
            sitype:
              type === "market" ? "MV - Market Value" : "AV - Agreed Value",
            avCode: type === "market" ? "" : agreed?.avCode,
            sumInsured:
              type === "market"
                ? market.vehicleMarketValue
                : agreed?.sumInsured,
            nvicCode: type === "market" ? market.nvic : agreed?.nvic,
            accountid: productId,
            inquiryId: inquiryId,
            insurer: "7x250468",
            quoteId: "5x23232",
          }),
          operation: "updateQuote",
          sessionName: sessionInfo?.sessionName,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (quoteResponse.status === 200 && quoteResponse.data) {
        if (quoteResponse.data.error || !quoteResponse.data.success) {
          throw new Error("INTERVAL_SERVER_ERROR");
        }
        if (quoteResponse.data) {
          if (quoteResponse.data.result.quoteinfo.length === 0) {
            throw new Error("NO_QUOTE_FOUND");
          }
          const data = quoteResponse.data.result;
          const quoteList = data.quoteinfo.map(
            ({
              productid,
              logoname,
              displaypremium,
              benefits,
              insurer,
            }: any) => ({
              id: insurer,
              insurerId: productid,
              insurerName: logoname,
              planType: "comprehensive",
              imgUrl: logoname.toLowerCase(),
              price: displaypremium || 672.8,
              popular: true,
              isSelected: false,
              benefits: benefits,
            })
          );
          updateInsuranceDispatch({
            type: InsuranceProviderTypes.UpdateInsuranceProvider,
            payload: {
              companyId: productId,
              companyName: "Allianz",
              price: quoteList[0].price,
            },
          });
          updateQuotesDispatch({
            type: QuotesTypes.UpdateAllQuotes,
            payload: { quotes: quoteList },
          });
          navigate("/insurance/plan-add-ons");
        }
        throw new Error("INTERVAL_SERVER_ERROR");
      }
      console.log(quoteResponse);
    } catch (err) {
      console.log(err);
    }
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
            <p className="ml-1 text-base text-center text-primary-pink font-medium">
              The Current market value for your vehicle is RM{" "}
              {numberWithCommas(Number(previousValue))}
            </p>
          </div>
          <div className="mt-4 flex flex-col items-start w-full">
            <h2 className="text-lg text-center text-primary-black font-bold">
              Select your preferred coverage type
            </h2>
            <div className="mt-2 flex flex-col mobile-l:flex-row items-center justify-start w-full">
              <ValuationTypeButton
                value="market"
                title="Market Value"
                selectedValue={type}
                price={market?.vehicleMarketValue.toString() || ""}
                updateValue={handleTypeChange}
              />
              {reconIndicator === "yes" ? (
                <div className="relative even:mt-4 mobile-l:even:mt-0 even:ml-0 mobile-l:even:ml-4 inline-block w-full mobile-l:w-auto">
                  <div className="relative px-4 py-4 flex flex-col items-start justify-center w-full mobile-l:w-[157px] h-auto border border-solid border-[#d3d3d3] opacity-70 cursor-no-drop rounded-xl text-primary-black shadow-[0_8px_10px_0_#00000024]">
                    <span className="text-sm text-center text-current font-bold">
                      Agreed Value
                    </span>
                    <span className="text-base text-left text-current font-normal">
                      Not Available
                    </span>
                  </div>
                </div>
              ) : (
                <ValuationTypeButton
                  selectedValue={type}
                  title="Agreed Value"
                  value="agreed"
                  price={agreed ? agreed.sumInsured : ""}
                  updateValue={handleTypeChange}
                />
              )}
            </div>
          </div>
          <div className="mt-8 flex flex-col items-start w-full">
            <h2 className="mb-2 text-lg text-center text-primary-black font-bold">
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
                    <span className="mb-2 text-base text-center text-primary-black font-semibold">
                      Car Specs
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
                    <span className="mb-2 text-base text-center text-primary-black font-semibold">
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
            <div className="mt-12 flex items-center justify-start gap-x-2 w-full">
              <button
                onClick={() => updateQuotePremium()}
                className="relative mt-4 py-2.5 px-8 flex items-center justify-center w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
              >
                <span className="text-base text-center font-medium text-white">
                  Submit
                </span>
              </button>
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
                is currently worth in the market.
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
                and risk assessment.
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
    <div className="relative even:mt-4 mobile-l:even:mt-0 even:ml-0 mobile-l:even:ml-4 inline-block w-full mobile-l:w-auto h-auto">
      <button
        onClick={() => updateValue(value)}
        className={`relative p-4 flex flex-col items-center justify-center w-full mobile-l:w-[165px] min-h-[82px] h-auto border-4 border-solid rounded-xl outline outline-2 outline-transparent focus-visible:outline-primary-black cursor-pointer ${
          selectedValue === value
            ? "border-[#4B5EAA] text-primary-blue"
            : "border-transparent text-primary-black"
        } shadow-[0_8px_10px_0_#00000024]`}
      >
        <span className="text-base text-center text-current font-bold">
          {title}
        </span>
        {price !== "" ? (
          <span className="text-base text-center text-current font-normal">
            RM {numberWithCommas(Number(price))}
          </span>
        ) : (
          <span className="mt-0.5 text-xs text-center text-current font-normal">
            Select to estimate value
          </span>
        )}
      </button>
    </div>
  );
}

export default MarketAndAgreedContainer;
