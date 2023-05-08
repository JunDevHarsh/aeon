import React, { useId } from "react";

interface CheckboxWithTextProps {
  id: string;
  text: string;
  isSelected: boolean;
  updateIsSelected: (id: string) => void;
}

const CheckboxWithTextField: React.FC<CheckboxWithTextProps> = ({
  id,
  text,
  isSelected,
  updateIsSelected,
}) => {
  const uid = useId();

  return (
    <div className="relative flex items-center justify-start">
      <label
        htmlFor={uid}
        className="relative flex items-center justify-center w-auto cursor-pointer"
      >
        <input
          type="checkbox"
          id={uid}
          onChange={() => updateIsSelected(id)}
          className="peer absolute -z-10 opacity-0"
          checked={isSelected}
        />
        {isSelected ? (
          <span className="peer-focus-visible:outline rounded-sm">
            <svg
              width="19"
              height="18"
              viewBox="0 0 19 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M7.975 12.975L15.2 5.725L14.125 4.65L7.975 10.825L5 7.85L3.925 8.925L7.975 12.975ZM2 18C1.6 18 1.25 17.85 0.95 17.55C0.65 17.25 0.5 16.9 0.5 16.5V1.5C0.5 1.1 0.65 0.75 0.95 0.45C1.25 0.15 1.6 0 2 0H17C17.4 0 17.75 0.15 18.05 0.45C18.35 0.75 18.5 1.1 18.5 1.5V16.5C18.5 16.9 18.35 17.25 18.05 17.55C17.75 17.85 17.4 18 17 18H2Z"
                fill="#4B5EAA"
              />
            </svg>
          </span>
        ) : (
          <span className="inline-block w-[19px] h-[18px] bg-white border border-solid border-primary-blue rounded-sm cursor-pointer peer-focus-visible:outline" />
        )}
        <span className="ml-1 text-base text-center text-primary-black font-normal">
          {text}
        </span>
      </label>
    </div>
  );
};

export default CheckboxWithTextField;
