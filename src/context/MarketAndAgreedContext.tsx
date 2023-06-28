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
  market: MarketVariantType;
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
  previousValue: "",
  variants: [],
  types: [],
  market: {
    nvic: "",
    vehicleMarketValue: 0,
    vehicleVariant: "",
  },
  agreed: {
    nvic: "",
    variant: "",
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
  const [state, dispatch] = useReducer(marketAgreedReducer, {
    ...initialState,
    previousValue: variant ? variant.vehicleMarketValue.toString() : "",
    variants: nvicList,
    market: variant ? variant : initialState.market,
  });
  return (
    <MarketAndAgreedContext.Provider value={{ state, dispatch }}>
      {children}
    </MarketAndAgreedContext.Provider>
  );
}

export default MarketAndAgreedProvider;
