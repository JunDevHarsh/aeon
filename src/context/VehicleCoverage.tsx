import React, { createContext, useEffect, useState } from "react";
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

const defaultCoverages = {
  market: {
    "XL T6 4D DOUBLE CAB PICK-UP 6 SP AUTO SPORTS MODE": {
      minValue: 12000,
      midValue: 14000,
      maxValue: 16000,
    },
    "XL (HI-RIDER) T6 4D DOUBLE CAB PICK-U 6 SP MANUA": {
      minValue: 13000,
      midValue: 15000,
      maxValue: 17000,
    },
  },
  agreed: {
    "XL T6 4D DOUBLE CAB PICK-UP 6 SP AUTO SPORTS MODE": {
      minValue: 15000,
      midValue: 17000,
      maxValue: 19000,
    },
    "XL (HI-RIDER) T6 4D DOUBLE CAB PICK-U 6 SP MANUA": {
      minValue: 14000,
      midValue: 16000,
      maxValue: 18000,
    },
  },
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
      variant: null,
      type: make,
      price: 0,
      value: null,
    },
    selectedCoverage: {
      type: "market",
      price: 14000,
    },
  });

  const { type, market, agreed } = state;

  useEffect(() => {
    console.log(type);
    if (type === "market") {
      if (market.variant) {
        const getVariant = market.variant as keyof typeof defaultCoverages.market;
        const getCoverageValues = defaultCoverages.market[getVariant];
        const { minValue, midValue, maxValue } = getCoverageValues;
        setState((prev) => ({
          ...prev,
          market: {
            ...prev.market,
            price: midValue,
            // value: getCoverageValues,
            value: {
              min: minValue,
              mid: midValue,
              max: maxValue,
            },
          },
        }));
      }
    } else {
      if (agreed.variant) {
        const getVariant = agreed.variant as
          | "XL T6 4D DOUBLE CAB PICK-UP 6 SP AUTO SPORTS MODE"
          | "XL (HI-RIDER) T6 4D DOUBLE CAB PICK-U 6 SP MANUA";
        const getCoverageValues: {
          minValue: number;
          midValue: number;
          maxValue: number;
        } = defaultCoverages.agreed[getVariant];
        const { minValue, midValue, maxValue } = getCoverageValues;
        setState((prev) => ({
          ...prev,
          agreed: {
            ...prev.agreed,
            price: midValue,
            // value: getCoverageValues,
            value: {
              min: minValue,
              mid: midValue,
              max: maxValue,
            },
          },
        }));
      }
    }
  }, [market.variant, agreed.variant]);

  return (
    <VehicleCoverageContext.Provider value={{ state, setState }}>
      {children}
    </VehicleCoverageContext.Provider>
  );
};

export default VehicleCoverageProvider;
