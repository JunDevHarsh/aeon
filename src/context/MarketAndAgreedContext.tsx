import React, { createContext, useReducer } from "react";
import { ActionMap } from "./types";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
export type AgreedVariantType = {
  Variant: string;
  AvCode: string;
  SumInsured: string;
  VehicleEngineCC: number;
  MakeYear: string;
};

export type MarketVariantType = {
  nvic: string;
  vehicleMarketValue: number;
  vehicleVariant: string;
};

// export type GlobalStateOfSumInsured = {
//   type: "market" | "agreed";
//   market: {
//     nvic: MarketVariantType;
//     nvicList: MarketVariantType[];
//   };
// };

export enum UpdateValuation {
  UpdateType = "UPDATE_TYPE",
  UpdateVariant = "UPDATE_VARIANT",
  UpdateAgreedType = "UPDATE_AGREED_TYPE",
}

export type UpdateValuationPayload = {
  [UpdateValuation.UpdateType]: {
    type: "market" | "agreed";
  };
  [UpdateValuation.UpdateVariant]: {
    nvic: string;
    variant: string;
    marketValue: number;
    variantType: "market" | "agreed";
  };
  [UpdateValuation.UpdateAgreedType]: {
    avCode: string;
    sumInsured: string;
    type: string;
  };
};

export type UpdateValuationAction =
  ActionMap<UpdateValuationPayload>[keyof ActionMap<UpdateValuationPayload>];

type MarketAndAgreedState = {
  type: "market" | "agreed";
  variants: MarketVariantType[];
  previousValue: string;
  types: AgreedVariantType[];
  market: {
    nvic: string;
    marketValue: number;
    variant: string;
  };
  agreed: {
    nvic?: string;
    sumInsured: string;
    marketValue?: number;
    variant?: string;
    avCode: string;
    type: string;
  } | null;
};

const initialState: MarketAndAgreedState = {
  type: "market",
  previousValue: "36700",
  variants: [
    {
      nvic: "JAO20A",
      vehicleMarketValue: 36700,
      vehicleVariant: "ADVANCE 4 SP AUTOMATIC - 1329",
    },
    {
      nvic: "JAP20A",
      vehicleMarketValue: 33000,
      vehicleVariant: "PREMIUM X 4 SP AUTOMATIC - 1329",
    },
    {
      nvic: "JAQ20A",
      vehicleMarketValue: 31300,
      vehicleVariant: "PREMIUM X 5 SP MANUAL - 1329",
    },
  ],
  types: [
    {
      Variant: "SEDAN ADVANCE 1.3 (A) [4DOOR 4 SPEED] - 1329 CC",
      AvCode: "PERO16BP",
      SumInsured: "34000.00",
      VehicleEngineCC: 1329,
      MakeYear: "2016",
    },
    {
      Variant: "SEDAN ADVANCE 1.3 (A) [4DOOR 4 SPEED] -HIGH - 1329 CC",
      AvCode: "PERO16BP-HI",
      SumInsured: "35000.00",
      VehicleEngineCC: 1329,
      MakeYear: "2016",
    },
    {
      Variant: "SEDAN ADVANCE 1.3 (A) [4DOOR 4 SPEED] -LOW - 1329 CC",
      AvCode: "PERO16BP-LO",
      SumInsured: "33000.00",
      VehicleEngineCC: 1329,
      MakeYear: "2016",
    },
    // {
    //   Variant: "SEDAN PREMIUM X  1.3 (A) [4DOOR 4 SPEED] - 1329 CC",
    //   AvCode: "PERO16BQ",
    //   SumInsured: "30000.00",
    //   VehicleEngineCC: 1329,
    //   MakeYear: "2016",
    // },
    {
      Variant: "SEDAN PREMIUM X  1.3 (A) [4DOOR 4 SPEED] -HIGH - 1329 CC",
      AvCode: "PERO16BQ-HI",
      SumInsured: "31000.00",
      VehicleEngineCC: 1329,
      MakeYear: "2016",
    },
    {
      Variant: "SEDAN PREMIUM X  1.3 (A) [4DOOR 4 SPEED] -LOW - 1329 CC",
      AvCode: "PERO16BQ-LO",
      SumInsured: "29000.00",
      VehicleEngineCC: 1329,
      MakeYear: "2016",
    },
  ],
  market: {
    nvic: "JAO20A",
    marketValue: 36700,
    variant: "ADVANCE 4 SP AUTOMATIC - 1329",
  },
  agreed: {
    nvic: "JAO20A",
    variant: "ADVANCE 4 SP AUTOMATIC - 1329",
    avCode: "",
    sumInsured: "",
    type: "",
  },
};

export const MarketAndAgreedContext = createContext<{
  state: MarketAndAgreedState;
  dispatch: React.Dispatch<UpdateValuationAction>;
}>({
  state: initialState as MarketAndAgreedState,
  dispatch: () => null,
});

function marketAgreedReducer(
  state: MarketAndAgreedState,
  action: UpdateValuationAction
) {
  const { payload, type } = action;
  switch (type) {
    case UpdateValuation.UpdateType: {
      const { type: updatedType } = payload;
      return {
        ...state,
        type: updatedType,
      };
    }
    case UpdateValuation.UpdateVariant: {
      const { nvic, variant, marketValue, variantType } = payload;
      return {
        ...state,
        [variantType]: {
          ...state[variantType],
          nvic,
          variant,
          marketValue,
        },
      };
    }
    case UpdateValuation.UpdateAgreedType: {
      const { avCode, sumInsured, type } = payload;
      return {
        ...state,
        agreed: {
          ...state.agreed,
          avCode,
          sumInsured,
          type,
        },
      };
    }
    default:
      return state;
  }
}

function MarketAndAgreedProvider({ children }: { children: React.ReactNode }) {
  const { nvicList, variant } = useSelector(
    (state: RootState) => state.vehicle
  );
  console.log(nvicList, variant);
  const [state, dispatch] = useReducer(marketAgreedReducer, initialState);
  return (
    <MarketAndAgreedContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketAndAgreedContext.Provider>
  );
}

export default MarketAndAgreedProvider;
