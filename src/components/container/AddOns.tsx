import { useContext } from "react";
import AddOnsCard from "../card/AddOns";
import {
  AddDriverTypes,
  AddOnsTypes,
  InsuranceContext,
} from "../context/context";

const AddOnsContainer = () => {
  const {
    state: { addOns, addDriverDetails },
    dispatch,
  } = useContext(InsuranceContext);

  function toggleAddOnsById(id: string) {
    dispatch({ type: AddOnsTypes.ToggleAddOnById, payload: { id: id } });
  }

  return (
    <div className="flex flex-col items-start max-w-[39rem] w-full">
      <div className="relative py-4 w-full">
        <h2 className="text-2xl text-left text-primary-black font-bold">
          Additional Add Ons
        </h2>
        <div className="mt-4 grid grid-cols-3 items-start justify-between gap-4 w-full">
          {addOns.map((addOn) => (
            <AddOnsCard
              key={addOn.id}
              {...addOn}
              updateBenefitList={toggleAddOnsById}
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex flex-col items-start justify-start w-full h-auto">
        {addDriverDetails.map((driverDetails, index) => (
          <div className="relative w-full" key={`addDriverDetails-${index}`}>
            <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
              <label
                htmlFor="addDriverDetailsName"
                className="text-base text-center text-primary-black font-semibold"
              >
                Name(As per NRIC)*
              </label>
              <input
                id="addDriverDetailsName"
                type="text"
                className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink border-[#CFD0D7] focus-visible:border-primary-pink"
              />
            </div>
          </div>
        ))}
        <div className="flex items-center justify-start w-full">
          <button
            className="flex items-center justify-start w-auto"
            onClick={() => {
              dispatch({
                type: AddDriverTypes.AddNewDriverDetails,
                payload: {
                  id: "asdasd",
                },
              });
            }}
          >
            <svg
              width="31"
              height="30"
              viewBox="0 0 31 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.4875 22.5H16.7375V16.275H23V14.025H16.7375V7.5H14.4875V14.025H8V16.275H14.4875V22.5ZM15.5 30C13.45 30 11.5125 29.6062 9.6875 28.8187C7.8625 28.0312 6.26875 26.9562 4.90625 25.5938C3.54375 24.2313 2.46875 22.6375 1.68125 20.8125C0.89375 18.9875 0.5 17.0375 0.5 14.9625C0.5 12.9125 0.89375 10.975 1.68125 9.15C2.46875 7.325 3.54375 5.7375 4.90625 4.3875C6.26875 3.0375 7.8625 1.96875 9.6875 1.18125C11.5125 0.39375 13.4625 0 15.5375 0C17.5875 0 19.525 0.39375 21.35 1.18125C23.175 1.96875 24.7625 3.0375 26.1125 4.3875C27.4625 5.7375 28.5312 7.325 29.3187 9.15C30.1062 10.975 30.5 12.925 30.5 15C30.5 17.05 30.1062 18.9875 29.3187 20.8125C28.5312 22.6375 27.4625 24.2313 26.1125 25.5938C24.7625 26.9562 23.175 28.0312 21.35 28.8187C19.525 29.6062 17.575 30 15.5 30Z"
                fill="#4B5EAA"
              />
            </svg>
            <span className="ml-2 text-xl text-center text-primary-blue font-bold">
              Add Additional Driver
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddOnsContainer;
