/*---------------User Types---------------*/
// User State
export type UserStateType = {
  id: UserIdType; // User ID
  name: string; // Username
  maritalStatus: string | null; // Marital Status
  mobileNumber: string; // Mobile Number
  email: string; // Email
  postalCode: string; // Postal Code
  race: string | null;
  occupation: string | null;
  gender: "male" | "female"; // Gender
  dateOfBirth: string | null; // Date Of Birth
  drivingExp: string; // Driviing Experience
  address: AddressType; // Address
  city: string | null; // City
  state: string | null; // State
  nationality: string | null; // Nationality
};

// UserId
export type UserIdType = {
  type: string; // ID Type
  no: string; // ID Number
};

// Address
export type AddressType = {
  address1: string; // Address: Mandatory
  address2?: string; // Address: Optional
  address3?: string; // Address: Optional
};

/*-----Reducer Payload Action-----*/
export type UserIdInputs = {
  userIdNo: string;
  userIdType: string;
};

/*---------------Vehicle Types---------------*/
// Vehicle State
export type VehicleStateType = {
  vehicleLicenseId: string;
  contractNumber: string;
  avMakeCode: string;
  makeCode: string;
  variant: NvicList | null;
  vehicleMake: string;
  modelCode: string;
  vehicleModel: string;
  vehicleEngineCC: string;
  vehicleEngine: string;
  vehicleChassis: string;
  drivers: number;
  region: string | null;
  periodOfCoverage: string;
  yearOfManufacture: string;
  seatingCapacity: number;
  ncdPercentage: number;
  polEffectiveDate: string,
  polExpiryDate: string;
  nvicList: NvicList[];
  reconIndicator: "yes" | "no";
  requestId: string;
};

export type NvicList = {
  nvic: string;
  vehicleMarketValue: number;
  vehicleVariant: string;
};

/*-----Reducer Payload Action-----*/
export type UserBasicInfoInputs = {
  maritalStatus: string | null;
  gender?: "male" | "female";
  mobileNumber: string;
  email: string;
  postalCode: string;
  dateOfBirth?: string | null;
};

/*---------------Insurance Types---------------*/
// Provider State
export type ProviderStateType = {
  companyId: string;
  companyName: string;
  price: number;
};

export type CoverageStateType = {
  type: "market" | "aggreed";
  value: number;
};

export type InsuranceStateType = {
  type: "new" | "renewal";
  vehicle: string;
  provider: ProviderStateType | null;
  coverage: CoverageStateType | null;
  referralCode: string | null;
  currentStep: number;
  finalPrice: string;
};
