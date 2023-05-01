// import React from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import InputTextField from "../fields/InputText";
import DateOfBirthField from "../fields/DateOfBirth";
import SelectDropdown from "../fields/SelectDropdown";
import MobileNumberField from "../fields/MobileNumber";

type Inputs = {
  name: string;
  idNo: string;
  idType: string | null;
  dateOfBirth: string | null;
  email: string;
  mobileNumber: string;
  maritalStatus: "single" | "married";
  gender: "male" | "female";
  postalCode: string;
  drivingExp: string;
  address: string;
  state: string | null;
  city: string | null;
  nationality: string | null;
};

const DriverDetailsForm = () => {
  const {
    name,
    dateOfBirth,
    id,
    email,
    gender,
    mobileNumber,
    maritalStatus,
    drivingExp,
    postalCode,
    address,
  } = useSelector((state: RootState) => state.user);
  const {
    control,
    watch,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      name: name,
      dateOfBirth: dateOfBirth,
      idNo: id.no,
      idType: id.type,
      email: email,
      mobileNumber: mobileNumber,
      maritalStatus: maritalStatus,
      postalCode: postalCode,
      gender: gender,
      drivingExp: drivingExp,
      address: address.residence,
      city: address.city,
      nationality: address.nationality,
      state: address.state,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  return (
    <div className="relative max-w-xl w-full">
      <div className="inline-block w-full">
        <h2 className="text-2xl text-left text-primary-black font-bold">
          Driver Details
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="relative mt-4 w-full">
        <div className="grid grid-cols-2 gap-x-4 w-full">
          <InputTextField
            label="Name(as per NRIC)"
            name="name"
            register={register}
            errors={errors.name}
            placeholder="UserName"
            options={{
              required: {
                value: true,
                message: "Provide a name",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                event.currentTarget.value = value.toUpperCase();
              },
            }}
          />
          <Controller
            control={control}
            name="dateOfBirth"
            render={({ field }) => (
              <DateOfBirthField
                onChange={(date: Date | null) => field.onChange(date)}
                selected={field.value ? new Date(field.value) : null}
                disabled={true}
              />
            )}
          />
          {/* ID Type Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
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
                // validate: {
                //   notMa: (fieldValue) => {
                //     return fieldValue !== null || "Hell";
                //   },
                // },
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="selectedIdType"
                  disabled={true}
                  onChange={(val: string) => (
                    setValue("idType", val), clearErrors("idType")
                  )}
                  selected={value}
                  error={error}
                  optionList={[
                    { label: "NRIC", value: "nric" },
                    { label: "Passport", value: "passport" },
                    { label: "Company", value: "company" },
                  ]}
                />
              )}
            />
          </div>
          {/* ID No. Field */}
          <div className="flex items-center w-auto">
            <InputTextField
              label="ID/Company Reg No."
              name="idNo"
              register={register}
              errors={errors.idNo}
              placeholder="960116015377"
              options={{
                disabled: true,
              }}
            />
          </div>
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
          {/* Marital Status Field */}
          <div className="relative pb-2 flex flex-col gap-y-1 items-start w-full h-auto">
            <span className="text-base text-center text-primary-black font-semibold">
              Marital Status
            </span>
            <div className="flex items-center justify-start gap-x-2 w-full">
              {/* Single Value */}
              <div className="relative flex items-center justify-center w-auto">
                <input
                  id="maritalStatusSingle"
                  type="radio"
                  value="single"
                  className="peer absolute opacity-0"
                  checked={watch("maritalStatus") === "single"}
                  {...register("maritalStatus")}
                />
                <label
                  htmlFor="maritalStatusSingle"
                  className="px-1.5 flex items-center gap-x-2 border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                >
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      watch("maritalStatus") === "single"
                        ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    }`}
                  />
                  <span className="text-sm text-center text-dark-1 font-normal">
                    Single
                  </span>
                </label>
              </div>
              {/* Married Value */}
              <div className="relative flex items-center justify-center w-auto">
                <input
                  id="maritalStatusMarried"
                  type="radio"
                  value="married"
                  className="peer absolute opacity-0"
                  checked={watch("maritalStatus") === "married"}
                  {...register("maritalStatus")}
                />
                <label
                  htmlFor="maritalStatusMarried"
                  className="px-1.5 flex items-center gap-x-2 border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                >
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      watch("maritalStatus") === "married"
                        ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    }`}
                  />
                  <span className="text-sm text-center text-dark-1 font-normal">
                    Married
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* Gender Field */}
          <div className="relative pb-2 flex flex-col gap-y-1 items-start w-full h-auto">
            <span className="text-base text-center text-primary-black font-semibold">
              Gender
            </span>
            <div className="flex items-center justify-start gap-x-2 w-full">
              {/* Single Value */}
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
              {/* Female Value */}
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
          {/* Nationality Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="nationalityType"
              className="text-base text-center text-primary-black font-semibold"
            >
              Nationality
            </label>
            <Controller
              control={control}
              name="nationality"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="nationalityType"
                  onChange={(val: string) => (
                    setValue("nationality", val), clearErrors("nationality")
                  )}
                  selected={value}
                  error={error}
                  placeholder="Malaysia"
                  optionList={[
                    { label: "Malaysia", value: "malaysia" },
                    { label: "India", value: "india" },
                    { label: "Others", value: "others" },
                  ]}
                />
              )}
            />
          </div>
          {/* Driving Experience Field */}
          <InputTextField
            label="Driving Experience"
            name="drivingExp"
            placeholder="5"
            register={register}
            errors={errors.drivingExp}
            options={{
              maxLength: {
                value: 10,
                message: "Maximum 10 characters allowed.",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                value = value.replace(/\D/g, "");
                event.currentTarget.value = value;
              },
            }}
          />
          {/* Postal Code Field */}
          <InputTextField
            label="Address"
            name="address"
            placeholder="Address"
            register={register}
            errors={errors.address}
            options={{
              maxLength: {
                value: 250,
                message: "Maximum 250 characters allowed.",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
            }}
          />
          {/* State Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="stateType"
              className="text-base text-center text-primary-black font-semibold"
            >
              State
            </label>
            <Controller
              control={control}
              name="state"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="stateType"
                  onChange={(val: string) => (
                    setValue("state", val), clearErrors("state")
                  )}
                  selected={value}
                  error={error}
                  placeholder="State"
                  optionList={[
                    { label: "Sabah", value: "sabah" },
                    { label: "Sarawak", value: "sarawak" },
                    { label: "Johor", value: "johor" },
                  ]}
                />
              )}
            />
          </div>
          {/* City Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="cityType"
              className="text-base text-center text-primary-black font-semibold"
            >
              City
            </label>
            <Controller
              control={control}
              name="city"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="cityType"
                  onChange={(val: string) => (
                    setValue("city", val), clearErrors("city")
                  )}
                  selected={value}
                  error={error}
                  placeholder="City"
                  optionList={[
                    { label: "Malacca", value: "malacca" },
                    { label: "Kuala Terengganu", value: "kuala-terengganu" },
                  ]}
                />
              )}
            />
          </div>
          {/* Postal Code Field */}
          <InputTextField
            label="Postal Code"
            name="postalCode"
            placeholder="63000"
            register={register}
            errors={errors.postalCode}
            options={{
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
        </div>
      </form>
    </div>
  );
};

export default DriverDetailsForm;
