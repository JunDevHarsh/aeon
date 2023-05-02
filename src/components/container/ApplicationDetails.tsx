import { useState, useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { InsuranceContext } from "../context/context";

const ApplicationDetailsContainer = () => {
  const { regNo, make, model, yearOfManufacture, engineNo, chasisNo, variant } =
    useSelector((state: RootState) => state.vehicle);
  const {
    state: { addDriverDetails },
  } = useContext(InsuranceContext);
  const [includeRoadTax, updateRoadTax] = useState<boolean>(false);

  const driverDetails = addDriverDetails.filter(
    (driver) =>
      driver.name || driver.relationship || driver.idType || driver.idNo
  );

  return (
    <div className="relative max-w-xl w-full">
      <div className="flex flex-col items-start w-full">
        <h2 className="text-xl text-center text-primary-black font-bold">
          Vehicle Details
        </h2>
        <div className="px-6 py-4 grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Car Registration No
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {regNo}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Car Make
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {make ?? "Honda"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Car Model
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {model ?? "Honda HRV"}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Manufacture Year
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {yearOfManufacture}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Engine No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {engineNo}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Chassis No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {chasisNo}
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Variant
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              {variant ?? "Honda HRV X3"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start w-full">
        <h2 className="text-xl text-center text-primary-black font-bold">
          Insured Details
        </h2>
        <div className="px-6 py-4 grid grid-cols-3 gap-4 w-full">
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Name
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              Ajay
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              ID No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              897678888
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              DOB
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              09/09/1994
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Mobile No.
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              018 678 5678
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Email
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              ajay@gmail.com
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Marital Status
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              Married
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Gender
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              Male
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Driving Experience
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              10 Years
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Nationality
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              Malaysia
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Address
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              376, Jalan Merak 16
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              State
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              Negeri Sembilan
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              City
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              Seremban
            </span>
          </div>
          <div className="flex flex-col items-start w-auto">
            <span className="text-base text-left text-primary-black font-bold">
              Postal Code
            </span>
            <span className="text-base text-left text-primary-black font-normal">
              7500
            </span>
          </div>
        </div>
      </div>
      {driverDetails.length !== 0 && (
        <div className="flex flex-col items-start w-full">
          <h2 className="text-xl text-center text-primary-black font-bold">
            Additional Driver Details
          </h2>

          {driverDetails.map((detail, index) => (
            <div key={detail.id} className="relative mt-2 w-full">
              <h3 className="text-lg text-left text-primary-black font-bold">
                Additional Driver {index + 1}
              </h3>
              <div className="px-6 py-2 grid grid-cols-3 gap-4 w-full">
                <div className="flex flex-col items-start w-auto">
                  <span className="text-base text-left text-primary-black font-bold">
                    Name
                  </span>
                  <span className="text-base text-left text-primary-black font-normal">
                    {detail.name}
                  </span>
                </div>
                <div className="flex flex-col items-start w-auto">
                  <span className="text-base text-left text-primary-black font-bold">
                    Relationship
                  </span>
                  <span className="text-base text-left text-primary-black font-normal">
                    {detail.relationship}
                  </span>
                </div>
                <div className="flex flex-col items-start w-auto">
                  <span className="text-base text-left text-primary-black font-bold">
                    ID Type
                  </span>
                  <span className="text-base text-left text-primary-black font-normal">
                    {detail.idType}
                  </span>
                </div>
                <div className="flex flex-col items-start w-auto">
                  <span className="text-base text-left text-primary-black font-bold">
                    ID No.
                  </span>
                  <span className="text-base text-left text-primary-black font-normal">
                    {detail.idNo}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-start w-full">
        <div className="relative flex items-center justify-center">
          <label
            htmlFor="roadTax"
            className="relative flex items-center justify-center w-auto cursor-pointer"
          >
            <input
              type="checkbox"
              id="roadTax"
              onChange={() => updateRoadTax((prev) => !prev)}
              className="peer absolute -z-10 opacity-0"
              checked={includeRoadTax}
            />
            {includeRoadTax ? (
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
            <div className="ml-3 flex flex-col items-start w-auto">
              <span className="text-base text-center text-primary-black font-normal">
                Do you want to include road tax?
              </span>
              <span className="text-sm text-left text-primary-pink font-normal">
                Our service representative will contact for road tax renewal
              </span>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsContainer;
