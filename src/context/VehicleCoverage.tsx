import React, { createContext, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { NvicList } from "../store/slices/types";

export type VehicleCoverageStateType = {
  type: "market" | "agreed";
  market: {
    nvic: NvicList | null;
    nvicList: NvicList[];
  };
  agreed: {
    nvic: NvicList | null;
    nvicList: NvicList[];
  };
};

const defaultCoverage: VehicleCoverageStateType = {
  type: "market",
  market: {
    nvic: null,
    nvicList: [],
  },
  agreed: {
    nvic: null,
    nvicList: [],
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
  const { variant, nvicList } = useSelector(
    (state: RootState) => state.vehicle
  );
  const [state, setState] = useState<VehicleCoverageStateType>({
    type: "market",
    market: {
      nvic: variant,
      nvicList: nvicList,
    },
    agreed: {
      nvic: variant,
      nvicList: nvicList,
    },
  });

  // const { type, market, agreed } = state;

  // useEffect(() => {
  //   console.log(type);
  //   if (type === "market") {
  //   //   if (market.variant) {
  //   //     const getVariant =
  //   //       market.variant as keyof typeof defaultCoverages.market;
  //   //     const getCoverageValues = defaultCoverages.market[getVariant];
  //   //     const { minValue, midValue, maxValue } = getCoverageValues;
  //   //     setState((prev) => ({
  //   //       ...prev,
  //   //       market: {
  //   //         ...prev.market,
  //   //         price: midValue,
  //   //         // value: getCoverageValues,
  //   //         value: {
  //   //           min: minValue,
  //   //           mid: midValue,
  //   //           max: maxValue,
  //   //         },
  //   //       },
  //   //     }));
  //   //   }
  //   // } else {
  //   //   if (agreed.variant) {
  //   //     const getVariant = agreed.variant as
  //   //       | "XL T6 4D DOUBLE CAB PICK-UP 6 SP AUTO SPORTS MODE"
  //   //       | "XL (HI-RIDER) T6 4D DOUBLE CAB PICK-U 6 SP MANUA";
  //   //     const getCoverageValues: {
  //   //       minValue: number;
  //   //       midValue: number;
  //   //       maxValue: number;
  //   //     } = defaultCoverages.agreed[getVariant];
  //   //     const { minValue, midValue, maxValue } = getCoverageValues;
  //   //     setState((prev) => ({
  //   //       ...prev,
  //   //       agreed: {
  //   //         ...prev.agreed,
  //   //         price: midValue,
  //   //         // value: getCoverageValues,
  //   //         value: {
  //   //           min: minValue,
  //   //           mid: midValue,
  //   //           max: maxValue,
  //   //         },
  //   //       },
  //   //     }));
  //   //   }
  //   }
  // }, [market.variant, agreed.variant]);

  return (
    <VehicleCoverageContext.Provider value={{ state, setState }}>
      {children}
    </VehicleCoverageContext.Provider>
  );
};

export default VehicleCoverageProvider;
