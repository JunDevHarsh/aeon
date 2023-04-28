import { useState } from "react";
import { Coverage } from "../container/QuoteListings";
import FileDownloadButton from "../button/FileDownload";
import CheckboxWithTextField from "../fields/CheckboxWithText";
import { useDispatch } from "react-redux";
import { updateInsuranceProvider } from "../../store/slices/insurance";
import { useNavigate } from "react-router-dom";

type QuoteListingPlanProps = {
  id: string;
  companyId: string;
  companyName: string;
  planType: string;
  companyImgHref: string;
  price: string;
  isTrending: boolean;
  isSelected: boolean;
  updateSelectedQuotePlans: (selectedQuoteId: string) => void;
  coverages: Coverage[];
};

const MAX_LIST_LIMIT = 4; // default max limit for displaying list

const QuoteListingPlanCard = ({
  id,
  companyId,
  companyImgHref,
  companyName,
  coverages,
  isTrending,
  isSelected,
  updateSelectedQuotePlans,
  price,
}: QuoteListingPlanProps) => {
  const [listSize, setListSize] = useState<number>(
    coverages.length < MAX_LIST_LIMIT ? coverages.length : MAX_LIST_LIMIT
  ); // limit for displaying list of coverages, default is 4
  const [showDownloadButton, setShowDownloadButton] = useState<boolean>(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function updateListSize(size: number, updatedSize: number): void {
    setShowDownloadButton((prev) => !prev);
    if (size < updatedSize) {
      setListSize(updatedSize);
      return;
    } else {
      const coverageSize = coverages.length;
      return size < MAX_LIST_LIMIT
        ? setListSize(coverageSize)
        : setListSize(MAX_LIST_LIMIT);
    }
  }

  function handleSelectedQuotePlan() {
    dispatch(
      updateInsuranceProvider({
        companyId,
        companyName,
        price: Number(price),
      })
    );
    navigate("/vehicle-market");
  }

  return (
    <div
      id={companyId}
      className="relative px-6 sm:px-10 md:px-16 py-10 max-w-[1100px] w-full h-auto bg-white rounded-[10px] border border-solid border-primary-blue shadow-[0_8px_10px_0_#00000024]"
    >
      {/* Plan is trending */}
      {isTrending && (
        <div className="absolute top-2 right-2">
          <div className="py-1 px-1 sm:px-2.5 flex items-center justify-center w-auto bg-primary-pink rounded-full md:rounded-lg">
            <svg
              width="26"
              height="25"
              viewBox="0 0 26 25"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.04091 25L6.79545 21.131L2.33409 20.2083L2.83636 15.8333L0 12.5L2.83636 9.19643L2.33409 4.82143L6.79545 3.89881L9.04091 0L13 1.84524L16.9591 0L19.2341 3.89881L23.6659 4.82143L23.1636 9.19643L26 12.5L23.1636 15.8333L23.6659 20.2083L19.2341 21.131L16.9591 25L13 23.1548L9.04091 25ZM11.7295 16.4583L18.4364 9.7619L17.1068 8.54167L11.7295 13.8988L8.92273 10.9524L7.56364 12.2917L11.7295 16.4583Z"
                fill="#F6F6F6"
              />
            </svg>
            <p className="hidden sm:inline-block ml-1.5 text-base text-center text-white font-bold">
              Top Rated
            </p>
          </div>
        </div>
      )}
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <div className="pb-4 md:pb-0 flex flex-col items-start w-full md:w-[60%] border-r-0 md:border-r border-b md:border-b-0 border-solid border-gray-300">
          <div className="flex items-center justify-start gap-x-2 w-auto">
            <img
              src={companyImgHref}
              alt={companyName + "img"}
              className="h-10 w-auto"
            />
            <div className="relative px-1.5 py-1.5 flex items-center justify-center w-auto bg-[#F2D3FF] rounded">
              <p className="text-sm text-[#2C2C2C] text-center font-bold">
                Motor Plus
              </p>
            </div>
          </div>
          {/* List of coverages */}
          <ul className="mt-4 flex flex-col items-start justify-between gap-y-2 w-auto h-auto">
            {coverages
              .slice(
                0,
                coverages.length > listSize ? listSize : coverages.length
              )
              .map((coverage) => (
                <li
                  key={`benefit-of-${companyName}-${coverage.id}`}
                  className="flex items-center justify-start"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                      fill="#A5308A"
                    />
                  </svg>
                  <span className="ml-1.5 text-base text-left text-primary-black font-medium">
                    {coverage.body}
                  </span>
                </li>
              ))}
          </ul>
          {/* File download button */}
          {showDownloadButton && (
            <div className="mt-6 flex items-center justify-center w-full">
              <FileDownloadButton
                text="Download Brochure"
                href="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
              />
            </div>
          )}
        </div>
        <div className="pt-4 md:pt-0 flex items-center h-full w-full md:w-[35%]">
          <div className="flex flex-col items-start justify-start w-auto h-full">
            {/* {normalPrice !== specialPrice && (
              <span className="text-lg text-center text-primary-black font-bold line-through">
                RM {normalPrice}
              </span>
            )} */}
            <div className="flex items-center justify-center w-auto">
              <span className="text-xl text-center text-primary-black font-bold">
                RM {price}
              </span>
              {/* {normalPrice !== specialPrice && (
                <div className="relative px-1.5 py-1.5 flex items-center justify-center w-auto bg-[#F2D3FF] rounded">
                  <p className="text-sm text-[#2C2C2C] text-center font-bold">
                    {discountPercentage + "% Off"}
                  </p>
                </div>
              )} */}
            </div>
            <div className="mt-2 flex items-center justify-start gap-x-4">
              <button
                onClick={handleSelectedQuotePlan}
                className="relative py-1 px-3.5 w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
              >
                <span className="text-base text-center font-medium text-white">
                  Buy Now
                </span>
              </button>
              <CheckboxWithTextField
                id={id}
                text="Add To Comparison"
                isSelected={isSelected}
                updateIsSelected={updateSelectedQuotePlans}
              />
            </div>
            <button
              className="mt-2 flex items-center w-auto"
              onClick={() => updateListSize(listSize, coverages.length)}
            >
              <span
                className={`flex items-center justify-center w-auto bg-white rounded-full ${
                  showDownloadButton ? "rotate-180" : "rotate-0"
                }`}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.50008 9.7844L10.5636 6.72085L9.80217 5.9771L7.50008 8.27919L5.198 5.9771L4.43654 6.72085L7.50008 9.7844ZM7.50008 14.5834C6.53203 14.5834 5.6171 14.3974 4.75529 14.0255C3.89348 13.6537 3.14088 13.146 2.49748 12.5026C1.85407 11.8592 1.34644 11.1066 0.974561 10.2448C0.602686 9.38301 0.416748 8.46808 0.416748 7.50002C0.416748 6.52016 0.602686 5.59933 0.974561 4.73752C1.34644 3.87571 1.85407 3.12606 2.49748 2.48856C3.14088 1.85106 3.89348 1.34637 4.75529 0.9745C5.6171 0.602625 6.53203 0.416687 7.50008 0.416687C8.47994 0.416687 9.40078 0.602625 10.2626 0.9745C11.1244 1.34637 11.874 1.85106 12.5115 2.48856C13.149 3.12606 13.6537 3.87571 14.0256 4.73752C14.3975 5.59933 14.5834 6.52016 14.5834 7.50002C14.5834 8.46808 14.3975 9.38301 14.0256 10.2448C13.6537 11.1066 13.149 11.8592 12.5115 12.5026C11.874 13.146 11.1244 13.6537 10.2626 14.0255C9.40078 14.3974 8.47994 14.5834 7.50008 14.5834Z"
                    fill="#A5308A"
                  />
                </svg>
              </span>
              <span className="ml-1 text-base text-center text-primary-black font-normal">
                {showDownloadButton ? "Less Details" : "More Details"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteListingPlanCard;
