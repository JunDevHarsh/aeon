import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  MultiStepFormContext,
  RoadTaxTypes,
  TermsAndConditionsTypes,
} from "../../context/MultiFormContext";
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
import { NewAddOnsContext } from "../../context/AddOnsContext";
import axios from "axios";
import {
  InsuranceContext,
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";
import { QuoteListingContext, QuotesTypes } from "../../context/QuoteListing";

const ApplicationDetailsContainer = () => {
  const {
    user: {
      id,
      gender,
      maritalStatus,
      dateOfBirth,
      promoCode,
      promoId,
      percentOff,
    },
    vehicle: {
      vehicleLicenseId: regNo,
      vehicleMake: make,
      vehicleModel: model,
      yearOfManufacture,
      vehicleEngine: engineNo,
      vehicleChassis: chasisNo,
      variant,
    },
    credentials: {
      token: tokenInStore,
      session: sessionInStore,
      requestId,
      inquiryId,
      accountId,
      vehicleId,
    },
  } = useSelector((state: RootState) => state);

  const updateStore = useDispatch();

  const {
    store: {
      addDriverDetails: { driverDetails: addDriverDetails, selectedDriverType },
      driverDetails,
      roadTax,
      termsAndConditions,
    },
    dispatch: updateMultiStepFormDispatch,
  } = useContext(MultiStepFormContext);

  const [_, setLoading] = useState<boolean>(false);

  const renderRef = useRef<boolean>(false);

  const { name, mobileNumber, email } = driverDetails;

  const driverInfo = addDriverDetails.filter(
    (driver) =>
      driver.name || driver.relationship || driver.idType || driver.idNo
  );

  const {
    state: {
      type: valuationType,
      agreed: valuationAgreed,
      market: valuationMarket,
    },
  } = useContext(MarketAndAgreedContext);

  const {
    state: { addOns },
    dispatch,
  } = useContext(NewAddOnsContext);

  const {
    state: { id: productId, quoteId },
    dispatch: updateInsuranceDispatch,
  } = useContext(InsuranceContext);

  const selectedAddOns = addOns.filter((addOn) => addOn.isSelected);

  const {
    state: { quotes },
    dispatch: updateQuote,
  } = useContext(QuoteListingContext);

  const selectedQuotePlan: any = quotes.find(
    (quote) => quote.productId === productId
  );

  const selectedQuoteAddOns = selectedQuotePlan?.additionalCover;

  function updateRoadTaxOnChange() {
    renderRef.current = true;
    updateMultiStepFormDispatch({
      type: RoadTaxTypes.UpdateRoadTax,
      payload: {
        roadTax: !roadTax,
      },
    });
  }

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

      const addOnsRequest = selectedAddOns.map((addOn: any) => {
        let request: any = {};
        request.coverCode = addOn.coverCode;
        request.coverSumInsured = addOn.coverSumInsured;
        if (addOn.coverCode === "PAB-ERW") {
          if (addOn.moredetail?.options instanceof Array) {
            request.planCode = addOn.moredetail?.options.find(
              (option: any) => option.value === addOn.coverSumInsured.toString()
            )?.code;
          }
        }
        return request;
      });

      const quoteResponse = await axios.post(
        "https://app.agiliux.com/aeon/webservice.php",
        {
          element: JSON.stringify({
            requestId: requestId,
            tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
            class: "Private Vehicle",
            additionalCover: addOnsRequest || [],
            unlimitedDriverInd:
              selectedDriverType === "unlimited" ? "true" : "false",
            driverDetails:
              selectedDriverType === "unlimited" ||
              addDriverDetails.length === 0
                ? []
                : addDriverDetails.map(({ idNo, name }) => ({
                    fullName: name,
                    identityNumber: idNo,
                  })),
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
            vehicleId: vehicleId,
            roadtax: roadTax ? "1" : "0",
            promoid: promoId,
            promocode: promoCode,
            percent_off: percentOff,
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

  useEffect(() => {
    if (renderRef.current) {
      updateQuotePremium();
      renderRef.current = false;
    }
  }, [roadTax]);

  return (
    <div className="relative max-w-xl w-full">
      <div className="flex flex-col items-start w-full">
        <h2 className="text-xl text-center text-primary-black font-bold">
          Vehicle Details
        </h2>
        <div className="mt-2 px-6 py-4 grid grid-cols-1 mobile-xl:grid-cols-2 md:grid-cols-3 gap-4 w-full bg-[#fcf6ff] rounded-lg">
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Car Registration No
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {regNo}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Car Make
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {make ?? "Honda"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Car Model
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {model ?? "Honda HRV"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Manufacture Year
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {yearOfManufacture}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Engine No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {engineNo}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Chassis No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {chasisNo}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto col-span-1 mobile-xl:col-span-2 md:col-span-3">
            <span className="text-base text-left text-primary-black font-bold">
              Variant
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {variant?.vehicleVariant ?? "Honda HRV X3"}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex flex-col items-start w-full">
        <h2 className="text-xl text-center text-primary-black font-bold">
          Insured Details
        </h2>
        <div className="mt-2 px-6 py-4 grid grid-cols-1 mobile-xl:grid-cols-2 md:grid-cols-3 gap-4 w-full bg-[#fcf6ff] rounded-lg">
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-left text-primary-black font-bold">
              Name
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              {name || "Usertest"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              ID No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {id.number || "897678888"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              DOB
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {dateOfBirth?.toString()?.slice(0, 10) || "09/09/1994"}
            </span>
          </div>
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-left text-primary-black font-bold">
              Mobile No.
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              +60 {mobileNumber || "12345687"}
            </span>
          </div>
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-left text-primary-black font-bold">
              Email
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              {email || "ajay@gmail.com"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Marital Status
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {maritalStatus || "Single"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Gender
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {gender || "Male"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Driving Experience
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {driverDetails.drivingExp || 10} Years
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Nationality
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {driverDetails.nationality || "Malaysia"}
            </span>
          </div>
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-left text-primary-black font-bold">
              Address
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              {driverDetails.address1 || "376, Jalan Merak 16"}
            </span>
          </div>
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-left text-primary-black font-bold">
              State
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              {driverDetails.state || "Negeri Sembilan"}
            </span>
          </div>
          <div className="flex flex-col items-start w-full">
            <span className="text-base text-left text-primary-black font-bold">
              City
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              {driverDetails.city || "Seremban"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Postal Code
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {driverDetails.postalCode || "7500"}
            </span>
          </div>
        </div>
      </div>
      {driverInfo.length !== 0 && (
        <div className="mt-2 flex flex-col items-start w-full">
          <h2 className="text-xl text-center text-primary-black font-bold">
            Additional Driver Details
          </h2>
          <div className="flex flex-col items-start justify-start gap-y-2 w-full">
            {driverInfo.map((detail, index) => (
              <div
                key={detail.id}
                className="relative mt-2 w-full bg-[#fcf6ff] rounded-lg"
              >
                <h3 className="px-4 pt-3 text-lg text-left text-primary-black font-bold">
                  Additional Driver {index + 1}
                </h3>
                <div className="px-6 py-2 grid grid-cols-1 mobile-xl:grid-cols-2 md:grid-cols-3 gap-4 w-full rounded-lg">
                  <div className="flex flex-col items-start w-full">
                    <span className="text-base text-left text-primary-black font-bold">
                      Name
                    </span>
                    <span className="text-base text-left text-primary-black font-normal w-full break-words">
                      {detail.name}
                    </span>
                  </div>
                  {/* <div className="flex flex-col items-start w-auto">
                    <span className="text-base text-left text-primary-black font-bold">
                      Relationship
                    </span>
                    <span className="text-base text-left text-primary-black font-normal">
                      {detail.relationship}
                    </span>
                  </div> */}
                  <div className="flex flex-col items-start w-auto">
                    <span className="text-base text-left text-primary-black font-bold">
                      ID Type
                    </span>
                    <span className="text-base text-left text-primary-black font-normal">
                      {detail.idType}
                    </span>
                  </div>
                  <div className="flex flex-col items-start w-auto">
                    <span className="text-base text-left text-primary-black font-bold">
                      ID No.
                    </span>
                    <span className="text-base text-left text-primary-black font-normal">
                      {detail.idNo}
                    </span>
                  </div>
                  <div className="flex flex-col items-start w-auto">
                    <span className="text-base text-left text-primary-black font-bold">
                      Nationality
                    </span>
                    <span className="text-base text-left text-primary-black font-normal">
                      {detail.nationality}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-4 flex flex-col items-start justify-start w-full">
        <div className="relative flex items-center justify-center">
          <label
            htmlFor="roadTax"
            className="relative flex items-start justify-center w-auto cursor-pointer"
          >
            <input
              type="checkbox"
              id="roadTax"
              onChange={updateRoadTaxOnChange}
              className="peer absolute -z-10 opacity-0"
              checked={roadTax}
            />
            {roadTax ? (
              <span className="mt-1.5 peer-focus-visible:outline rounded-sm">
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.975 12.975L15.2 5.725L14.125 4.65L7.975 10.825L5 7.85L3.925 8.925L7.975 12.975ZM2 18C1.6 18 1.25 17.85 0.95 17.55C0.65 17.25 0.5 16.9 0.5 16.5V1.5C0.5 1.1 0.65 0.75 0.95 0.45C1.25 0.15 1.6 0 2 0H17C17.4 0 17.75 0.15 18.05 0.45C18.35 0.75 18.5 1.1 18.5 1.5V16.5C18.5 16.9 18.35 17.25 18.05 17.55C17.75 17.85 17.4 18 17 18H2Z"
                    fill="#4B5EAA"
                  />
                </svg>
              </span>
            ) : (
              <span className="inline-block mt-1.5 w-[19px] h-[18px] bg-white border border-solid border-primary-blue rounded-sm cursor-pointer peer-focus-visible:outline" />
            )}
            <div className="ml-3 flex flex-col items-start w-auto">
              <span className="text-base text-center text-primary-black font-medium">
                Do you want to include road tax?
              </span>
              <span className="text-sm text-left text-primary-pink font-medium">
                Our service representative will contact for road tax renewal
              </span>
            </div>
          </label>
        </div>
        <div className="relative mt-4 flex items-start">
          <label
            htmlFor="termsAndConditions"
            className="relative flex items-start justify-center w-auto cursor-pointer"
          >
            <input
              type="checkbox"
              id="termsAndConditions"
              className="peer absolute -z-10 opacity-0"
              checked={termsAndConditions}
              onChange={() => {
                updateMultiStepFormDispatch({
                  type: TermsAndConditionsTypes.UpdateTermsAndConditions,
                  payload: {
                    termsAndConditions: !termsAndConditions,
                  },
                });
              }}
            />
            {termsAndConditions ? (
              <span className="mt-1.5 peer-focus-visible:outline rounded-sm">
                <svg
                  width="19"
                  height="18"
                  viewBox="0 0 19 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.975 12.975L15.2 5.725L14.125 4.65L7.975 10.825L5 7.85L3.925 8.925L7.975 12.975ZM2 18C1.6 18 1.25 17.85 0.95 17.55C0.65 17.25 0.5 16.9 0.5 16.5V1.5C0.5 1.1 0.65 0.75 0.95 0.45C1.25 0.15 1.6 0 2 0H17C17.4 0 17.75 0.15 18.05 0.45C18.35 0.75 18.5 1.1 18.5 1.5V16.5C18.5 16.9 18.35 17.25 18.05 17.55C17.75 17.85 17.4 18 17 18H2Z"
                    fill="#4B5EAA"
                  />
                </svg>
              </span>
            ) : (
              <span className="inline-block mt-1.5 min-w-[19px] h-[18px] bg-white border border-solid border-primary-blue rounded-sm cursor-pointer peer-focus-visible:outline" />
            )}
            {/* checked checkbox */}

            <p className="ml-3 text-base text-left text-primary-black font-medium">
              By clicking the "Pay Now" button, I/we hereby consent to the
              processing of the Personal Data provided subject to the following
              <a
                href="https://aeoninsurance.com.my/privacy-policy/"
                about="AEON Privacy Link"
                target="_blank"
                rel="noreferrer noopener"
                className="text-secondary-pink"
              >
                {` AEON PDPA Notice `}
              </a>
              and
              <a
                href="https://aeoninsurance.com.my/terms-and-conditions/"
                about="AEON T&C Link"
                target="_blank"
                rel="noreferrer noopener"
                className="text-secondary-pink"
              >
                {` Terms and Conditions`}
              </a>
              , read and accept the{" "}
              <a
                href=""
                about="Insurance's PDPA Notice"
                target="_blank"
                rel="noreferrer noopener"
                className="text-secondary-pink"
              >
                {` Insurance's PDPA Notice`}
              </a>
              .
            </p>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsContainer;
