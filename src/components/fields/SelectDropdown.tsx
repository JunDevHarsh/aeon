import { FieldError } from "react-hook-form";
import Select from "react-select";
import { SingleValue } from "react-select";

type OptionType = {
  value: string;
  label: string;
};

const SelectDropdown = ({
  id,
  optionList,
  selected,
  placeholder,
  onChange,
  error,
  disabled,
}: {
  id: string;
  optionList: OptionType[];
  selected: string | null;
  placeholder?: string;
  onChange: (val: string) => void;
  error?: FieldError;
  disabled?: boolean;
}) => {
  const selectedOption = optionList.find(
    (optionItem) => selected && optionItem.value === selected
  );
  return (
    <>
      <Select
        id={id}
        options={optionList}
        components={{ IndicatorSeparator: () => null }}
        isDisabled={disabled}
        value={selected ? selectedOption : null}
        isSearchable={false}
        onChange={(singleValue: SingleValue<OptionType>) =>
          singleValue?.value && onChange(singleValue.value)
        }
        placeholder={placeholder}
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
          menu: (base) => ({
            ...base,
            zIndex: "11"
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
      {error && (
        <span
          role="alert"
          className="absolute bottom-0 left-0 text-sm text-left font-medium text-[#e57398]"
        >
          {error?.message}
        </span>
      )}
    </>
  );
};

export default SelectDropdown;
