/*
---------------Types---------------
*/

// CurrentStep State
export type CurrentStepState = {
  currentStep: number;
};

// Insurance State
export type InsuranceState = {
  provider: ProviderState | null;
};

// Provider State
export type ProviderState = {
  id: string;
  name: string;
  price: string;
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
  description: string;
  price: number;
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
