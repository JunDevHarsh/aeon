/*---------------User Types---------------*/
// User State
export type UserStateType = {
  id: UserIdType; // User ID
  name: string; // Username
  maritalStatus: string | null; // Marital Status
  mobileNumber: string; // Mobile Number
  email: string; // Email
  postalCode: string; // Postal Code
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
  regNo: string; // Vehicle Registration Number
  make: string | null; // Vehicle Make/Type
  model: string | null; // Vehicle Model
  yearOfManufacture: string; // Vehicle Manufacturing Year
  variant: string | null; // Vehicle Variant
  engineNo: string; // Vehicle Engine Number
  engineCC: string; // Vehicle Engine CC
  chasisNo: string; // Vehicle Chasis Number
  class: string; // Vehicle Class
  region: string | null; // Region
  drivers: string; // Vehicle Driver's Capacity
  seating: string; // Vehicle Total Seats
  ncd: string; // Vehicle's NCD
  reconIndicator: "yes" | "no";
  periodOfCoverage: string;
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
  vehicle: "car" | "motorcycle";
  provider: ProviderStateType | null;
  coverage: CoverageStateType | null;
  referralCode: string | null;
  currentStep: number;
  finalPrice: number;
};
