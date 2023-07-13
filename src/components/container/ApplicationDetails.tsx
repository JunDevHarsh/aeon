import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  AddOnsTypes,
  MultiStepFormContext,
  RoadTaxTypes,
  TermsAndConditionsTypes,
} from "../../context/MultiFormContext";
import { checkTokenIsExpired } from "../../utils/helpers";
import {
  InsuranceContext,
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";
import { QuoteListingContext, QuotesTypes } from "../../context/QuoteListing";
import { LoaderActionTypes, LoaderContext } from "../../context/Loader";
import { CredentialContext, CredentialTypes } from "../../context/Credential";
import { updateQuotationPremium } from "../../services/apiServices";

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
    },
  } = useSelector((state: RootState) => state);

  const {
    state: { token, session, requestId, inquiryId, accountId, vehicleId },
    dispatch: credentialDispatch,
  } = useContext(CredentialContext);

  const { dispatch: loaderDispatch } = useContext(LoaderContext);

  const {
    store: {
      addDriverDetails: { driverDetails: addDriverDetails, selectedDriverType },
      addOns,
      driverDetails,
      roadTax,
      termsAndConditions,
    },
    dispatch: updateMultiStepFormDispatch,
  } = useContext(MultiStepFormContext);

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
    state: { id: productId, quoteId },
    dispatch: updateInsuranceDispatch,
  } = useContext(InsuranceContext);

  const selectedAddOns = addOns.filter((addOn) => addOn.isSelected);

  const { dispatch: updateQuote } = useContext(QuoteListingContext);

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
      if (session && token) {
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

        const response = await updateQuotationPremium(
          session.sessionName,
          requestId,
          addOnsRequest,
          selectedDriverType === "unlimited" ? "true" : "false",
          selectedDriverType === "unlimited"
            ? []
            : addDriverDetails.map(({ idNo, name, nationality }) => ({
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
              unlimitedDriverInfo: unlimitedDriverInfo,
              additionalCover: additionalCover,
            },
          },
        });

        const updatedAdditionalCover = additionalCover.map((addOn: any) => ({
          ...addOn,
          isSelected: addOn.selectedIndicator,
        }));

        updateMultiStepFormDispatch({
          type: AddOnsTypes.UpdateAddOnList,
          payload: {
            updatedAddOns: updatedAdditionalCover,
          },
        });

        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: false,
        });
        return;
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
              {valuationType === "market"
                ? valuationMarket?.vehicleVariant
                : valuationAgreed?.variant}
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
              {dateOfBirth?.toString().split("-").reverse().join("-") ||
                "20-12-2023"}
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
              Address 1
            </span>
            <span className="text-base text-left text-primary-black font-normal w-full break-words">
              {driverDetails.address1 || "376, Jalan Merak 16"}
            </span>
          </div>
          {driverDetails.address2 !== "" && (
            <div className="flex flex-col items-start w-full">
              <span className="text-base text-left text-primary-black font-bold">
                Address 2
              </span>
              <span className="text-base text-left text-primary-black font-normal w-full break-words">
                {driverDetails.address2 || "376, Jalan Merak 16"}
              </span>
            </div>
          )}
          {driverDetails.address3 !== "" && (
            <div className="flex flex-col items-start w-full">
              <span className="text-base text-left text-primary-black font-bold">
                Address 3
              </span>
              <span className="text-base text-left text-primary-black font-normal w-full break-words">
                {driverDetails.address3 || "376, Jalan Merak 16"}
              </span>
            </div>
          )}
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
