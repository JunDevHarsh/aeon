import { useState } from "react";
import { PlanType } from "../container/QuoteListings";
import Select, {
  ActionMeta,
  components,
  MultiValue,
  OptionProps,
} from "react-select";

type SelectMultiSearchProps = {
  defaultOptionList: PlanType[];
  selectedOptions: PlanType[];
  setSelectedOptions: (updatedFilterTypes: PlanType[]) => void;
};

const Option = (props: OptionProps<PlanType, true>) => {
  return (
    <components.Option {...props}>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          width: "18px",
          height: "18px",
        }}
      >
        {props.data?.isSelected ? (
          <svg
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <path
              d="M7.475 12.975L14.7 5.725L13.625 4.65L7.475 10.825L4.5 7.85L3.425 8.925L7.475 12.975ZM1.5 18C1.1 18 0.75 17.85 0.45 17.55C0.15 17.25 0 16.9 0 16.5V1.5C0 1.1 0.15 0.75 0.45 0.45C0.75 0.15 1.1 0 1.5 0H16.5C16.9 0 17.25 0.15 17.55 0.45C17.85 0.75 18 1.1 18 1.5V16.5C18 16.9 17.85 17.25 17.55 17.55C17.25 17.85 16.9 18 16.5 18H1.5Z"
              fill="#4B5EAA"
            />
          </svg>
        ) : (
          <svg
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <rect
              x="0.5"
              y="0.5"
              width="15"
              height="15"
              rx="1.5"
              fill="white"
              stroke="#BDBDBD"
            />
          </svg>
        )}
      </span>
      {props.children}
    </components.Option>
  );
};

const UpdatedMenu = (props: any) => {
  const {
    options,
    setOptions,
    shouldMenuVisible,
    setSelectedOptions,
    clearValue,
  } = props;

  function clearSelectedOptions() {
    const updatedOptions = options.map((option: PlanType) => ({
      ...option,
      isSelected: false,
    }));
    clearValue();
    setSelectedOptions(updatedOptions);
    setOptions(updatedOptions);
  }

  function addSelectedOptions() {
    setSelectedOptions(options);
    shouldMenuVisible(false);
  }

  return (
    <>
      <components.MenuList {...props}>
        <div>{props.children}</div>
        <div className="p-0.5 flex items-center justify-end gap-x-2 w-full border-t border-solid border-[#CFD8DC]">
          <button
            onClick={clearSelectedOptions}
            className="relative py-1 px-3.5 w-auto bg-white text-base text-center text-primary-blue font-medium"
          >
            Clear
          </button>
          <button
            onClick={addSelectedOptions}
            className="relative py-1 px-3.5 w-auto bg-primary-blue text-base text-center text-white font-medium rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
          >
            Apply
          </button>
        </div>
      </components.MenuList>
    </>
  );
};

const SelectMultiSearch: React.FC<SelectMultiSearchProps> = ({
  defaultOptionList,
  selectedOptions,
  setSelectedOptions,
}) => {
  const [options, setOptions] = useState<PlanType[]>(defaultOptionList);
  const [isMenuVisible, shouldMenuVisible] = useState<boolean>(false);

  function handleOnChange(_: any, actionMeta: ActionMeta<PlanType>) {
    const { action, option, removedValue } = actionMeta;
    let selectedOption: PlanType | undefined;
    if (action === "select-option" || action === "deselect-option") {
      if (option) {
        selectedOption = option;
      }
    } else {
      if (removedValue) {
        selectedOption = removedValue;
      }
    }
    if (selectedOption && typeof selectedOption) {
      const updatedOptions = options.map((option) =>
        option.value === selectedOption?.value
          ? { ...option, isSelected: !option.isSelected }
          : option
      );
      setOptions(updatedOptions);
    }
  }

  const optionsToDisplay = selectedOptions.filter(
    (option) => option.isSelected
  );

  function handleOnMenuClose() {
    shouldMenuVisible(false);
    setOptions(selectedOptions);
  }

  return (
    <div className="relative max-w-[245px] min-w-[245px] w-full">
      <button
        onClick={() => shouldMenuVisible((prev) => !prev)}
        className={`relative pl-2.5 py-1.5 w-full bg-white border border-solid border-[#CFD0D7] outline-2 outline focus-visible:outline-primary-pink rounded transition-[outline] duration-100 overflow-hidden ${
          isMenuVisible ? "outline-primary-pink" : "outline-transparent"
        }`}
      >
        <div className="flex items-center justify-between w-full">
          {optionsToDisplay.length === 0 ? (
            <span className="text-sm text-center text-[#808080] font-normal">
              Placeholder
            </span>
          ) : (
            <div className="selectedOptions flex items-center gap-x-2 w-full">
              {optionsToDisplay.map((option) => (
                <span
                  key={option.value}
                  className="px-1.5 py-0.5 text-xs text-left text-white font-normal whitespace-nowrap bg-primary-pink rounded"
                >
                  {option.label}
                </span>
              ))}
            </div>
          )}
          <span className="px-2 flex items-center justify-center h-full w-auto bg-white">
            <svg
              width="10"
              height="6"
              viewBox="0 0 10 6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.65114 5.57932L0.656123 1.58429C0.463447 1.39161 0.463447 1.07924 0.656123 0.88658L1.12208 0.420625C1.31442 0.228278 1.62616 0.227908 1.81896 0.419803L5 3.58594L8.18102 0.419803C8.37382 0.227908 8.68556 0.228278 8.8779 0.420625L9.34386 0.88658C9.53653 1.07926 9.53653 1.39163 9.34386 1.58429L5.34887 5.57932C5.15619 5.77198 4.84381 5.77198 4.65114 5.57932Z"
                fill="#A5308A"
              />
            </svg>
          </span>
        </div>
      </button>
      {isMenuVisible && (
        <div className="absolute top-[calc(100%+3px)] left-0 right-0 min-w-[170px] w-full z-10 bg-white border border-solid">
          <Select
            defaultValue={selectedOptions.filter((option) => option.isSelected)}
            // menuIsOpen={true}
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
            onMenuClose={handleOnMenuClose}
            isMulti={true}
            autoFocus={true}
            defaultMenuIsOpen={true}
            options={options}
            placeholder="Text Input"
            onChange={(
              newValue: MultiValue<PlanType>,
              actionMeta: ActionMeta<PlanType>
            ) => handleOnChange(newValue, actionMeta)}
            components={{
              IndicatorSeparator: () => null,
              DropdownIndicator: () => null,
              ClearIndicator: () => null,
              Option,
              Menu: (props) =>
                UpdatedMenu({
                  shouldMenuVisible,
                  setOptions,
                  setSelectedOptions,
                  ...props,
                }),
            }}
            styles={{
              control: (styles) => ({
                ...styles,
                backgroundColor: "#FAFAFA",
                color: "#272727",
                cursor: "text",
                boxShadow: "none",
                border: "none",
              }),
              menu: (base) => ({
                ...base,
                top: "82.5%",
                border: "none",
                borderRadius: "2px",
                boxShadow: "none",
              }),
              option: (styles, state) => {
                let bgColor: string = "white";
                let textColor: string = "#272727";
                if (state.isFocused) {
                  bgColor = "#E1F5FE";
                }
                return {
                  ...styles,
                  display: "flex",
                  alignItems: "center",
                  gap: "0 0.5rem",
                  backgroundColor: bgColor,
                  color: textColor,
                  cursor: "pointer",
                };
              },
              multiValue: (base) => ({
                ...base,
                border: "none",
              }),
              multiValueLabel: (base) => ({
                ...base,
                backgroundColor: "#A5308A",
                fontSize: "14px",
                letterSpacing: "1px",
                color: "#fff",
                borderRadius: "4px 0 0 4px",
              }),
              multiValueRemove: (base) => ({
                ...base,
                backgroundColor: "#7b2567",
                border: "1px solid #7b2567",
                borderLeft: "0px",
                borderRadius: "0 4px 4px 0",
                cursor: "pointer",
                color: "#fff",
                ":hover": {
                  backgroundColor: "#fff",
                  color: "#A5308A",
                },
              }),
              container: (base) => ({
                ...base,
                minWidth: "244px",
              }),
            }}
          />
        </div>
      )}
    </div>
  );
};

export default SelectMultiSearch;
