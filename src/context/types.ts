/*
---------------Types---------------
*/

import { InsurerQuoteType } from "../data/listOfQuotes";

// CurrentStep State
export type CurrentStepState = {
  currentStep: number;
};

export type VehicleCoverage = {
  type: "market" | "agreed";
  market: {
    min: number;
    mid: number;
    max: number;
    selected: number;
  };
  agreed: {
    min: number;
    mid: number;
    max: number;
    selected: number;
  };
};

// Steps State
export type Steps = {
  id: string;
  title: string;
};

// MultiFormState Types
export type MultiStepFormState = {
  addOns: AddOns[];
  addDriverDetails: AdditionalDriverDetails[];
  driverDetails: DriverDetails;
};

// AddOns types
export type AddOns = {
  id: string;
  title: string;
  isSelected: boolean;
  isEditable: boolean;
  description: string;
  price: number;
  imgName: string;
};

// Additional Driver Details
export type AdditionalDriverDetails = {
  id: string;
  name: string;
  idType: string | null;
  idNo: string;
  relationship: string | null;
  nationality: string | null;
};

// Driver Details
export type DriverDetails = {
  name: string;
  mobileNumber: string;
  email: string;
  nationality: string | null;
  race: string | null;
  drivingExp: string;
  occupation: string | null;
  address1: string;
  address2: string;
  address3: string;
  city: string;
  state: string;
  country: string | null;
  postalCode: string;
};

export type ActionMap<M extends { [index: string]: any }> = {
  [Key in keyof M]: M[Key] extends undefined
    ? {
        type: Key;
      }
    : {
        type: Key;
        payload: M[Key];
      };
};


/*
--------------------------------------------------
----------QuoteListing Context Types--------------
--------------------------------------------------
*/

// type for props
export type QuoteListingPropType = {
  children: React.ReactNode;
}

export interface InsurerQuoteStateType extends InsurerQuoteType {
  isSelected: boolean;
}

// type for context
export type QuoteListingStateType = {
  quotes: InsurerQuoteStateType[];
  filter: QuotesFilterType;
}

// type for sort dropdown
export type QuotesFilterType = {
  sort: string | null;
  plan: QuotesFilterPlanType[];
}

export type QuotesFilterPlanType = {
  value: string;
  label: string;
  isSelected: boolean;
}