import { useEffect, useState, useContext, useRef } from "react";
import SelectMultiSearch from "../fields/SelectMultiSearch";
import SelectDropdown from "../fields/SelectDropdown";
import QuoteListingPlanCard from "../card/QuoteListingPlan";
// import QuoteComparePopup from "../popup/QuoteCompare";
import DefaultPopup, { WarningPopupType } from "../popup/Default";
import {
  QuoteListingContext,
  QuotesTypes,
} from "../../context/QuoteListing";
import { InsurerQuoteStateType, QuotesFilterType } from "../../context/types";
// import QuoteComparisonPopup from "../popup/QuoteComparison";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";

export interface PlanType {
  value: string;
  label: string;
  isSelected: boolean;
}

// productId: string;
//   insurerId: string;
//   insurerName: string;
//   logoName: string;
//   planType: string;
//   displayPremium: string;
//   popular: boolean;
//   benefits: string[];
//   additionalCover: [];
//   premium: any;

export type QuotePlansType = {
  productId: string;
  insurerId: string;
  insu: string;
  companyImgHref: string;
  companyRelImgHref: string;
  planType: string;
  price: string;
  isTrending: boolean;
  isSelected: boolean;
  coverages: Record<string, Coverage>;
};

export interface Coverage {
  id: string;
  body: string;
}

const defaultSortOptions = [
  {
    value: "high-to-low",
    label: "High to Low",
  },
  {
    value: "low-to-high",
    label: "Low to High",
  },
];

// list of options for plan type
const defaultPlanTypeOptions: PlanType[] = [
  { value: "comprehensive", label: "Comprehensive", isSelected: true },
  {
    value: "third-party",
    label: "Third Party, Fire and Theft",
    isSelected: false,
  },
];

const QuoteListingsContainer = () => {
  // state for managing the list of quote plans
  // fetched from the agiliux backend system
  // const [quotePlans, updateQuotePlans] = useState<QuotePlansType[]>(quotes);
  const { session, requestId } = useSelector(
    (state: RootState) => state.credentials
  );
  const {
    state: { type, market, agreed },
  } = useContext(MarketAndAgreedContext);
  const {
    state: { quotes: insurerQuotes },
    dispatch,
  } = useContext(QuoteListingContext);

  const [filter, setFilter] = useState<QuotesFilterType>({
    sort: null,
    plan: [
      { value: "comprehensive", label: "Comprehensive", isSelected: true },
      {
        value: "third-party",
        label: "Third Party, Fire and Theft",
        isSelected: false,
      },
    ],
  });

  const [quotePlans, updateQuotePlans] = useState<InsurerQuoteStateType[]>([]);

  // console.log(type, market, agreed);
  const [isComparePopupVisible, shouldComparePopupVisible] =
    useState<boolean>(false);
  const [warngingPopup, setWarningPopup] = useState<WarningPopupType>({
    isVisible: false,
    title: null,
    description: null,
  });

  const [error, setError] = useState<{
    code: string;
    message: string;
    description: string;
  } | null>(null);

  const setTypeOfFilter = (updatedFilterTypes: PlanType[]) => {
    // updateQuoteFilter((prev) => ({ ...prev, type: updatedFilterTypes }));
    setFilter((prev) => ({ ...prev, plan: updatedFilterTypes }));
  };

  // update the sort property of the filter
  const setSortValueToFilter = (val: string) => {
    // updateQuoteFilter((prev) => ({ ...prev, sort: val }));
    setFilter((prev) => ({ ...prev, sort: val }));
  };

  // function to update selected quotes when user
  // try to compare different plans
  function updateSelectedQuotePlans(selectedQuoteId: string) {
    updateQuotePlans((prev) =>
      prev.map((quote) => {
        if (quote.productId === selectedQuoteId) {
          return { ...quote, isSelected: !quote.isSelected };
        }
        return quote;
      })
    );
  }

  useEffect(() => {
    if (isComparePopupVisible) {
      const quotes = quotePlans.filter((quote) => quote.isSelected);
      if (quotes.length < 2) {
        shouldComparePopupVisible(false);
      }
    }
  }, [insurerQuotes]);

  useEffect(() => {
    async function fetchQuotes() {
      try {
        const quoteResponse = await axios.post(
          "https://app.agiliux.com/aeon/webservice.php",
          {
            sessionName: session ? session.sessionName : "",
            operation: "getQuoteInfo",
            element: JSON.stringify({
              requestId: requestId,
              tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
              class: "Private Vehicle",
              suminsured:
                type === "market"
                  ? market?.vehicleMarketValue.toString()
                  : agreed?.sumInsured.toString(),
            }),
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
                insurer,
                logoname,
                displaypremium,
                benefits,
                additionalCover,
                premium
              }: any) => ({
                productId: productid,
                insurerId: insurer,
                insurerName: logoname,
                planType: "comprehensive",
                logoName: logoname.toLowerCase(),
                displayPremium: displaypremium || 672.8,
                popular: true,
                benefits: benefits,
                additionalCover: additionalCover,
                premium: premium
              })
            );
            dispatch({
              type: QuotesTypes.AddQuotes,
              payload: { quotes: quoteList },
            });
            updateQuotePlans(quoteList.map((quote: any) => ({ ...quote, isSelected: false })));
            return;
          }
          throw new Error("INTERVAL_SERVER_ERROR");
        }
        throw new Error("INTERVAL_SERVER_ERROR");
      } catch (err) {
        if (err instanceof Error) {
          console.log(err);
          switch (err.message) {
            case "NO_QUOTE_FOUND": {
              setError({
                code: "404",
                message: "No Quote Found",
                description: "No quote found for the given request.",
              });
              return;
            }
            default: {
              setError({
                code: "500",
                message: "Internal Server Error",
                description: "Something went wrong. Please try again later.",
              });
            }
          }
        }
      }
    }
    fetchQuotes();
  }, []);

  // filter quotes based on user search selection i.e.
  // if user has searching for third-party or comprehensive plans
  const filterQuotePlansType = quotePlans.filter((quotePlan) =>
    filter.plan
      .filter((a) => a.isSelected)
      .map((b) => b.value)
      .includes(quotePlan.planType)
  );

  const quotesToDisplay =
    filterQuotePlansType.length === 0 ? quotePlans : filterQuotePlansType;

  const filterSelectedQuotes: any = quotesToDisplay.filter(
    (quote: any) => quote.isSelected
  );

  // function to toggle isCompareBoxVisble's state
  function handleShouldComparePopup() {
    // check if the box is not opened and also checks
    // if length of selected plans are more than 1
    // then show the comparison box
    if (!isComparePopupVisible && filter) {
      setWarningPopup({
        isVisible: true,
        title: "Warning",
        description:
          "User need to select atleast 2 plans or products to compare.",
      });
    }
    if (!isComparePopupVisible && filterSelectedQuotes.length > 1) {
      return shouldComparePopupVisible(true);
    }
    // otherwise hide the comparison box
    return shouldComparePopupVisible(false);
  }

  return (
    <div className="flex flex-col items-center justify-between w-full h-auto">
      {warngingPopup.isVisible && (
        <DefaultPopup
          title={warngingPopup.title}
          description={warngingPopup.description}
          setShowWarningPopup={setWarningPopup}
        />
      )}
      {/* {isComparePopupVisible && (
        <QuoteComparisonPopup
          selectedQuotes={filterSelectedQuotes}
          updateSelectedQuotePlans={updateSelectedQuotePlans}
          shouldComparePopupVisible={shouldComparePopupVisible}
        />
      )} */}
      {/* {isComparePopupVisible && (
        <QuoteComparePopup
          selectedQuotes={filterSelectedQuotes}
          isComparePopupVisible={isComparePopupVisible}
          shouldComparePopupVisible={shouldComparePopupVisible}
          updateSelectedQuotePlans={updateSelectedQuotePlans}
        />
      )} */}
      <div className="relative mt-4 px-4 py-3 flex flex-col md:flex-row items-center justify-center w-full bg-[#F8F8F8] rounded-[10px]">
        <div className="flex flex-col sm:flex-row items-start lg:items-center justify-center max-w-none sm:max-w-xl lg:max-w-3xl w-full">
          {/* Plan Type multi search field */}
          <div className="flex flex-col lg:flex-row items-start justify-center w-full sm:w-[45%] md:w-50%">
            <span className="mb-1 text-lg text-center text-primary-black font-bold whitespace-nowrap">
              Plan Type
            </span>
            <div className="ml-0 lg:ml-2 inline-block w-full">
              <SelectMultiSearch
                defaultOptionList={defaultPlanTypeOptions}
                selectedOptions={filter.plan}
                setSelectedOptions={setTypeOfFilter}
              />
            </div>
          </div>
          {/* Sort plan field */}
          <div className="ml-0 sm:ml-2 md:ml-4 mt-2 sm:mt-0 flex flex-row items-end lg:items-center justify-between w-full sm:w-[55%] md:w-50%">
            <div className="flex flex-col lg:flex-row items-start lg:items-center flex-[1_1_80%] mobile-l:flex-[1_1_60%] sm:flex-auto w-full">
              <div className="mb-1 flex items-center">
                <svg
                  width="25"
                  height="16"
                  viewBox="0 0 25 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0.5 16V14H8.5V16H0.5ZM0.5 9V7H16.5V9H0.5ZM0.5 2V0H24.5V2H0.5Z"
                    fill="#272727"
                  />
                </svg>
                <span className="ml-2.5 text-lg text-center text-primary-black font-bold whitespace-nowrap">
                  Sort By
                </span>
              </div>
              <div className="ml-0 lg:ml-2 relative min-w-0 md:min-w-[154px] w-full">
                <SelectDropdown
                  id="sortPrice"
                  // selected={quoteFilter.sort}
                  selected={filter.sort}
                  optionList={defaultSortOptions}
                  onChange={setSortValueToFilter}
                  placeholder="Low to High"
                />
              </div>
            </div>
            <button
              className="relative mb-1.5 lg:mb-0 flex items-center justify-center flex-[1_1_20%] mobile-l:flex-[1_1_40%] sm:flex-auto w-full"
              onClick={handleShouldComparePopup}
            >
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10.0761 24.6666L8.80737 23.3979L12.4626 19.7427H2.91675V17.9302H12.4626L8.80737 14.275L10.0761 13.0062L15.9063 18.8364L10.0761 24.6666ZM19.924 16.9937L14.0938 11.1635L19.924 5.33331L21.1928 6.60206L17.5376 10.2573H27.0834V12.0698H17.5376L21.1928 15.725L19.924 16.9937Z"
                  fill="#4B5EAA"
                />
              </svg>

              {/* <LeftRightArrowIcon /> */}
              <span className="hidden mobile-l:inline ml-0 mobile-l:ml-1 text-lg text-center text-primary-blue font-bold">
                Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      {
        // if there is no quote to display
        error ? (
          <div className="mt-8 flex flex-col items-center justify-start w-full h-auto">
            <div className="relative flex flex-col items-center justify-center w-full">
              <LazyLoadImage
                height={40}
                maxWidth={250}
                imgAlt="aeon-insurance-brokers-img"
                imgPath="AEON_LOGO"
              />
              <span className="text-lg text-center text-primary-black font-bold">
                {error.code + " - " + error.description}
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-center justify-start w-full h-auto">
            {quotesToDisplay.length === 0 ? (
              // quote skeleton
              <div className="relative w-full">
                <div className="mt-4 flex flex-col items-center justify-between w-full">
                  <div className="animate-pulse relative h-64 w-full bg-gray-200 rounded-lg"></div>
                  <div className="animate-pulse relative mt-4 h-64 w-full bg-gray-200 rounded-lg"></div>
                  <div className="animate-pulse relative mt-4 h-64 w-full bg-gray-200 rounded-lg"></div>
                </div>
              </div>
            ) : (
              quotesToDisplay
                // sort the quote based on pricing
                .sort((a, b) => {
                  if (filter.sort) {
                    const sortValue: string = filter.sort;
                    if (sortValue === "high-to-low") {
                      // return parseInt(b.price) - parseInt(a.price);
                      return Number(b.displayPremium) - Number(a.displayPremium);
                    }
                  }
                  return Number(a.displayPremium) - Number(b.displayPremium);
                })
                .map((quote) => {
                  return (
                    <QuoteListingPlanCard
                      key={quote.productId}
                      benefits={quote.benefits}
                      id={quote.productId}
                      imgUrl={quote.logoName}
                      insurerId={quote.insurerId}
                      insurerName={quote.insurerName}
                      isSelected={quote.isSelected}
                      planType={quote.planType}
                      popular={quote.popular}
                      price={Number(quote.displayPremium)}
                      updateSelectedQuotePlans={updateSelectedQuotePlans}
                    />
                  );
                })
            )}
          </div>
        )
      }
    </div>
  );
};

type LazyLoadImageProps = {
  height: number;
  minWidth?: number;
  maxWidth?: number;
  imgPath: string;
  imgAlt: string;
};

function LazyLoadImage({
  height,
  minWidth,
  imgPath,
  maxWidth,
  imgAlt,
}: LazyLoadImageProps) {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [pathLoaded, setPathLoaded] = useState<boolean>(false);
  const imgRef = useRef<string>("");

  useEffect(() => {
    async function importImageDynamically() {
      const importedImage = await import(`../../assets/images/${imgPath}.png`);
      imgRef.current = importedImage.default;
      setPathLoaded(true);
    }
    importImageDynamically();
  }, []);

  return (
    <div className="relative w-auto">
      <div
        style={{
          height: `${height}px`,
          maxWidth: `${maxWidth}px`,
        }}
        className={`${
          !isLoaded ? `animate-pulse min-w-[${minWidth}]` : ""
        } relative even:mt-4 md:even:mt-0 even:ml-0 md:even:ml-4 w-auto rounded`}
      >
        {!isLoaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-300 z-10 rounded" />
        )}
        {pathLoaded && (
          <img
            src={imgRef.current}
            alt={imgAlt}
            onLoad={() => setIsLoaded(true)}
            className={`ml-3 mr-1 w-9 mobile-m:w-auto h-auto`}
          />
        )}
      </div>
    </div>
  );
}

export default QuoteListingsContainer;
