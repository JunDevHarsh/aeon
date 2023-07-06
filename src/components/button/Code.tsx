import React, { ChangeEvent, useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  checkPromoCode,
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
import { addPromoCode } from "../../store/slices/user";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";
import axios from "axios";
import {
  InsuranceContext,
  InsuranceProviderTypes,
} from "../../context/InsuranceContext";
import { QuoteListingContext, QuotesTypes } from "../../context/QuoteListing";
import { NewAddOnsContext } from "../../context/AddOnsContext";
import { MultiStepFormContext } from "../../context/MultiFormContext";
import { CredentialContext } from "../../context/Credential";
import { LoaderActionTypes, LoaderContext } from "../../context/Loader";

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
    store: { roadTax },
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
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: true,
      });

      let tokenInfo = token;
      let sessionInfo = session;

      if (
        tokenInfo === null ||
        sessionInfo === null ||
        checkTokenIsExpired(tokenInfo)
      ) {
        const getToken: TokenType = await generateToken(
          "https://app.agiliux.com/aeon/webservice.php?operation=getchallenge&username=admin",
          10000
        );
        tokenInfo = getToken;
        updateStore(addToken({ ...getToken }));
        const sessionApiResponse: SessionType = await generateSessionName(
          "https://app.agiliux.com/aeon/webservice.php",
          10000,
          tokenInfo.token,
          "bwJrIhxPdfsdialE"
        );
        sessionInfo = sessionApiResponse;
        // update credentials context with new token and session
        updateStore(
          addSessionName({
            userId: sessionApiResponse.userId,
            sessionName: sessionApiResponse.sessionName,
          })
        );
      }

      const apiResponse = await checkPromoCode(
        "https://app.agiliux.com/aeon/webservice.php",
        10000,
        sessionInfo.sessionName,
        requestId,
        code
      );
      if (apiResponse.isValid === 1) {
        const { promoid, percent_off } = apiResponse;

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

        const quoteResponse = await axios.post(
          "https://app.agiliux.com/aeon/webservice.php",
          {
            element: JSON.stringify({
              requestId: requestId,
              tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
              class: "Private Vehicle",
              additionalCover: addOnsRequest,
              unlimitedDriverInd: "false",
              driverDetails: [],
              sitype:
                type === "market" ? "MV - Market Value" : "AV - Agreed Value",
              avCode: type === "market" ? "" : agreed?.avCode,
              sumInsured:
                type === "market"
                  ? market.vehicleMarketValue.toString()
                  : agreed?.sumInsured,
              nvicCode: type === "market" ? market.nvic : agreed?.nvic,
              accountid: accountId,
              inquiryId: inquiryId,
              insurer: "7x250468",
              productid: productId,
              quoteId: quoteId,
              vehicleId: vehicleId,
              roadtax: roadTax ? "1" : "0",
              promoid: promoid,
              promocode: code,
              percent_off: percent_off,
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
            const data = quoteResponse.data.result;
            updateInsuranceDispatch({
              type: InsuranceProviderTypes.UpdateQuoteId,
              payload: {
                quoteId: data.quoteId,
              },
            });

            const { displaypremium, premium } = data.quoteinfo;
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
          }
          throw {
            status: 302,
            message: "Receiving some error, please try again later",
          };
        }

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
