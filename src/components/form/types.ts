// user
export type UserInsuranceInputs = {
  insuranceType: "new" | "renewal";
  maritalStatus: string | null;
  vehicleRegNo: string;
  email: string;
  postalCode: string;
  gender: "male" | "female";
  idType: string | null;
  idNo: string;
  mobileNumber: string;
  dateOfBirth: Date | null;
  insuranceVehicle: "car" | "motorcycle";
};
