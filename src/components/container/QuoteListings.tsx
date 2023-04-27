import { useEffect, useState } from "react";
import SelectMultiSearch from "../fields/SelectMultiSearch";
import SelectDropdown from "../fields/SelectDropdown";
import QuoteListingPlanCard from "../card/QuoteListingPlan";
import brokers from "../../brokers.json";

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
  { value: "comprehensive", label: "Comprehensive", isSelected: false },
  {
    value: "third-party",
    label: "Third Party/Fire and Theft",
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
  const [quotePlans, updateQuotePlans] = useState<QuotePlansType[]>([]);

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
    if (process.env.NODE_ENV === "development") {
      updateQuotePlans(brokers);
    }
  }, []);

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

  return (
    <div className="flex flex-col items-center justify-between w-full h-auto">
      <div className="relative px-4 py-3 flex items-center justify-center gap-4 w-full bg-[#F8F8F8] rounded-[10px]">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-auto">
          {/* Plan Type multi search field */}
          <div className="flex items-center justify-center w-auto">
            <span className="text-lg text-center text-primary-black font-bold whitespace-nowrap">
              Plan Type
            </span>
            <div className="inline-block ml-4 max-w-[365px] w-full">
              <SelectMultiSearch
                defaultOptionList={defaultPlanTypeOptions}
                selectedOptions={quoteFilter.type}
                setSelectedOptions={setTypeOfFilter}
              />
            </div>
          </div>
          {/* Sort plan field */}
          <div className="flex items-center gap-x-4 w-auto">
            <div className="flex items-center gap-x-1">
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
              <span className="ml-2 text-lg text-center text-primary-black font-bold whitespace-nowrap">
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
        </div>
        <button className="relative px-2 flex items-center justify-center w-auto">
          {/* <LeftRightArrowIcon /> */}
          <span className="ml-2 text-lg text-center text-primary-blue font-bold">
            Compare
          </span>
        </button>
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
