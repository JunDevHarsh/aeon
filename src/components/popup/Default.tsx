import React from "react";

export type WarningPopupType = {
  isVisible: boolean;
  title: string | null;
  description: string | null;
};

type DefaultPopupProps = {
  title: string | null;
  description: string | null;
  setShowWarningPopup: React.Dispatch<React.SetStateAction<WarningPopupType>>;
};

const DefaultPopup: React.FC<DefaultPopupProps> = ({
  title,
  description,
  setShowWarningPopup,
}) => {
  function closeWarningPopup() {
    setShowWarningPopup({ isVisible: false, description: null, title: null });
  }
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-[rgba(0,0,0,0.7)] to-[rgba(0,0,0,0.7)] z-[20]">
      <div className="relative flex items-center justify-center h-screen w-screen">
        <div className="relative max-w-[412px] bg-white w-full rounded">
          <div className="px-6 py-4 flex items-center justify-between w-full">
            <h3 className="text-base text-center text-primary-black font-bold">
              {title}
            </h3>
            <button
              className="inline-block w-auto h-auto"
              onClick={closeWarningPopup}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18"
                  stroke="#6C6F75"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6 6L18 18"
                  stroke="#6C6F75"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <div className="inline-block px-6 py-4 w-full">
            <p className="text-base text-left text-primary-black font-medium">
              {description}
            </p>
          </div>
          <div className="px-6 py-4 flex items-center justify-end w-full border-t border-solid border-t-[#22222614]">
            <button
              onClick={closeWarningPopup}
              className="inline-block px-4 py-2 text-base text-center text-white bg-primary-blue font-medium rounded"
            >
              Understand
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefaultPopup;
