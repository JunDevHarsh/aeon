import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { Inputs } from "../form/UserRegistration";
import Select from "react-select";
import { SingleValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

const SelectDropdown = React.forwardRef<
  HTMLSelectElement,
  {
    id: string;
    optionList: OptionType[];
    initialValue: string | null;
    handleOnChange: (val: string) => void;
    error?: FieldError;
    options?: RegisterOptions<Inputs>;
  } & ReturnType<UseFormRegister<Inputs>>
>(({ id, name, optionList, initialValue, handleOnChange, error }, ref) => {
  const selectedOption = optionList.find(
    (optionItem) => initialValue && optionItem.value === initialValue
  );
  return (
    <>
      <Select
        name={name}
        id={id}
        options={optionList}
        components={{ IndicatorSeparator: () => null }}
        value={initialValue ? selectedOption : null}
        isSearchable={false}
        onChange={(singleValue: SingleValue<OptionType>) =>
          singleValue?.value && handleOnChange(singleValue.value)
        }
        placeholder="NRIC"
        styles={{
          dropdownIndicator: (base) => ({
            ...base,
            color: "#A5308A",
            ":hover": {
              color: "#A5308A",
            },
          }),
          control: (styles, state) => ({
            ...styles,
            backgroundColor: "white",
            color: "#272727",
            cursor: "pointer",
            borderColor: state.isFocused
              ? "#A5308A"
              : error
              ? "#e57398"
              : "#CFD0D7",
            ":hover": {
              borderColor: state.isFocused
                ? "#A5308A"
                : error
                ? "#df2c66"
                : "#b3b3b3",
            },
            minHeight: "34px",
            height: "auto",
            boxShadow: state.isFocused ? "0 0 0 1px #A5308A" : "none",
          }),
          singleValue: (base) => ({
            ...base,
            fontSize: "14px",
            fontWeight: "500",
          }),
          indicatorsContainer: (base) => ({
            ...base,
            height: "32px",
            width: "32px",
          }),
          placeholder: (base) => ({
            ...base,
            fontSize: "14px",
            color: error ? "#e57398" : "#808080",
          }),
          container: (base) => ({
            ...base,
            width: "100%",
          }),
          option: (styles, state) => {
            let bgColor: string = "white";
            let textColor: string = "#272727";
            if (state.isFocused) {
              bgColor = "#f3f3f3";
            }
            if (state.isSelected) {
              bgColor = "#A5308A";
              textColor = "#ffffff";
            }
            return {
              ...styles,
              backgroundColor: bgColor,
              color: textColor,
              cursor: "pointer",
            };
          },
        }}
      />
    </>
  );
});

export default SelectDropdown;
