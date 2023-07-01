import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Code from "../button/Code";
import { numberWithCommas } from "../container/VehicleCoverage";
import {
  InsuranceContext,
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
// import { VehicleCoverageContext } from "../../context/VehicleCoverage";
// import { updateFinalPrice } from "../../store/slices/insurance";
import { Link } from "react-router-dom";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";
import AllianzImg from "../../assets/images/logo-allianz.png";
import { QuoteListingContext, QuotesTypes } from "../../context/QuoteListing";
import { NewAddOnsContext } from "../../context/AddOnsContext";
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
import axios from "axios";

export interface AddBenefitsType {
  id: string;
  icon: "CarSlideIcon" | "CarAccidentIcon" | "BodyInjuryIcon";
  title: string;
  description: string;
  price: number;
  isSelected: boolean;
}

const SummaryInfoCard = () => {
  //   const [promoCode, setPromoCode] = useState<string>("");
  // const { provider } = useSelector((state: RootState) => state.insurance);
  const [loading, setLoading] = useState<boolean>(false);

  const [promoCode, setPromoCode] = useState<number>(0);
  const {
    state: { addOns, isEdited },
    dispatch,
  } = useContext(NewAddOnsContext);

  const { polExpiryDate, polEffectiveDate } = useSelector(
    (state: RootState) => state.vehicle
  );
  const navigate = useNavigate();
  const {
    state: { name: proName, id },
  } = useContext(InsuranceContext);

  const {
    token: tokenInStore,
    session: sessionInStore,
    requestId,
    inquiryId,
    accountId,
  } = useSelector((state: RootState) => state.credentials);
  const {
    state: { id: productId, quoteId },
    dispatch: updateInsuranceDispatch,
  } = useContext(InsuranceContext);

  const updateStore = useDispatch();

  const {
    state: { quotes },
    dispatch: updateQuote,
  } = useContext(QuoteListingContext);

  const selectedQuotePlan: any = quotes.find((quote) => quote.productId === id);

  const premium = selectedQuotePlan?.premium;
  const selectedQuoteAddOns = selectedQuotePlan?.additionalCover;

  const {
    state: {
      type: valuationType,
      agreed: valuationAgreed,
      market: valuationMarket,
    },
  } = useContext(MarketAndAgreedContext);

  const { pathname } = useLocation();

  const selectedAddOns = addOns.filter((addOn) => addOn.isSelected);

  async function updateQuotePremium() {
    try {
      setLoading(true);
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
            additionalCover:
              selectedAddOns.map((addOn) => ({
                coverCode: addOn.coverCode,
                coverSumInsured: addOn.coverSumInsured,
              })) || [],
            unlimitedDriverInd: "false",
            driverDetails: [],
            sitype:
              valuationType === "market"
                ? "MV - Market Value"
                : "AV - Agreed Value",
            avCode: valuationType === "market" ? "" : valuationAgreed?.avCode,
            sumInsured:
              valuationType === "market"
                ? valuationMarket.vehicleMarketValue.toString()
                : valuationAgreed?.sumInsured,
            nvicCode:
              valuationType === "market"
                ? valuationMarket.nvic
                : valuationAgreed?.nvic,
            accountid: accountId,
            inquiryId: inquiryId,
            insurer: "7x250468",
            productid: productId,
            quoteId: quoteId,
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
          throw {
            status: 301,
            message: "Error updating quote premium, please try again later",
          };
        }
        // const data = quoteResponse.data.result;
        if (quoteResponse.data) {
          // if (quoteResponse.data.result.quoteinfo.length === 0) {
          //   throw new Error("NO_QUOTE_FOUND");
          // }
          const data = quoteResponse.data;
          updateInsuranceDispatch({
            type: InsuranceProviderTypes.UpdateQuoteId,
            payload: {
              quoteId: data.result.quoteId,
            },
          });

          const { premium, displaypremium, additionalCover } =
            data.result.quoteinfo;

          const updatedAdditionalCover = selectedQuoteAddOns.map(
            (selectedQuoteAddOn: any) => {
              const matched = additionalCover.find(
                (additional: any) =>
                  additional.coverCode === selectedQuoteAddOn.coverCode
              );
              return matched ? matched : selectedQuoteAddOn;
            }
          );

          const newAddOnsList = updatedAdditionalCover.map((updatedAddOn: any) => {
            const matched = addOns.find(
              (addOn: any) => addOn.coverCode === updatedAddOn.coverCode
            );
            return matched
              ? {
                  ...matched,
                  displayPremium: updatedAddOn.displayPremium,
                  selectedIndicator: updatedAddOn.selectedIndicator,
                }
              : updatedAddOn;
          });

          updateInsuranceDispatch({
            type: InsuranceProviderTypes.UpdateInsuranceProvider,
            payload: {
              companyId: productId,
              companyName: "Allianz",
              price: displaypremium,
            },
          });

          updateQuote({
            type: QuotesTypes.UpdateQuoteById,
            payload: {
              productId: productId,
              data: {
                premium,
                displaypremium,
                // additionalCover: updatedAdditionalCover,
              },
            },
          });
          dispatch({ addOns: newAddOnsList, isEdited: false });
          setLoading(false);
          return;
        }
        throw {
          status: 302,
          message: "Receiving some error, please try again later",
        };
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  }

  return (
    <div className="mt-8 lg:mt-0 ml-0 lg:ml-8 relative flex flex-col items-center justify-between mobile-l:min-w-[360px] sm:min-w-[375px] max-w-sm w-full h-auto rounded-[20px] shadow-container overflow-hidden">
      <div className="inline-block p-2 w-full bg-[#283CC6]">
        <h3 className="text-xl text-center text-white font-bold">
          Purchase Summary
        </h3>
      </div>
      <div className="relative py-4 px-6 flex flex-col items-center justify-center w-full bg-[#F8F8F8]">
        <div className="flex items-center justify-center w-full">
          <div className="relative flex items-center justify-center w-1/3">
            <img
              src={AllianzImg}
              className="w-auto h-auto"
              alt="allianz-logo-img"
            />
          </div>
          <div className="pl-4 flex flex-col items-start w-2/3">
            <h4 className="text-lg text-center text-primary-black font-semibold">
              {proName || "Insurer"}
            </h4>
            <span className="-mt-2 mb-1 text-base text-center text-primary-black font-normal">
              Motor Comprehensive
            </span>
          </div>
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-center w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Coverage Period
            </span>
            <div className="flex flex-row items-end justify-center flex-wrap text-primary-black w-1/2">
              <span className="text-base text-center font-medium whitespace-nowrap">
                {polEffectiveDate.slice(2).split("-").reverse().join("/") ||
                  "19/01/23"}
              </span>
              <span className="ml-1 text-base text-center font-medium whitespace-nowrap">
                -{" "}
                {polExpiryDate.slice(2).split("-").reverse().join("/") ||
                  "19/01/23"}
              </span>
            </div>
          </div>
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Sum Insured <br />
              <span className="font-medium">
                {" "}
                {`(${
                  valuationType[0].toUpperCase() + valuationType.slice(1) ||
                  "Market"
                } Value)`}
              </span>
            </span>
            <div className="flex items-center justify-end w-1/2">
              <span className="text-base text-left text-primary-black font-medium">
                RM{" "}
                {numberWithCommas(
                  valuationType === "market"
                    ? valuationMarket.vehicleMarketValue
                    : valuationAgreed?.sumInsured
                    ? Number(valuationAgreed?.sumInsured)
                    : 0
                )}
              </span>
              {pathname !== "/insurance/review-pay" && (
                <Link to="/insurance/test" className="ml-1">
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11.4176 3.62363L9.40265 1.60869L10.0439 0.963642C10.2285 0.77909 10.458 0.688793 10.7323 0.692752C11.0066 0.69671 11.2398 0.792215 11.4319 0.979267L12.0664 1.61003C12.2584 1.79957 12.3513 2.02954 12.3451 2.29992C12.3388 2.5703 12.2435 2.79777 12.0589 2.98233L11.4176 3.62363ZM10.7651 4.27614L2.8714 12.1698H0.856445V10.1549L8.7464 2.26494L10.7651 4.27614Z"
                      fill="#A5308A"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-start gap-y-1 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Basic Premium
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM {premium?.basicPremium.toFixed(2) || "0.00"}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              NCD ({premium?.ncdPct || 0}%)
            </span>
            <span className="text-base text-right text-red-500 font-medium w-1/2">
              <span className="font-semibold">-</span> RM{" "}
              {premium?.ncdAmt || "0.00"}
            </span>
          </div>
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-start gap-y-1 w-full">
          <h4 className="text-lg text-center text-primary-black font-bold">
            Add Ons
          </h4>
          {/* {addOns.length === 0 && (
            <div className="flex items-center justify-start w-full">
              <p className="text-base text-center text-primary-black font-medium">
                Addons for this plan are not available
              </p>
            </div>
          )} */}
          {selectedAddOns.length === 0 ? (
            <div className="flex items-center justify-start w-full">
              <p className="text-sm text-left text-primary-black font-medium">
                You may select upto max add ons for better benefits
              </p>
            </div>
          ) : (
            selectedAddOns.map((addOn) => (
              <div
                key={`add-benefit-${addOn.coverCode}`}
                className="flex items-start justify-between w-full"
              >
                <span className="text-base text-left text-primary-black font-base w-1/2">
                  {addOn.title}
                </span>
                <span className="text-base text-right text-primary-black font-medium w-1/2">
                  RM {addOn.displayPremium.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-start gap-y-1 w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-lg text-left text-primary-black font-bold w-1/2">
              Gross Premium
            </span>
            <span className="text-lg text-right text-primary-black font-bold w-1/2">
              RM {premium?.grossPremium || "0.00"}
            </span>
          </div>
          {promoCode !== 0 && (
            <div className="flex items-start justify-between w-full">
              <span className="text-base text-left text-primary-black font-medium w-1/2">
                Discount {`${promoCode}%`}
              </span>
              <span className="text-base text-right text-red-500 font-medium w-1/2">
                <span className="font-semibold">-</span> RM 10.00
              </span>
            </div>
          )}
          <div className="flex items-start justify-between w-full">
            <span className="text-lg text-left text-primary-black font-bold w-1/2">
              Sub Total
            </span>
            <span className="text-lg text-right text-primary-black font-bold w-1/2">
              RM {premium?.grossPremium || 0.0}
            </span>
          </div>
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              Service Tax {`${premium?.serviceTaxPercentage || 0}%`}
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM {premium?.serviceTaxAmount || "0.00"}
            </span>
          </div>
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              Stamp Duty
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM 10.00
            </span>
          </div>
        </div>
        <div className="relative my-2 w-full">
          <Code
            title="Promo Code"
            placeholder="DFS3432"
            validationList={["AEON12"]}
            updateCode={setPromoCode}
          />
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex items-center justify-between w-full">
          <span className="text-xl text-left text-primary-black font-bold w-1/2">
            Total Amount
          </span>
          <span className="text-xl text-right text-primary-black font-bold w-1/2">
            RM {premium?.premiumDue || "0.00"}
          </span>
        </div>
        <div className="mt-4 flex flex-col mobile-xl:flex-row items-center justify-center w-full">
          <Link
            to={
              pathname === "/insurance/plan-add-ons"
                ? "/insurance/plan-selection"
                : pathname === "/insurance/application-details"
                ? "/insurance/plan-add-ons"
                : "/insurance/application-details"
            }
            className="relative mt-2 mobile-xl:mt-0 mr-0 mobile-xl:mr-2 py-2 px-6 flex items-center justify-center order-2 mobile-xl:order-1 min-w-[120px] w-full mobile-xl:w-auto bg-white mobile-xl:bg-primary-blue border-2 mobile-xl:border-0 border-solid border-primary-blue mobile-xl:border-transparent rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
          >
            <span className="text-base text-center font-medium text-primary-blue mobile-xl:text-white">
              Previous
            </span>
          </Link>

          {isEdited ? (
            !loading ? (
              <button
                onClick={() => updateQuotePremium()}
                className="relative py-2 px-6 min-w-[120px] order-1 mobile-xl:order-2 w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
              >
                <span className="text-base text-center font-medium text-white">
                  Update Quote
                </span>
              </button>
            ) : (
              <div className="animate-pulse relative py-2 px-6 min-w-[120px] order-1 mobile-xl:order-2 flex items-center justify-center w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]">
                <span className="text-base text-center font-medium text-white">
                  Loading
                </span>
              </div>
            )
          ) : pathname === "/insurance/review-pay" ? (
            <button
              onClick={() => {
                // updateFinalPriceToStore(updateFinalPrice(totalAmount));
                navigate("/payment");
              }}
              className="relative py-2 px-6 min-w-[120px] order-1 mobile-xl:order-2 flex items-center justify-center w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                Pay Now
              </span>
            </button>
          ) : (
            <Link
              to={
                pathname === "/insurance/plan-add-ons"
                  ? "/insurance/application-details"
                  : "/insurance/review-pay"
              }
              className="relative py-2 px-6 min-w-[120px] flex items-center justify-center order-1 mobile-xl:order-2 w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                {pathname === "/insurance/application-details"
                  ? "Proceed To Confirm"
                  : "Next"}
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryInfoCard;
