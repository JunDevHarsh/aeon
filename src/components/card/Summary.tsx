import { useContext } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { numberWithCommas } from "../../pages/PolicyCoverage";
import { InsuranceContext } from "../context/context";
import Code from "../button/Code";
import { VehicleCoverageContext } from "../../pages/Insurance";
import { MultiFormStepTypes, StepContext } from "../../context/StepContext";

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
  const { provider } = useSelector((state: RootState) => state.insurance);
  const { ncd } = useSelector((state: RootState) => state.vehicle);
  const {
    state: { addOns },
  } = useContext(InsuranceContext);
  const {
    state: { currentStep },
    dispatch: updateStep,
  } = useContext(StepContext);
  const {
    store: { selectedCoverage },
    dispatch: updateVehicleCoverage,
  } = useContext(VehicleCoverageContext);

  const selectedAddOns = addOns.filter((addOn) => addOn.isSelected);

  const updatedNCD: number = Number(
    (((provider?.price ?? 0) * parseInt(ncd)) / 100).toFixed(2)
  );
  const grossPremium = Number(
    (
      (provider?.price ?? 0) -
      updatedNCD +
      selectedAddOns.reduce((acc, curr) => (acc += curr.price), 0)
    ).toFixed(2)
  );

  const subTotal = grossPremium;
  const serviceTax = Number(((grossPremium * 6) / 100).toFixed(2));
  const totalAmount = Number((subTotal + serviceTax + 10).toFixed(2));

  return (
    <div className="relative flex flex-col items-center justify-between max-w-sm w-full h-auto rounded-[20px] shadow-container overflow-hidden">
      <div className="inline-block p-2 w-full bg-[#283CC6]">
        <h3 className="text-xl text-center text-white font-bold">Summary</h3>
      </div>
      <div className="relative py-4 px-6 flex flex-col items-center justify-center w-full bg-[#F8F8F8]">
        <div className="flex flex-col items-center gap-y-1 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Coverage Period
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              19/01/23 - 19/01/24
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Sum Insured <br />
              {`(${selectedCoverage?.type || "Market"} Value)`}
            </span>
            <div className="flex items-center justify-start w-1/2">
              <span className="text-base text-left text-primary-black font-medium">
                RM {numberWithCommas(selectedCoverage?.price ?? 1200)}
              </span>
              <button
                onClick={() =>
                  updateVehicleCoverage((prev) => ({
                    ...prev,
                    isContainerVisible: true,
                  }))
                }
                className="ml-1"
              >
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
              </button>
            </div>
          </div>
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-start gap-y-1 w-full">
          <h4 className="text-lg text-center text-primary-black font-bold">
            {provider?.companyName ?? "MSIG Motor Plus Insurance"}
          </h4>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Premium
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              RM {provider?.price ?? 671.67}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              NCD({ncd ?? 30}%)
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              RM {updatedNCD}
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
                className="flex items-center justify-between w-full"
              >
                <span className="text-base text-left text-primary-black font-bold w-1/2">
                  {addOn.title}
                </span>
                <span className="text-base text-left text-primary-black font-medium w-1/2">
                  RM {addOn.price}
                </span>
              </div>
            ))
          )}
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex flex-col items-start gap-y-1 w-full">
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Gross Premium
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              RM {grossPremium}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Discount (10%)
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              RM 58
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Sub Total
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              RM {subTotal}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Service Tax (6%)
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              RM {serviceTax}
            </span>
          </div>
          <div className="flex items-center justify-between w-full">
            <span className="text-base text-left text-primary-black font-bold w-1/2">
              Stamp Duty
            </span>
            <span className="text-base text-left text-primary-black font-medium w-1/2">
              10
            </span>
          </div>
        </div>
        <div className="relative my-2 w-full">
          <Code
            textToDisplay="I have a promo code"
            title="Promo Code"
            placeholder="DFS3432"
          />
        </div>
        <div className="inline-block my-3 w-full h-[1px] bg-[#bcbcbc]" />
        <div className="flex items-center justify-between w-full">
          <span className="text-xl text-left text-primary-black font-bold w-1/2">
            Total Amount
          </span>
          <span className="text-xl text-left text-primary-black font-bold w-1/2">
            RM {totalAmount}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-start gap-x-4 w-full">
          <button
            onClick={() =>
              updateStep({
                type: MultiFormStepTypes.UpdateCurrentStep,
                payload: {
                  newStep: currentStep - 1,
                },
              })
            }
            className="relative py-2 px-6 min-w-[120px] w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
          >
            <span className="text-base text-center font-medium text-white">
              Previous
            </span>
          </button>

          {currentStep === 4 ? (
            <Link
              to="/payment"
              className="relative py-2 px-6 min-w-[120px] w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                Pay Now
              </span>
            </Link>
          ) : (
            <button
              onClick={() =>
                updateStep({
                  type: MultiFormStepTypes.UpdateCurrentStep,
                  payload: {
                    newStep: currentStep + 1,
                  },
                })
              }
              className="relative py-2 px-6 min-w-[120px] w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
            >
              <span className="text-base text-center font-medium text-white">
                {currentStep === 3 ? "Proceed To Confirm" : "Next"}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryInfoCard;
