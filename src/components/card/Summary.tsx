import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Code from "../button/Code";
import { numberWithCommas } from "../container/VehicleCoverage";
import { InsuranceContext } from "../../context/InsuranceContext";
import { AddOnsContext } from "../../context/AddOnContext";
// import { VehicleCoverageContext } from "../../context/VehicleCoverage";
import { updateFinalPrice } from "../../store/slices/insurance";
import { Link } from "react-router-dom";
import { MarketAndAgreedContext } from "../../context/MarketAndAgreedContext";
import AllianzImg from "../../assets/images/logo-allianz.png";

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
  const [promoCode, setPromoCode] = useState<number>(0);
  const {
    state: { addOns, isEdited },
    dispatch,
  } = useContext(AddOnsContext);
  const {
    ncdPercentage: ncd,
    polExpiryDate,
    polEffectiveDate,
  } = useSelector((state: RootState) => state.vehicle);
  const navigate = useNavigate();
  const {
    state: { price: proPrice, name: proName },
  } = useContext(InsuranceContext);
  // const {
  //   state: { type, market },
  // } = useContext(VehicleCoverageContext);

  const {
    state: {
      type: valuationType,
      agreed: valuationAgreed,
      market: valuationMarket,
    },
  } = useContext(MarketAndAgreedContext);

  const { pathname } = useLocation();

  const selectedAddOns = addOns.filter((addOn) => addOn.isSelected);

  const providerPrice = proPrice ? Number(proPrice) : 0;

  const updatedNCD = ((providerPrice * Number(ncd)) / 100).toFixed(2);
  const grossPremium = (
    providerPrice -
    Number(updatedNCD) +
    selectedAddOns.reduce((acc, curr) => (acc += curr.price), 0)
  ).toFixed(2);
  const updateFinalPriceToStore = useDispatch();
  const discount = ((Number(grossPremium) * Number(promoCode)) / 100).toFixed(
    2
  );
  const subTotal = (Number(grossPremium) - Number(discount)).toFixed(2);
  const serviceTax = ((Number(grossPremium) * 6) / 100).toFixed(2);
  const totalAmount = (Number(subTotal) + Number(serviceTax) + 10).toFixed(2);

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
                    ? valuationMarket.marketValue
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
              Premium
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM {providerPrice.toFixed(2) ?? 671.67}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              NCD ({ncd ?? 30}%)
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              <span className="font-semibold">-</span> RM {updatedNCD}
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
                key={`add-benefit-${addOn.id}`}
                className="flex items-start justify-between w-full"
              >
                <span className="text-base text-left text-primary-black font-base w-1/2">
                  {addOn.title}
                </span>
                <span className="text-base text-right text-primary-black font-medium w-1/2">
                  <span className="font-semibold">+</span> RM{" "}
                  {addOn.price.toFixed(2)}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-start gap-y-1 w-full">
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Gross Premium
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM {grossPremium}
            </span>
          </div>
          {promoCode !== 0 && (
            <div className="flex items-start justify-between w-full">
              <span className="text-base text-left text-primary-black font-bold w-1/2">
                Discount {`${promoCode}%`}
              </span>
              <span className="text-base text-right text-primary-black font-medium w-1/2">
                <span className="font-semibold">-</span> RM {discount}
              </span>
            </div>
          )}
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Sub Total
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM {subTotal}
            </span>
          </div>
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Service Tax (6%)
            </span>
            <span className="text-base text-right text-primary-black font-medium w-1/2">
              RM {serviceTax}
            </span>
          </div>
          <div className="flex items-start justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
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
            validationList={["ADSN12"]}
            updateCode={setPromoCode}
          />
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex items-center justify-between w-full">
          <span className="text-xl text-left text-primary-black font-bold w-1/2">
            Total Amount
          </span>
          <span className="text-xl text-right text-primary-black font-bold w-1/2">
            RM {totalAmount}
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
            <button
              onClick={() => dispatch((prev) => ({ ...prev, isEdited: false }))}
              className="relative py-2 px-6 min-w-[120px] order-1 mobile-xl:order-2 w-full mobile-xl:w-auto bg-primary-blue rounded mobile-xl:rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                Update Quote
              </span>
            </button>
          ) : pathname === "/insurance/review-pay" ? (
            <button
              onClick={() => {
                updateFinalPriceToStore(updateFinalPrice(totalAmount));
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

// function ImportImageDynamically(imgName: string) {
//   const [pathLoaded, setPathLoaded] = useState<boolean>(false);
//   const [isLoaded, setIsLoaded] = useState<boolean>(false);
//   const imgRef = useRef<string>("");

//   useEffect(() => {
//     async function importImageDynamically() {
//       const importedImage = await import(`../../assets/images/${imgName}.png`);
//       imgRef.current = importedImage.default;
//       setPathLoaded(true);
//     }
//     importImageDynamically();
//   }, []);
//   return <div></div>;
// }

export default SummaryInfoCard;
