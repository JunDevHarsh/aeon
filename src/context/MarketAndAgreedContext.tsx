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
      "Variant": "ZZE142R-GEPGKEEW ALTIS E SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD] [NON RECOND ONLY] - 1794 CC",
      "AvCode": "TOYO10AU",
      "SumInsured": "37000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEW ALTIS E SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD] [NON RECOND ONLY]-HIGH - 1794 CC",
      "AvCode": "TOYO10AU-HI",
      "SumInsured": "38000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEW ALTIS E SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD] [NON RECOND ONLY]-LOW - 1794 CC",
      "AvCode": "TOYO10AU-LO",
      "SumInsured": "36000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEY ALTIS G SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD] [NON RECOND ONLY] - 1794 CC",
      "AvCode": "TOYO10AV",
      "SumInsured": "41000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEY ALTIS G SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD] [NON RECOND ONLY]-HIGH - 1794 CC",
      "AvCode": "TOYO10AV-HI",
      "SumInsured": "42000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEY ALTIS G SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD] [NON RECOND ONLY]-LOW - 1794 CC",
      "AvCode": "TOYO10AV-LO",
      "SumInsured": "40000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEW ALTIS E SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD (SPORTY)] [NON RECOND ONLY] - 1794 CC",
      "AvCode": "TOYO10AW",
      "SumInsured": "38000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEW ALTIS E SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD (SPORTY)] [NON RECOND ONLY]-HIGH - 1794 CC",
      "AvCode": "TOYO10AW-HI",
      "SumInsured": "39000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEW ALTIS E SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD (SPORTY)] [NON RECOND ONLY]-LOW - 1794 CC",
      "AvCode": "TOYO10AW-LO",
      "SumInsured": "37000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEY ALTIS G SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD (SPORTY)] [NON RECOND ONLY] - 1794 CC",
      "AvCode": "TOYO10AY",
      "SumInsured": "42000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEY ALTIS G SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD (SPORTY)] [NON RECOND ONLY]-HIGH - 1794 CC",
      "AvCode": "TOYO10AY-HI",
      "SumInsured": "43000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
    },
    {
      "Variant": "ZZE142R-GEPGKEEY ALTIS G SALOON (A)GATESHIFT 1.8I [4DOOR 4SPEED FWD (SPORTY)] [NON RECOND ONLY]-LOW - 1794 CC",
      "AvCode": "TOYO10AY-LO",
      "SumInsured": "41000.00",
      "VehicleEngineCC": 1794,
      "MakeYear": "2010"
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
