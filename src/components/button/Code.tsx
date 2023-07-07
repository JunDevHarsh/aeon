import React, { ChangeEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { addPromoCode } from "../../store/slices/user";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";
import {
  InsuranceContext,
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
import { QuoteListingContext, QuotesTypes } from "../../context/QuoteListing";
import { NewAddOnsContext } from "../../context/AddOnsContext";
import { MultiStepFormContext } from "../../context/MultiFormContext";
import { CredentialContext, CredentialTypes } from "../../context/Credential";
import { LoaderActionTypes, LoaderContext } from "../../context/Loader";
import {
  updateQuotationPremium,
  validatePromoCode,
} from "../../services/apiServices";

type CodeProps = {
  title: string;
  placeholder?: string;
};

const Code: React.FC<CodeProps> = ({ title, placeholder = "Placeholder" }) => {
  const {
    user: { promoCode },
  } = useSelector((state: RootState) => state);

  const {
    state: { isLoading },
    dispatch: loaderDispatch,
  } = useContext(LoaderContext);

  const {
    state: { accountId, inquiryId, vehicleId, requestId, token, session },
    dispatch: credentialDispatch,
  } = useContext(CredentialContext);

  const [state, setState] = useState<{
    code: string;
    error: string | null;
    isValid: boolean;
  }>({
    code: promoCode,
    error: null,
    isValid: promoCode ? true : false,
  });

  const {
    state: { type, market, agreed },
  } = useContext(MarketAndAgreedContext);

  const {
    state: { addOns },
  } = useContext(NewAddOnsContext);

  const {
    store: {
      roadTax,
      addDriverDetails: { selectedDriverType, driverDetails },
    },
  } = useContext(MultiStepFormContext);

  const {
    state: { id: productId, quoteId },
    dispatch: updateInsuranceDispatch,
  } = useContext(InsuranceContext);

  const { dispatch: updateQuote } = useContext(QuoteListingContext);

  const updateStore = useDispatch();

  const { code, error, isValid } = state;

  function handleOnChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.toUpperCase();
    if (value.length > 15) return;
    if (state.error) {
      setState((prev) => ({ ...prev, error: null }));
    }
    setState((prev) => ({ ...prev, code: value }));
  }

  async function handleOnClick() {
    try {
      if (code === "") {
        setState((prev) => ({ ...prev, error: "Enter a code" }));
        return;
      }
      if (token && session) {
        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: true,
        });

        const response = await validatePromoCode(
          session.sessionName,
          requestId,
          code
        );

        if (response.isValid === 1) {
          const { promoid, percent_off } = response;

          updateStore(
            addPromoCode({
              promoCode: code,
              promoId: promoid,
              percentOff: percent_off,
            })
          );

          const addOnsRequest = addOns
            .filter((addOn) => addOn.selectedIndicator)
            .map((addOn) => {
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

          const quoteResponse = await updateQuotationPremium(
            session.sessionName,
            requestId,
            addOnsRequest,
            selectedDriverType === "unlimited" ? "true" : "false",
            selectedDriverType === "unlimited" || driverDetails.length === 0
              ? []
              : driverDetails.map(({ idNo, name }) => ({
                  fullName: name,
                  identityNumber: idNo,
                })),
            type === "market" ? "MV - Market Value" : "AV - Agreed Value",
            type === "market" ? "" : agreed?.avCode || "",
            type === "market"
              ? market.vehicleMarketValue.toString()
              : agreed?.sumInsured || "",
            type === "market" ? market.nvic : agreed?.nvic || "",
            accountId,
            inquiryId,
            productId,
            quoteId,
            vehicleId,
            roadTax ? "1" : "0",
            promoid,
            code,
            percent_off
          );
          updateInsuranceDispatch({
            type: InsuranceProviderTypes.UpdateQuoteId,
            payload: {
              quoteId: quoteResponse.quoteId,
            },
          });

          const { displaypremium, premium } = quoteResponse.quoteinfo;
          updateQuote({
            type: QuotesTypes.UpdateQuoteById,
            payload: {
              productId: productId,
              data: {
                premium,
                displayPremium: displaypremium,
              },
            },
          });
          updateInsuranceDispatch({
            type: InsuranceProviderTypes.UpdateInsuranceProvider,
            payload: {
              companyId: productId,
              companyName: "Allianz",
              price: displaypremium,
            },
          });

          setState((prev) => ({
            ...prev,
            error: null,
            isValid: true,
          }));

          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });

          return;

          return;
        }
        setState((prev) => ({
          ...prev,
          error: "Promo Code is invalid!",
          isValid: false,
        }));

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
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Something went wrong",
      }));

      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });

      console.log(error);
    }
  }

  return (
    <div className="flex items-center justify-start max-w-[365px] w-full h-auto">
      <div className="relative px-2.5 pt-1.5 pb-6 flex flex-col items-start justify-center gap-y-2 w-full h-auto bg-[#EEF4FF] rounded">
        <label
          htmlFor="code"
          className="text-base text-center text-primary-black font-semibold"
        >
          {title}
        </label>
        <div className="flex items-center justify-center w-full">
          <input
            type="text"
            id="code"
            value={code}
            onChange={handleOnChange}
            disabled={isValid}
            aria-disabled={isValid}
            placeholder={placeholder}
            className={`pt-2 pb-1 px-2 w-full text-sm text-left text-primary-black border border-solid ${
              error
                ? "border-red-600 placeholder:text-red-600"
                : "border-[#CFD0D7] placeholder:text-[#9ca9b9]"
            }`}
          />
          {isLoading || isValid ? (
            <div
              className={`${
                isLoading ? "animate-pulse bg-[#4B5EAA]" : "bg-gray-400"
              } px-4 py-1.5 text-sm text-center text-white font-semibold`}
            >
              {isLoading ? "Loading..." : "Applied"}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOnClick}
              className={`px-4 py-1.5 text-sm text-center text-white ${
                isValid ? "bg-gray-400" : "bg-[#4B5EAA]"
              } font-semibold`}
            >
              Apply
            </button>
          )}
        </div>
        {error && (
          <span
            className="absolute bottom-0 left-0 px-4 text-sm text-left font-medium text-red-600"
            role="alert"
          >
            {error}
          </span>
        )}
      </div>
    </div>
  );
};

export default Code;
