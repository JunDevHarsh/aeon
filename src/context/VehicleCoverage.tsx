import React, { createContext, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export type VehicleCoverageStateType = {
  type: "market" | "agreed";
  isContainerVisible: boolean;
  market: {
    variant: string | null;
    price: number;
    value: {
      min: number;
      mid: number;
      max: number;
    } | null;
  };
  agreed: {
    variant: string | null;
    type: string | null;
    price: number;
    value: {
      min: number;
      mid: number;
      max: number;
    } | null;
  };
  selectedCoverage: {
    type: "market" | "agreed";
    price: number;
  } | null;
};

const defaultCoverage: VehicleCoverageStateType = {
  type: "market",
  isContainerVisible: false,
  market: {
    variant: null,
    price: 0,
    value: null,
  },
  agreed: {
    variant: null,
    type: null,
    price: 0,
    value: null,
  },
  selectedCoverage: null,
};

export const VehicleCoverageContext = createContext<{
  state: VehicleCoverageStateType;
  setState: React.Dispatch<React.SetStateAction<VehicleCoverageStateType>>;
}>({ state: defaultCoverage, setState: () => null });

const VehicleCoverageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { make, variant } = useSelector((state: RootState) => state.vehicle);
  const [state, setState] = useState<VehicleCoverageStateType>({
    type: "market",
    isContainerVisible: false,
    market: {
      variant: variant,
      price: 14000,
      value: {
        min: 12000,
        mid: 14000,
        max: 16000,
      },
    },
    agreed: {
      variant: variant,
      type: make,
      price: 17000,
      value: {
        min: 15000,
        mid: 17000,
        max: 19000,
      },
    },
    selectedCoverage: {
      type: "market",
      price: 14000,
    },
  });

  return (
    <VehicleCoverageContext.Provider value={{ state, setState }}>
      {children}
    </VehicleCoverageContext.Provider>
  );
};

export default VehicleCoverageProvider;
