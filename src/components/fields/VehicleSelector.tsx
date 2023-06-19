import React from "react";
// images
import CarImg from "../../assets/images/car_vehicle.png";
import BikeImg from "../../assets/images/motorcycle_vehicle.png";

type VehicleSelectorProps = {
  vehicleType: string;
  setVehicleType: (value: React.SetStateAction<"car" | "motorcycle">) => void;
};

const VehicleSelector = ({
  vehicleType,
  setVehicleType,
}: VehicleSelectorProps) => {
  return (
    <div className="block my-4 w-full">
      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        {/* car insurance checkbox */}
        <div className="relative w-auto">
          <input
            type="radio"
            name="vehicleType"
            id="vehicleTypeCar"
            value="car"
            onChange={() => setVehicleType("car")}
            className="peer absolute top-0 left-0 -z-10 opacity-0"
          />
          <label
            htmlFor="vehicleTypeCar"
            className={`relative px-2.5 flex items-center justify-start w-auto border border-solid rounded cursor-pointer outline-2 outline outline-transparent peer-focus-visible:outline-primary-black ${
              vehicleType === "car"
                ? "bg-[#F8F9FF] border-[#4B5EAA]"
                : "bg-white border-[#8A8A8A]"
            }`}
          >
            <span
              className={`inline-block w-2 mobile-m:w-3 h-2 mobile-m:h-3 rounded-full ${
                vehicleType === "car"
                  ? "bg-[#4B5EAA] shadow-selected"
                  : "bg-white shadow-unselected"
              }`}
            />
            <img
              src={CarImg}
              onLoad={() => console.log("Loaded")}
              alt="car-vehicle-img"
              className="ml-3 mr-1 w-9 mobile-m:w-auto h-auto"
              aria-label="Image of car vehicle"
            />
            <span
              className="text-lg mobile-m:text-xl text-center text-primary-black font-bold whitespace-nowrap"
              aria-label="Vehicle text"
            >
              Car Insurance
            </span>
          </label>
        </div>
        {/* motorcycle insurance checkbox */}
        <div className="relative mt-4 md:mt-0 ml-0 md:ml-4 w-auto">
          <input
            type="radio"
            name="vehicleType"
            id="vehicleTypeBike"
            value="motorcycle"
            onChange={() => setVehicleType("motorcycle")}
            className="peer absolute top-0 left-0 -z-10 opacity-0"
          />
          <label
            htmlFor="vehicleTypeBike"
            className={`relative px-2.5 flex items-center justify-start w-auto border border-solid rounded cursor-pointer outline-2 outline outline-transparent peer-focus-visible:outline-primary-black ${
              vehicleType === "motorcycle"
                ? "bg-[#F8F9FF] border-[#4B5EAA]"
                : "bg-white border-[#8A8A8A]"
            }`}
          >
            <span
              className={`inline-block w-2 mobile-m:w-3 h-2 mobile-m:h-3 rounded-full ${
                vehicleType === "motorcycle"
                  ? "bg-[#4B5EAA] shadow-selected"
                  : "bg-white shadow-unselected"
              }`}
            />
            <img
              src={BikeImg}
              alt="bike-vehicle-img"
              className="ml-3 mr-1 w-9 mobile-m:w-auto h-auto"
              aria-label="Image of bike vehicle"
            />
            <span
              className="text-lg mobile-m:text-xl text-center text-primary-black font-bold whitespace-nowrap"
              aria-label="Vehicle text"
            >
              Motorcycle Insurance
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;
