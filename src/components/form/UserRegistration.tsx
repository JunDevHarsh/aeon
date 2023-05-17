import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
// fields
import InputTextField from "../fields/InputText";
import SelectDropdown from "../fields/SelectDropdown";
import MobileNumberField from "../fields/MobileNumber";
import DateOfBirthField from "../fields/DateOfBirth";
import Code from "../button/Code";
// store
import { useDispatch } from "react-redux";
import { updateInsuranceState } from "../../store/slices/insurance";
import { updateUserId, updateUserState } from "../../store/slices/user";
import { updateVehicleRegNo } from "../../store/slices/vehicle";
// types
import { UserInsuranceInputs } from "./types";
import VehicleSelector from "../fields/VehicleSelector";

let prevValue: string = "";

// default value for user insurance form fields
const defaultUserInsuranceState: UserInsuranceInputs = {
  idNo: "",
  email: "",
  postalCode: "",
  idType: "NRIC",
  gender: "male",
  vehicleRegNo: "",
  mobileNumber: "",
  dateOfBirth: null,
  maritalStatus: "Single",
  insuranceType: "renewal",
  insuranceVehicle: "car",
};

const UserRegistrationForm = () => {
  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UserInsuranceInputs>({
    defaultValues: defaultUserInsuranceState,
  });
  const [vehicleType, setVehicleType] = useState<"car" | "motorcycle">("car");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // handle form subit
  const onSubmit: SubmitHandler<UserInsuranceInputs> = (
    data: UserInsuranceInputs
  ) => {
    const {
      insuranceType,
      email,
      gender,
      idNo,
      idType,
      maritalStatus,
      mobileNumber,
      postalCode,
      vehicleRegNo,
      dateOfBirth,
    } = data;
    // let { dateOfBirth } = data;
    // if (idType === "nric") {
    //   const year = parseInt(idNo.slice(0, 2));
    //   const month = parseInt(idNo.slice(2, 4));
    //   const day = parseInt(idNo.slice(4, 6));
    //   const currentYear = new Date().getFullYear() % 100;
    //   // Check if year should belong to the 19th or 20th century
    //   const century = year > currentYear ? 1900 : 2000;

    //   const birthYear = century + year;

    //   dateOfBirth = new Date(`${birthYear}-${month}-${day}`);
    //   setValue("dateOfBirth", dateOfBirth);
    // }
    // update insurance => type, vehicle
    dispatch(updateVehicleRegNo(vehicleRegNo));
    dispatch(
      updateInsuranceState({ type: insuranceType, vehicle: vehicleType })
    );
    // update user => id => type, no
    dispatch(updateUserId({ type: idType, no: idNo }));
    dispatch(
      updateUserState({
        email,
        gender,
        maritalStatus,
        mobileNumber,
        postalCode,
        dateOfBirth: dateOfBirth ? dateOfBirth.toISOString() : null,
      })
    );
    navigate("/vehicle-info");
  };

  const watchIDType: string | null = watch("idType");

  const regEx = {
    Passport: {
      pattern: /^[A-Z]{1}[0-9]{8}$/,
      errorMessage: "For e.g. A12365498",
    },
    NRIC: {
      pattern: /^\d{6}-\d{2}-\d{4}$/,
      errorMessage: "For e.g. 050505-12-2321",
    },
    Company: {
      pattern: /^[0-9]{7}-[A-Z]/g,
      errorMessage: "For e.g. 1234567-J",
    },
  };

  return (
    <>
      <VehicleSelector
        vehicleType={vehicleType}
        setVehicleType={setVehicleType}
      />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-6 w-full px-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-x-4 w-full">
          {/* Insurance Type Field */}
          <div className="relative pb-2 flex flex-col gap-y-1 items-start w-full h-auto">
            <span className="text-base text-center text-primary-black font-semibold">
              Type*
            </span>
            <div className="flex items-center justify-start gap-x-2 w-full">
              <div className="relative flex items-center justify-center w-auto">
                <input
                  id="insuranceTypeNew"
                  type="radio"
                  value="new"
                  className="peer absolute opacity-0 -z-10"
                  checked={watch("insuranceType") === "new"}
                  {...register("insuranceType")}
                />
                <label
                  htmlFor="insuranceTypeNew"
                  className="px-1.5 flex items-center gap-x-2 border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                >
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      watch("insuranceType") === "new"
                        ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    }`}
                  />
                  <span className="text-sm text-center text-dark-1 font-normal">
                    New
                  </span>
                </label>
              </div>
              <div className="relative flex items-center justify-center w-auto">
                <input
                  id="insuranceTypeRenewal"
                  type="radio"
                  value="renewal"
                  className="peer absolute opacity-0 -z-10"
                  checked={watch("insuranceType") === "renewal"}
                  {...register("insuranceType")}
                />
                <label
                  htmlFor="insuranceTypeRenewal"
                  className="px-1.5 flex items-center gap-x-2 border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                >
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      watch("insuranceType") === "renewal"
                        ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    }`}
                  />
                  <span className="text-sm text-center text-dark-1 font-normal">
                    Renewal
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Vehicle Reg. No. Field */}
          <InputTextField
            label="Vehicle Registration No."
            name="vehicleRegNo"
            register={register}
            errors={errors.vehicleRegNo}
            placeholder="ABC1234"
            options={{
              maxLength: {
                value: 20,
                message: "Maximum 20 characters allowed.",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                value = value.replace(/[^A-Z0-9]/gi, "");
                event.currentTarget.value = value.toUpperCase();
              },
            }}
          />
          {/* ID Type and ID No. Field */}
          <div className="flex items-center justify-between gap-x-2 w-full">
            <div className="relative pb-5 flex flex-col items-start gap-y-1 flex-[1_1_40%] w-auto h-auto">
              <label
                htmlFor="selectIdType"
                className="text-base text-center text-primary-black font-semibold"
              >
                ID Type*
              </label>
              <Controller
                control={control}
                name="idType"
                rules={{
                  validate: (val) => val !== null || "Select an option",
                }}
                render={({ field: { value }, fieldState: { error } }) => (
                  <SelectDropdown
                    id="selectedIdType"
                    onChange={(val: string) => {
                      setValue("idType", val);
                      if (value !== val) {
                        setValue("idNo", "");
                      }
                      prevValue = "";
                      clearErrors("idNo");
                      clearErrors("idType");
                    }}
                    selected={value}
                    placeholder="NRIC"
                    error={error}
                    optionList={[
                      { label: "NRIC", value: "NRIC" },
                      { label: "Passport", value: "Passport" },
                      { label: "Company", value: "Company" },
                    ]}
                  />
                )}
              />
            </div>
            <div className="flex items-center flex-[1_1_60%] w-auto">
              <InputTextField
                label="ID/Company Reg No."
                name="idNo"
                register={register}
                errors={errors.idNo}
                placeholder={
                  watchIDType === "Passport"
                    ? "A12365498"
                    : watchIDType === "Company"
                    ? "1344743-J"
                    : "123456-12-1234"
                }
                options={{
                  maxLength: {
                    value: 20,
                    message: "Maximum 20 characters allowed.",
                  },
                  required: {
                    value: true,
                    message: "Field can't be empty",
                  },
                  pattern: {
                    value: watchIDType
                      ? regEx[watchIDType as keyof typeof regEx]["pattern"]
                      : /^\d{6}-\d{2}-\d{4}$/,
                    message:
                      regEx[watchIDType as keyof typeof regEx]["errorMessage"],
                  },
                  onChange(event: React.ChangeEvent<HTMLInputElement>) {
                    // event.preventDefault();
                    let { value } = event.currentTarget;
                    // remove all spaces from the text
                    value = value.replace(/\s+/g, "").toUpperCase();
                    if (watchIDType === "NRIC") {
                      value = value.replace(/\D/g, "");
                      let formatValue = "";
                      for(let i = 0; i < value.length; i++){
                        if(i === 5 || i === 7){
                          formatValue += value[i] + "-";
                        }else{
                          formatValue += value[i];
                        }
                      }
                      value = formatValue;
                    } else if (watchIDType === "Company") {
                      if (value.length === 7) {
                        if (value.length > prevValue.length) {
                          value += "-";
                        } else {
                          value = value.slice(0, value.length - 1);
                        }
                      }
                    }
                    prevValue = value;
                    event.currentTarget.value = value;
                  },
                }}
              />
            </div>
          </div>
          {/* Postal Code Field */}
          <InputTextField
            label="Postal Code"
            name="postalCode"
            placeholder="63000"
            register={register}
            errors={errors.postalCode}
            options={{
              minLength: {
                value: 5,
                message: "Minimum 5 characters required",
              },
              maxLength: {
                value: 5,
                message: "Maximum 5 characters allowed.",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                value = value.replace(/\D/g, "");
                event.currentTarget.value = value;
              },
            }}
          />
          {/* Marital Status Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 flex-[1_1_40%] w-auto h-auto">
            <label
              htmlFor="selectMaritalStatus"
              className="text-base text-center text-primary-black font-semibold"
            >
              Marital Status*
            </label>
            <Controller
              control={control}
              name="maritalStatus"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="selectMaritalStatus"
                  onChange={(val: string) => (
                    setValue("maritalStatus", val), clearErrors("maritalStatus")
                  )}
                  placeholder="Single"
                  selected={value}
                  error={error}
                  optionList={[
                    { label: "Single", value: "Single" },
                    { label: "Married", value: "Married" },
                    { label: "Divorced", value: "Divorced" },
                    { label: "Widowed", value: "Widowed" },
                  ]}
                />
              )}
            />
          </div>
          {watchIDType && watchIDType === "passport" && (
            <>
              {/* Gender Field */}
              <div className="relative pb-2 flex flex-col gap-y-1 items-start w-full h-auto">
                <span className="text-base text-center text-primary-black font-semibold">
                  Gender*
                </span>
                <div className="flex items-center justify-start gap-x-2 w-full">
                  <div className="relative flex items-center justify-center w-auto">
                    <input
                      id="genderMale"
                      type="radio"
                      value="male"
                      className="peer absolute opacity-0"
                      checked={watch("gender") === "male"}
                      {...register("gender")}
                    />
                    <label
                      htmlFor="genderMale"
                      className="px-1.5 flex items-center gap-x-2 border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                    >
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          watch("gender") === "male"
                            ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                            : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        }`}
                      />
                      <span className="text-sm text-center text-dark-1 font-normal">
                        Male
                      </span>
                    </label>
                  </div>
                  <div className="relative flex items-center justify-center w-auto">
                    <input
                      id="genderFemale"
                      type="radio"
                      value="female"
                      className="peer absolute opacity-0"
                      checked={watch("gender") === "female"}
                      {...register("gender")}
                    />
                    <label
                      htmlFor="genderFemale"
                      className="px-1.5 flex items-center gap-x-2 border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                    >
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full ${
                          watch("gender") === "female"
                            ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                            : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        }`}
                      />
                      <span className="text-sm text-center text-dark-1 font-normal">
                        Female
                      </span>
                    </label>
                  </div>
                </div>
              </div>
              {/* Date Of Birth */}
              {/* <DateOfBirthField /> */}
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field }) => (
                  <DateOfBirthField
                    onChange={(date: Date | null) => field.onChange(date)}
                    selected={field.value}
                  />
                )}
              />
            </>
          )}
          {/* Mobile Number Field */}
          <MobileNumberField
            fixedValue="+60"
            id="mobileNumber1"
            label="Mobile Number"
            name="mobileNumber"
            placeholder="1234567890"
            register={register}
            errors={errors.mobileNumber}
            options={{
              minLength: {
                value: 7,
                message: "Minimum 7 characters are required",
              },
              maxLength: {
                value: 11,
                message: "Max 11 characters are allowed",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                value = value.replace(/\D/g, "");
                event.currentTarget.value = value;
              },
            }}
          />
          {/* Email Field */}
          <InputTextField
            label="Email"
            name="email"
            register={register}
            errors={errors.email}
            placeholder="user@mail.com"
            options={{
              maxLength: {
                value: 100,
                message: "Maximum 100 characters allowed.",
              },
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                message: "Invalid Email",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
            }}
          />

          <Code
            textToDisplay="I have a referral code"
            title="Referral Code"
            maxLength={10}
            placeholder="ASD7SFD"
          />
        </div>
        {/* Submit Button Stripe */}
        <div className="mt-4 flex flex-col items-center justify-center gap-y-2.5 w-full">
          <div className="py-1.5 px-2 flex items-center justify-center w-auto bg-[#2ECC7133] rounded">
            <svg
              width="21"
              height="20"
              viewBox="0 0 21 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.08333 18.3334C4.73611 18.3334 4.44097 18.2118 4.19791 17.9688C3.95486 17.7257 3.83333 17.4306 3.83333 17.0834V8.04171C3.83333 7.69448 3.95486 7.39935 4.19791 7.15629C4.44097 6.91323 4.73611 6.79171 5.08333 6.79171H6.54166V4.79171C6.54166 3.69448 6.92708 2.76046 7.69791 1.98962C8.46874 1.21879 9.40277 0.833374 10.5 0.833374C11.5972 0.833374 12.5312 1.21879 13.3021 1.98962C14.0729 2.76046 14.4583 3.69448 14.4583 4.79171V6.79171H15.9167C16.2639 6.79171 16.559 6.91323 16.8021 7.15629C17.0451 7.39935 17.1667 7.69448 17.1667 8.04171V17.0834C17.1667 17.4306 17.0451 17.7257 16.8021 17.9688C16.559 18.2118 16.2639 18.3334 15.9167 18.3334H5.08333ZM10.5 14.1667C10.9444 14.1667 11.3229 14.0139 11.6354 13.7084C11.9479 13.4028 12.1042 13.0348 12.1042 12.6042C12.1042 12.1875 11.9479 11.8091 11.6354 11.4688C11.3229 11.1285 10.9444 10.9584 10.5 10.9584C10.0556 10.9584 9.67708 11.1285 9.36458 11.4688C9.05208 11.8091 8.89583 12.1875 8.89583 12.6042C8.89583 13.0348 9.05208 13.4028 9.36458 13.7084C9.67708 14.0139 10.0556 14.1667 10.5 14.1667ZM7.79166 6.79171H13.2083V4.79171C13.2083 4.04171 12.9444 3.40282 12.4167 2.87504C11.8889 2.34726 11.25 2.08337 10.5 2.08337C9.74999 2.08337 9.11111 2.34726 8.58333 2.87504C8.05555 3.40282 7.79166 4.04171 7.79166 4.79171V6.79171Z"
                fill="#2ECC71"
              />
            </svg>
            <span className="text-sm text-center text-[#2ECC71] font-bold">
              Your data will be processed securely
            </span>
          </div>
          <button
            type="submit"
            className="relative py-3 px-4 flex items-center justify-center gap-x-2 max-w-[250px] w-full h-auto bg-primary-blue rounded-full"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                fill="#fff"
              />
            </svg>
            <span className="text-base text-center text-white font-medium">
              Submit
            </span>
          </button>
        </div>
      </form>
    </>
  );
};

export default UserRegistrationForm;
