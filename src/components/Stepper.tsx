import React from "react";

interface StepperProps {
  title: string;
  count: number;
  turn: "start" | "center" | "end";
  status: "pending" | "fulfilled" | "current";
}

const Stepper: React.FC<StepperProps> = ({ title, count, turn, status }) => {
  return (
    <div className="flex flex-col items-center w-[300px]">
      <div className="relative flex items-center justify-center w-full">
        <span
          className={`inline-block w-[calc(50%-10px)] h-[2px] ${
            turn !== "start"
              ? status === "pending"
                ? "bg-[#BDBDBD]"
                : "bg-primary-pink"
              : "bg-white"
          }`}
        />
        {status !== "fulfilled" ? (
          <span
            className={`inline-block w-5 h-5 text-sm text-center ${
              status === "pending"
                ? "text-[#BDBDBD] shadow-c-grey-white"
                : "text-primary-pink shadow-c-pink-white"
            } font-medium bg-white rounded-full`}
          >
            {count}
          </span>
        ) : (
          <span className="inline-block w-5 h-5 outline outline-2 outline-white">
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
          </span>
        )}
        <span
          className={`inline-block w-[calc(50%-10px)] h-[2px] ${
            turn !== "end"
              ? status === "pending"
                ? "bg-[#BDBDBD]"
                : "bg-primary-pink"
              : "bg-white"
          }`}
        />
      </div>
      <div className="hidden md:inline-block mt-2.5">
        <span className="text-sm text-center text-dark-1 font-medium">
          {title}
        </span>
      </div>
    </div>
  );
};

export default Stepper;
