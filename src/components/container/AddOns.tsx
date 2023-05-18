import { useContext, useEffect, useState } from "react";
import { nanoid } from "@reduxjs/toolkit";
import AddOnsCard from "../card/AddOns";
import SelectDropdown from "../fields/SelectDropdown";
import {
  AddDriverTypes,
  AddOnsTypes,
  MultiStepFormContext,
} from "../../context/MultiFormContext";
import { AdditionalDriverDetails } from "../../context/types";
import AddOnPopup from "../popup/AddOn";
import { AddOnType, AddOnsContext } from "../../context/AddOnContext";

const defaultAddOnsState: AddOnType[] = [
  {
    id: "addon-1",
    title: "Cover for Windscreens",
    description: "Cover for Windscreens, Windows And Sunroof",
    isSelected: false,
    isEditable: true,
    price: 30,
    sumInsured: 14000,
    localImgName: "WindScreenIcon",
  },
  {
    id: "addon-2",
    title: "Towing and Cleaning",
    description: "Towing and Cleaning due to Water Damage",
    isSelected: false,
    isEditable: false,
    price: 40,
    localImgName: "TowingIcon",
    sumInsured: 0,
  },
  {
    id: "addon-3",
    title: "Driver's Personal Accident",
    description: "Driver's Personal Accident",
    isSelected: false,
    isEditable: false,
    price: 34,
    localImgName: "CarAccidentIcon",
    sumInsured: 0,
  },
  {
    id: "addon-4",
    title: "Strike, Riot & Civil Commotion",
    description: "Strike, Riot & Civil Commotion",
    isSelected: false,
    isEditable: false,
    price: 23,
    localImgName: "CarOilIcon",
    sumInsured: 0,
  },
  {
    id: "addon-5",
    title: "Inclusion of Special Perils",
    description: "Inclusion of Special Perils",
    isSelected: false,
    isEditable: false,
    price: 53,
    localImgName: "CarRainIcon",
    sumInsured: 0,
  },
  {
    id: "addon-6",
    title: "Accident Repair Allowance",
    description: "Accident Repair Allowance",
    isSelected: false,
    isEditable: false,
    price: 28,
    localImgName: "CarProperty1Icon",
    sumInsured: 0,
  },
];

let prevValue: string = "";

const AddOnsContainer = () => {
  const {
    store: { addDriverDetails },
    dispatch,
  } = useContext(MultiStepFormContext);
  // addons context
  const {
    state: { addOns: addOnState },
    dispatch: updateAddOnsState,
  } = useContext(AddOnsContext);
  const [addOnPopup, handleAddOnPopup] = useState<{
    id: string;
    isVisible: boolean;
    title: string;
    defaultValue: string;
  }>({
    id: "",
    isVisible: false,
    title: "",
    defaultValue: "",
  });

  // function toggleAddOnsById(id: string) {
  //   dispatch({
  //     type: AddOnsTypes.SelectionToggleById,
  //     payload: { id: id },
  //   });
  // }

  function updateDriverDetails(
    id: string,
    updatedValue: Partial<AdditionalDriverDetails>
  ) {
    dispatch({
      type: AddDriverTypes.UpdateDriverDetails,
      payload: { id: id, updatedValue: { ...updatedValue } },
    });
  }

  function openAddOnPopup(id: string, title: string, defaultValue: string) {
    handleAddOnPopup({
      id: id,
      isVisible: true,
      title: title,
      defaultValue: defaultValue,
    });
  }

  function closeAddOnPopup() {
    handleAddOnPopup({ id: "", isVisible: false, defaultValue: "", title: "" });
  }

  function updateAddOnPrice(id: string, price: string) {
    handleAddOnPopup({ id: "", defaultValue: "", isVisible: false, title: "" });
    dispatch({
      type: AddOnsTypes.UpdateAddOnPrice,
      payload: {
        id: id,
        price: Number(price),
      },
    });
  }
  // update the addOns list in AddOnContext
  function toggleAddById(id: string) {
    const updatedAddOns = addOnState.map((addOn) =>
      addOn.id === id ? { ...addOn, isSelected: !addOn.isSelected } : addOn
    );
    const isUpdated = updatedAddOns.find((addOn) => addOn.isSelected);
    if (isUpdated) {
      updateAddOnsState({ addOns: updatedAddOns, isEdited: true });
    } else {
      updateAddOnsState({ addOns: updatedAddOns, isEdited: false });
    }
  }

  useEffect(() => {
    if (addOnState.length === 0) {
      const timeout = setTimeout(() => {
        updateAddOnsState((prev) => ({ ...prev, addOns: defaultAddOnsState }));
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <>
      {addOnPopup.isVisible && (
        <AddOnPopup
          id={addOnPopup.id}
          title={addOnPopup.title}
          defaultValue={addOnPopup.defaultValue}
          closeAddOnPopup={closeAddOnPopup}
          updateAddOnPrice={updateAddOnPrice}
          toggleAddOnsById={toggleAddById}
        />
      )}
      <div className="flex flex-col items-start max-w-[39rem] w-full">
        <div className="relative py-4 w-full">
          <h2 className="text-2xl text-left text-primary-black font-bold">
            Additional Add Ons
          </h2>
          <div className="mt-4 grid grid-cols-3 items-start justify-between gap-4 w-full">
            {addOnState.length === 0
              ? [...Array(6)].map((_, index) => (
                  <div
                    className="animate-pulse relative w-[200px] h-[184px] bg-gray-300 rounded-lg"
                    key={`addon-skeleton-${index}`}
                  />
                ))
              : addOnState.map((addOn) => (
                  <AddOnsCard
                    key={addOn.id}
                    {...addOn}
                    updateBenefitList={toggleAddById}
                    openAddOnPopup={openAddOnPopup}
                  />
                ))}
          </div>
        </div>
        <div className="mt-4 flex flex-col items-start justify-start w-full h-auto">
          {addDriverDetails.map((driverDetails, index) => (
            <div className="relative w-full" key={driverDetails.id}>
              {/* Remove Driver Details Button */}
              <div className="mb-2 flex items-center justify-start w-full">
                <button
                  className="relation h-auto w-auto"
                  onClick={() =>
                    dispatch({
                      type: AddDriverTypes.RemoveDriverDetailsById,
                      payload: { id: driverDetails.id },
                    })
                  }
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8.75 20.72L14 15.47L19.25 20.72L20.72 19.25L15.47 14L20.72 8.75L19.25 7.28L14 12.53L8.75 7.28L7.28 8.75L12.53 14L7.28 19.25L8.75 20.72ZM14 28C12.0867 28 10.2783 27.6325 8.575 26.8975C6.87167 26.1625 5.38417 25.1592 4.1125 23.8875C2.84083 22.6158 1.8375 21.1283 1.1025 19.425C0.3675 17.7217 0 15.9133 0 14C0 12.0633 0.3675 10.2433 1.1025 8.54C1.8375 6.83667 2.84083 5.355 4.1125 4.095C5.38417 2.835 6.87167 1.8375 8.575 1.1025C10.2783 0.3675 12.0867 0 14 0C15.9367 0 17.7567 0.3675 19.46 1.1025C21.1633 1.8375 22.645 2.835 23.905 4.095C25.165 5.355 26.1625 6.83667 26.8975 8.54C27.6325 10.2433 28 12.0633 28 14C28 15.9133 27.6325 17.7217 26.8975 19.425C26.1625 21.1283 25.165 22.6158 23.905 23.8875C22.645 25.1592 21.1633 26.1625 19.46 26.8975C17.7567 27.6325 15.9367 28 14 28Z"
                      fill="#C0392B"
                    />
                  </svg>
                </button>
                <h3 className="ml-2 text-lg text-left text-primary-black font-medium">
                  Additional Driver {index + 1}
                </h3>
              </div>
              {/* Name Field */}
              <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
                <label
                  htmlFor={`addDriverDetailsName-${driverDetails.id}`}
                  className="text-base text-center text-primary-black font-semibold"
                >
                  Name(as per NRIC)*
                </label>
                <input
                  id={`addDriverDetailsName-${driverDetails.id}`}
                  type="text"
                  value={driverDetails.name}
                  placeholder="UserName"
                  onChange={(e) =>
                    updateDriverDetails(driverDetails.id, {
                      name: e.target.value.toUpperCase(),
                    })
                  }
                  className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink border-[#CFD0D7] focus-visible:border-primary-pink"
                />
              </div>
              {/* ID Type Field */}
              <div className="relative pb-5 flex flex-col items-start gap-y-1 flex-[1_1_40%] w-auto h-auto">
                <span className="text-base text-center text-primary-black font-semibold">
                  ID Type
                </span>
                <SelectDropdown
                  id={`idType-${driverDetails.id}`}
                  placeholder="NRIC"
                  onChange={(val: string) =>
                    updateDriverDetails(driverDetails.id, {
                      idType: val,
                      idNo: "",
                    })
                  }
                  selected={driverDetails.idType}
                  optionList={[
                    { label: "NRIC", value: "NRIC" },
                    { label: "Passport", value: "Passport" },
                    { label: "Company", value: "Company" },
                  ]}
                />
              </div>
              {/* ID No. Field */}
              <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
                <label
                  htmlFor={`idNo-${driverDetails.id}`}
                  className="text-base text-center text-primary-black font-semibold"
                >
                  ID No.*
                </label>
                <input
                  id={`idNo-${driverDetails.id}`}
                  type="text"
                  value={driverDetails.idNo}
                  placeholder={
                    driverDetails.idType === "Passport"
                      ? "A12365498"
                      : driverDetails.idType === "Company"
                      ? "1344743-J"
                      : "123456-12-1234"
                  }
                  onChange={(e) => {
                    let { value } = e.target;
                    // remove all spaces from the text
                    value = value.replace(/\s+/g, "").toUpperCase();
                    if (driverDetails.idType === "NRIC") {
                      value = value.replace(/\D/g, "");
                      let formatValue = "";
                      for (let i = 0; i < value.length; i++) {
                        if (i === 5 || i === 7) {
                          formatValue += value[i] + "-";
                        } else {
                          formatValue += value[i];
                        }
                      }
                      value = formatValue;
                    } else if (driverDetails.idType === "Company") {
                      if (value.length === 7) {
                        if (value.length > prevValue.length) {
                          value += "-";
                        } else {
                          value = value.slice(0, value.length - 1);
                        }
                      }
                    }
                    prevValue = value;
                    e.target.value = value;
                    updateDriverDetails(driverDetails.id, {
                      idNo: value,
                    });
                  }}
                  className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink border-[#CFD0D7] focus-visible:border-primary-pink"
                />
              </div>
              {/* Relationship Field */}
              <div className="relative pb-5 flex flex-col items-start gap-y-1 flex-[1_1_40%] w-auto h-auto">
                <span className="text-base text-center text-primary-black font-semibold">
                  Relationship
                </span>
                <SelectDropdown
                  id={`relationship-${driverDetails.id}`}
                  placeholder="Insured"
                  onChange={(val: string) =>
                    updateDriverDetails(driverDetails.id, {
                      relationship: val,
                    })
                  }
                  selected={driverDetails.relationship}
                  optionList={[
                    { label: "Insured", value: "Insured" },
                    { label: "Parent", value: "Parent" },
                    { label: "Parent-in-law", value: "Parent-in-Law" },
                    { label: "Spouse", value: "Spouse" },
                    { label: "Child", value: "Child" },
                    { label: "Siblings", value: "Siblings" },
                    { label: "Co-worker", value: "Co-worker" },
                  ]}
                />
              </div>
              {/* Relationship Field */}
              <div className="relative pb-5 flex flex-col items-start gap-y-1 flex-[1_1_40%] w-auto h-auto">
                <span className="text-base text-center text-primary-black font-semibold">
                  Nationality
                </span>
                <SelectDropdown
                  id={`nationality-${driverDetails.id}`}
                  placeholder="Malayisa"
                  onChange={(val: string) =>
                    updateDriverDetails(driverDetails.id, {
                      nationality: val,
                    })
                  }
                  disabled={driverDetails.idType === "nric"}
                  selected={driverDetails.nationality}
                  optionList={[
                    { label: "Malaysia", value: "Malaysia" },
                    { label: "India", value: "India" },
                    { label: "Other", value: "Other" },
                  ]}
                />
              </div>
            </div>
          ))}
          {/* Add Additional Driver button */}
          <div className="flex items-center justify-start w-full">
            <button
              className="flex items-center justify-start w-auto"
              onClick={() => {
                dispatch({
                  type: AddDriverTypes.AddNewDriverDetails,
                  payload: {
                    id: nanoid(),
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
    </>
  );
};

export default AddOnsContainer;
