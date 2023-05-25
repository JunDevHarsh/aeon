import { useEffect, useState } from "react";
import SelectMultiSearch from "../fields/SelectMultiSearch";
import SelectDropdown from "../fields/SelectDropdown";
import QuoteListingPlanCard from "../card/QuoteListingPlan";
import QuoteComparePopup from "../popup/QuoteCompare";
import DefaultPopup, { WarningPopupType } from "../popup/Default";
import { quotes } from "../../data/quotes";

type FilterType = {
  sort: string | null;
  type: PlanType[];
};

export interface PlanType {
  value: string;
  label: string;
  isSelected: boolean;
}

export type QuotePlansType = {
  id: string;
  companyId: string;
  companyName: string;
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
  // state for managing the filter and sort
  const [quoteFilter, updateQuoteFilter] = useState<FilterType>({
    sort: null,
    type: defaultPlanTypeOptions,
  });
  // state for managing the list of quote plans
  // fetched from the agiliux backend system
  const [quotePlans, updateQuotePlans] = useState<QuotePlansType[]>(quotes);
  const [isComparePopupVisible, shouldComparePopupVisible] =
    useState<boolean>(false);
  const [warngingPopup, setWarningPopup] = useState<WarningPopupType>({
    isVisible: false,
    title: null,
    description: null,
  });
  // update the type property of the filter
  const setTypeOfFilter = (updatedFilterTypes: PlanType[]) => {
    updateQuoteFilter((prev) => ({ ...prev, type: updatedFilterTypes }));
  };

  // update the sort property of the filter
  const setSortValueToFilter = (val: string) => {
    updateQuoteFilter((prev) => ({ ...prev, sort: val }));
  };

  // function to update selected quotes when user
  // try to compare different plans
  function updateSelectedQuotePlans(selectedQuoteId: string) {
    const updatedQuotePlans = quotePlans.map((quotePlan) =>
      quotePlan.id === selectedQuoteId
        ? { ...quotePlan, isSelected: !quotePlan.isSelected }
        : quotePlan
    );
    updateQuotePlans(updatedQuotePlans);
  }

  useEffect(() => {
    if (isComparePopupVisible) {
      const quotes = quotePlans.filter((quote) => quote.isSelected);
      if (quotes.length < 2) {
        shouldComparePopupVisible(false);
      }
    }
  }, [quotePlans]);

  // filter quotes based on user search selection i.e.
  // if user has searching for third-party or comprehensive plans
  const filterQuotePlansType = quotePlans.filter((quotePlan) =>
    quoteFilter.type
      .filter((a) => a.isSelected)
      .map((b) => b.value)
      .includes(quotePlan.planType)
  );

  const quotesToDisply =
    filterQuotePlansType.length === 0 ? quotePlans : filterQuotePlansType;

  const filterSelectedQuotes: QuotePlansType[] = quotesToDisply.filter(
    (quote) => quote.isSelected
  );

  // function to toggle isCompareBoxVisble's state
  function handleShouldComparePopup() {
    // check if the box is not opened and also checks
    // if length of selected plans are more than 1
    // then show the comparison box
    if (!isComparePopupVisible && filterSelectedQuotes.length <= 1) {
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
      {isComparePopupVisible && (
        <QuoteComparePopup
          selectedQuotes={filterSelectedQuotes}
          isComparePopupVisible={isComparePopupVisible}
          shouldComparePopupVisible={shouldComparePopupVisible}
          updateSelectedQuotePlans={updateSelectedQuotePlans}
        />
      )}
      <div className="relative px-4 py-3 flex flex-col md:flex-row items-center justify-center w-full bg-[#F8F8F8] rounded-[10px]">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-auto">
          {/* Plan Type multi search field */}
          <div className="flex flex-col md:flex-row items-start justify-center w-auto">
            <span className="mb-1 text-lg text-center text-primary-black font-bold whitespace-nowrap">
              Plan Type
            </span>
            <div className="ml-0  md:ml-2 inline-block max-w-[365px] w-full">
              <SelectMultiSearch
                defaultOptionList={defaultPlanTypeOptions}
                selectedOptions={quoteFilter.type}
                setSelectedOptions={setTypeOfFilter}
              />
            </div>
          </div>
          {/* Sort plan field */}
          <div className="flex flex-row items-center justify-between w-auto">
            <div className="flex flex-col md:flex-row items-start gap-x-4 w-auto">
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
              <div className="relative min-w-[150px]">
                <SelectDropdown
                  id="sortPrice"
                  selected={quoteFilter.sort}
                  optionList={defaultSortOptions}
                  onChange={setSortValueToFilter}
                  placeholder="Low to High"
                />
              </div>
            </div>
            <button
              className="relative px-2 flex items-center justify-center w-auto"
              onClick={handleShouldComparePopup}
            >
              {/* <LeftRightArrowIcon /> */}
              <span className="ml-2 text-lg text-center text-primary-blue font-bold">
                Compare
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col items-center justify-start gap-y-4 w-full h-auto">
        {quotesToDisply.length === 0 ? (
          // quote skeleton
          <div className="relative w-full">
            <div className="animate-pulse py-6 px-4 flex items-center justify-center gap-x-4 bg-[#F8F8F8] w-full rounded-2xl" />
            <div className="mt-8 flex flex-col items-center justify-between w-full gap-y-4">
              <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
              <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
              <div className="animate-pulse relative h-64 w-full bg-gray-100 rounded-lg"></div>
            </div>
          </div>
        ) : (
          quotesToDisply
            // sort the quote based on pricing
            .sort((a, b) => {
              if (quoteFilter.sort) {
                const sortValue: string = quoteFilter.sort;
                if (sortValue === "high-to-low") {
                  return parseInt(b.price) - parseInt(a.price);
                }
              }
              return parseInt(a.price) - parseInt(b.price);
            })
            .map((broker) => {
              const {
                companyId,
                companyImgHref,
                companyName,
                companyRelImgHref,
                coverages,
                id,
                price,
                isTrending,
                isSelected,
                planType,
              } = broker;
              const cov: Coverage[] = Object.values(coverages);
              return (
                <QuoteListingPlanCard
                  key={id}
                  {...{
                    companyId,
                    companyImgHref,
                    companyRelImgHref,
                    companyName,
                    id,
                    price,
                    coverages: cov,
                    planType,
                    isTrending,
                    isSelected,
                    updateSelectedQuotePlans,
                  }}
                />
              );
            })
        )}
      </div>
    </div>
  );
};

export default QuoteListingsContainer;
