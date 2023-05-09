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
