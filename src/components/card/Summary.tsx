import { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
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
import { SHA256, checkTokenIsExpired } from "../../utils/helpers";
import {
  AddDriverTypes,
  DriverTypes,
  MultiStepFormContext,
} from "../../context/MultiFormContext";
import { CredentialContext, CredentialTypes } from "../../context/Credential";
import { LoaderActionTypes, LoaderContext } from "../../context/Loader";
import {
  updateInsured,
  updateQuotationPremium,
} from "../../services/apiServices";

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
  const {
    state: { addOns, isEdited },
    dispatch,
  } = useContext(NewAddOnsContext);

  const {
    state: { session, token, requestId, inquiryId, accountId, vehicleId },
    dispatch: credentialDispatch,
  } = useContext(CredentialContext);

  const {
    state: { isLoading },
    dispatch: loaderDispatch,
  } = useContext(LoaderContext);

  const {
    vehicle: { polExpiryDate, polEffectiveDate },
    user: { promoCode, promoId, percentOff },
  } = useSelector((state: RootState) => state);

  const navigate = useNavigate();
  const {
    state: { name: proName, id: productId, quoteId },
    dispatch: updateInsuranceDispatch,
  } = useContext(InsuranceContext);

  const {
    store: {
      driverDetails: {
        name,
        email,
        mobileNumber,
        nationality,
        address1,
        address2,
        address3,
        postalCode,
        race,
        occupation,
        occupationOthers,
        drivingExp,
        state,
        city,
      },
      addDriverDetails: { shouldUpdate, selectedDriverType, driverDetails },
      roadTax,
      termsAndConditions,
    },
    dispatch: updateMultiFormState,
  } = useContext(MultiStepFormContext);

  // const updateStore = useDispatch();

  const {
    state: { quotes },
    dispatch: updateQuote,
  } = useContext(QuoteListingContext);

  const selectedQuotePlan: any = quotes.find(
    (quote) => quote.productId === productId
  );

  const premium = selectedQuotePlan?.premium;
  const selectedQuoteAddOns = selectedQuotePlan?.additionalCover;
  const unlimitedDriverInfo = selectedQuotePlan?.unlimitedDriverInfo;

  const {
    state: {
      type: valuationType,
      agreed: valuationAgreed,
      market: valuationMarket,
    },
  } = useContext(MarketAndAgreedContext);

  const { pathname } = useLocation();

  const selectedAddOns = addOns.filter((addOn) => addOn.isSelected);

  const signatureHash = SHA256(`3jeL1HvYCEM16391${inquiryId}100MYR`);

  async function updateQuotePremium() {
    try {
      if (token && session) {
        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: true,
        });

        const isTokenExpired = checkTokenIsExpired(token);

        if (isTokenExpired) {
          credentialDispatch({
            type: CredentialTypes.ToggleTokenHasExpired,
            payload: true,
          });

          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });

          return;
        }

        let foundErrors = false;

        const updated = driverDetails.map((driver) => {
          const errors: any = {};
          if (!driver.idNo || driver.idNo === "") {
            foundErrors = true;
            errors.idNo = "Enter a valid Id number";
          }
          if (!driver.idType || driver.idType === null) {
            foundErrors = true;
            errors.idType = "Select ID type";
          }
          if (driver.name === "") {
            foundErrors = true;
            errors.name = "Please enter your name";
          }
          if (!driver.nationality || driver.nationality === null) {
            foundErrors = true;
            errors.nationality = "Please select nationality";
          }
          return {
            ...driver,
            errors: errors,
          };
        });

        if (foundErrors) {
          updateMultiFormState({
            type: AddDriverTypes.AddErrors,
            payload: {
              updatedDrivers: updated,
            },
          });
          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });
          return;
        }

        const addOnsRequest = selectedAddOns.map((addOn: any) => {
          let request: any = {};
          request.coverCode = addOn.coverCode;
          request.coverSumInsured = addOn.coverSumInsured;
          if (addOn.coverCode === "PAB-ERW") {
            if (addOn.moredetail?.options instanceof Array) {
              request.planCode = addOn.moredetail?.options.find(
                (option: any) =>
                  option.value === addOn.coverSumInsured.toString()
              )?.code;
            }
          }
          return request;
        });

        // const quoteResponse = await axios.post(
        //   "https://app.agiliux.com/aeon/webservice.php",
        //   {
        //     element: JSON.stringify({
        //       requestId: requestId,
        //       tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
        //       class: "Private Vehicle",
        //       additionalCover: addOnsRequest || [],
        //       unlimitedDriverInd:
        //         selectedDriverType === "unlimited" ? "true" : "false",
        //       driverDetails:
        //         selectedDriverType === "unlimited" || driverDetails.length === 0
        //           ? []
        //           : driverDetails.map(({ idNo, name }) => ({
        //               fullName: name,
        //               identityNumber: idNo,
        //             })),
        //       sitype:
        //         valuationType === "market"
        //           ? "MV - Market Value"
        //           : "AV - Agreed Value",
        //       avCode: valuationType === "market" ? "" : valuationAgreed?.avCode,
        //       sumInsured:
        //         valuationType === "market"
        //           ? valuationMarket.vehicleMarketValue.toString()
        //           : valuationAgreed?.sumInsured,
        //       nvicCode:
        //         valuationType === "market"
        //           ? valuationMarket.nvic
        //           : valuationAgreed?.nvic,
        //       accountid: accountId,
        //       inquiryId: inquiryId,
        //       insurer: "7x250468",
        //       productid: productId,
        //       quoteId: quoteId,
        //       vehicleId: vehicleId,
        //       roadtax: roadTax ? "1" : "0",
        //       promoid: promoId,
        //       promocode: promoCode,
        //       percent_off: percentOff,
        //     }),
        //     operation: "updateQuote",
        //     sessionName: session.sessionName,
        //   },
        //   {
        //     headers: {
        //       "Content-Type": "application/x-www-form-urlencoded",
        //     },
        //   }
        // );

        const response = await updateQuotationPremium(
          session.sessionName,
          requestId,
          addOnsRequest,
          selectedDriverType === "unlimited" ? "true" : "false",
          selectedDriverType === "unlimited" || driverDetails.length === 0
            ? []
            : driverDetails.map(({ idNo, name, nationality }) => ({
                fullName: name,
                identityNumber: idNo,
                nationality: nationality,
              })),
          valuationType === "market"
            ? "MV - Market Value"
            : "AV - Agreed Value",
          valuationType === "market" ? "" : valuationAgreed?.avCode || "",
          valuationType === "market"
            ? valuationMarket.vehicleMarketValue.toString()
            : valuationAgreed?.sumInsured || "",
          valuationType === "market"
            ? valuationMarket.nvic
            : valuationAgreed?.nvic || "",
          accountId,
          inquiryId,
          productId,
          quoteId,
          vehicleId,
          roadTax ? "1" : "0",
          promoId,
          promoCode,
          percentOff
        );

        updateInsuranceDispatch({
          type: InsuranceProviderTypes.UpdateQuoteId,
          payload: {
            quoteId: response.quoteId,
          },
        });

        const {
          premium,
          displaypremium,
          additionalCover,
          unlimitedDriverInfo,
        } = response.quoteinfo;

        const updatedAdditionalCover = selectedQuoteAddOns.map(
          (selectedQuoteAddOn: any) => {
            const matched = additionalCover.find(
              (additional: any) =>
                additional.coverCode === selectedQuoteAddOn.coverCode
            );
            return matched ? matched : selectedQuoteAddOn;
          }
        );

        const newAddOnsList = updatedAdditionalCover.map(
          (updatedAddOn: any) => {
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
          }
        );

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
              displayPremium: displaypremium,
              unlimitedDriverInfo: unlimitedDriverInfo,
              // additionalCover: updatedAdditionalCover,
            },
          },
        });

        dispatch({ addOns: newAddOnsList, isEdited: false });

        if (shouldUpdate) {
          updateMultiFormState({
            type: AddDriverTypes.SubmitAddDriverDetails,
            payload: {},
          });
        }

        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: false,
        });
        return;
      }
      credentialDispatch({
        type: CredentialTypes.ToggleTokenHasExpired,
        payload: true,
      });
    } catch (err) {
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });
      console.log(err);
    }
  }

  async function updateClient() {
    try {
      if (token && session) {
        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: true,
        });

        const isTokenExpired = checkTokenIsExpired(token);

        if (isTokenExpired) {
          credentialDispatch({
            type: CredentialTypes.ToggleTokenHasExpired,
            payload: true,
          });

          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });

          return;
        }

        let hasErrors = false;
        let errors: any = {};

        if (!name || name === "") {
          hasErrors = true;
          errors.name = "Field can't be empty";
        }
        if (!nationality || nationality === "") {
          hasErrors = true;
          errors.nationality = "Select your nationality";
        }
        if (!race || race === "") {
          hasErrors = true;
          errors.race = "Select your race";
        }

        if (!occupation || occupation === "") {
          hasErrors = true;
          errors.occupation = "Select your occupation";
        }

        if (occupation === "Others") {
          if (!occupationOthers || occupationOthers === "") {
            hasErrors = true;
            errors.occupationOthers = "Field can't be empty";
          }
        }

        if (!drivingExp || drivingExp === "") {
          hasErrors = true;
          errors.drivingExp = "Field can't be empty";
        }

        if (address1 === "") {
          hasErrors = true;
          errors.address1 = "Field can't be empty";
        }

        if (state === "") {
          hasErrors = true;
          errors.state = "Field can't be empty";
        }

        if (city === "") {
          hasErrors = true;
          errors.city = "Field can't be empty";
        }

        if (hasErrors) {
          updateMultiFormState({
            type: DriverTypes.AddDriverInfoErrors,
            payload: {
              updatedValues: errors,
            },
          });

          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });
          return;
        }

        const updateClientResponse = await updateInsured(
          session.sessionName,
          requestId,
          name,
          nationality,
          race,
          occupation,
          occupationOthers,
          drivingExp,
          address1,
          address2,
          address3,
          state,
          city,
          accountId,
          postalCode
        );

        console.log(updateClientResponse.message);

        navigate("/insurance/review-pay");
        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: false,
        });
      } else {
        credentialDispatch({
          type: CredentialTypes.ToggleTokenHasExpired,
          payload: true,
        });
      }
    } catch (err) {
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });
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
                <Link to="/insurance/market-agreed-value" className="ml-1">
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
          {selectedAddOns.length === 0 && selectedDriverType === "" ? (
            <div className="flex items-center justify-start w-full">
              <p className="text-sm text-left text-primary-black font-medium">
                You may select upto max add ons for better benefits
              </p>
            </div>
          ) : (
            <>
              {selectedAddOns.map((addOn) => (
                <div
                  key={`add-benefit-${addOn.coverCode}`}
                  className="flex items-start justify-between w-full"
                >
                  <span className="text-base text-left text-primary-black font-base w-3/4">
                    {addOn.title}
                  </span>
                  <span className="text-base text-right text-primary-black font-medium w-1/4">
                    RM {addOn.displayPremium.toFixed(2)}
                  </span>
                </div>
              ))}
              {selectedDriverType !== "" && (
                <div className="flex items-start justify-between w-full">
                  <span className="text-base text-left text-primary-black font-base w-1/2">
                    Additional Driver
                    {` (${
                      selectedDriverType[0].toUpperCase() +
                      selectedDriverType.slice(1)
                    } Drivers)`}
                  </span>
                  <span className="text-base text-right text-primary-black font-medium w-1/2">
                    RM {unlimitedDriverInfo?.amount || "0"}.00
                  </span>
                </div>
              )}
            </>
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
          {premium?.promoamount && (
            <div className="flex items-start justify-between w-full">
              <span className="text-base text-left text-primary-black font-medium w-1/2">
                Discount {`${percentOff}%`}
              </span>
              <span className="text-base text-right text-red-500 font-medium w-1/2">
                <span className="font-semibold">-</span> RM{" "}
                {premium?.promoamount || "0.00"}
              </span>
            </div>
          )}
          <div className="flex items-start justify-between w-full">
            <span className="text-lg text-left text-primary-black font-bold w-1/2">
              Sub Total
            </span>
            <span className="text-lg text-right text-primary-black font-bold w-1/2">
              RM{" "}
              {!premium?.promoamount
                ? premium?.grossPremium
                : (premium?.grossPremium - premium?.promoamount).toFixed(2) ||
                  0.0}
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
          <Code title="Promo Code" placeholder="DFS3432" />
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex items-center justify-between w-full">
          <span className="text-xl text-left text-primary-black font-bold w-1/2">
            Total Amount
          </span>
          <span className="text-xl text-right text-primary-black font-bold w-1/2">
            RM {premium?.premiumDue?.toFixed(2) || "0.00"}
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

          {isEdited || shouldUpdate ? (
            !isLoading ? (
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
            !termsAndConditions ? (
              <div className="relative py-2 px-6 min-w-[120px] order-1 mobile-xl:order-2 flex items-center justify-center w-full mobile-xl:w-auto bg-gray-500 rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]">
                <span className="text-base text-center font-medium text-white">
                  Pay Now
                </span>
              </div>
            ) : (
              <form
                method="POST"
                name="ePayment"
                action="https://payment.ipay88.com.my/ePayment/entry.asp"
                className="order-1 mobile-xl:order-2 w-full mobile-xl:w-auto"
              >
                <input type="hidden" name="MerchantCode" value="M16391" />
                <input type="hidden" name="PaymentId" value="" />
                <input type="hidden" name="RefNo" value={inquiryId} />
                <input type="hidden" name="Amount" value="1.00" />
                <input type="hidden" name="Currency" value="MYR" />
                <input
                  type="hidden"
                  name="ProdDesc"
                  value="MotorCar Policy Purchase"
                />
                <input type="hidden" name="UserName" value={name} />
                <input type="hidden" name="UserEmail" value={email} />
                <input type="hidden" name="UserContact" value={mobileNumber} />
                <input type="hidden" name="Remark" value="" />
                <input type="hidden" name="Lang" value="UTF-8" />
                <input type="hidden" name="SignatureType" value="SHA256" />
                <input type="hidden" name="Signature" value={signatureHash} />
                <input
                  type="hidden"
                  name="ResponseURL"
                  value="https://portal.agiliux.com/payment"
                />
                <input
                  type="hidden"
                  name="BackendURL"
                  value="https://app.agiliux.com/aeon"
                />
                <input
                  type="submit"
                  name="Submit"
                  value="Pay Now"
                  className="relative py-2 px-6 min-w-[120px] text-base text-center font-medium text-white w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full cursor-pointer shadow-[0_1px_2px_0_#C6E4F60D]"
                />
                {/* <span className="text-base text-center font-medium text-white">
                    Pay Now
                  </span> */}
                {/* </input> */}
                {/* <input
                type="submit"
                value="Proceed with Payment"
                name="Submit"
              /> */}
              </form>
            )
          ) : (
            <button
              onClick={() => {
                if (pathname === "/insurance/plan-add-ons") {
                  navigate("/insurance/application-details");
                } else if (pathname === "/insurance/application-details") {
                  updateClient();
                  // navigate("/insurance/review-pay");
                } else {
                  navigate("/insurance/payment");
                }
              }}
              className="relative py-2 px-6 min-w-[120px] flex items-center justify-center order-1 mobile-xl:order-2 w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                {pathname === "/insurance/application-details"
                  ? "Proceed To Confirm"
                  : "Next"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryInfoCard;
