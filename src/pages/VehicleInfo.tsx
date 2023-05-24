import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VehicleInfoForm from "../components/form/VehicleInfo";
import LoadingAnimation from "../components/LoadingAnimation";

const VehicleInfoPage = () => {
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (showLoading) {
      const timer = setTimeout(() => navigate("/insurance"), 4000);
      window.scrollTo(0, 0);
      return () => clearTimeout(timer);
    }
  }, [showLoading]);

  return (
    <div className="relative mx-auto max-w-5xl w-full">
      <div className="block py-6 px-4 lg:pl-8 pr-4 w-full">
        {showLoading ? (
          <LoadingAnimation />
        ) : (
          <div className="block py-8 px-4 md:px-16 w-full bg-white rounded-2xl shadow-[0_8px_10px_0_#00000024]">
            <div className="block w-full">
              <h2 className="text-2xl sm:text-3xl text-center font-bold">
                Vehicle Details
              </h2>
            </div>
            <VehicleInfoForm setShowLoading={setShowLoading} />
          </div>
        )}
      </div>
    </div>
  );
};

export default VehicleInfoPage;
