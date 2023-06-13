import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import InputTextField from "../fields/InputText";
import SelectDropdown from "../fields/SelectDropdown";
import MobileNumberField from "../fields/MobileNumber";
import { useContext } from "react";
import {
  DriverTypes,
  MultiStepFormContext,
} from "../../context/MultiFormContext";
import { DriverDetails } from "../../context/types";

type Inputs = {
  name: string;
  email: string;
  mobileNumber: string;
  race: string | null;
  postalCode: string;
  occupation: string | null;
  drivingExp: string;
  address1: string;
  address2: string;
  address3: string;
  state: string;
  city: string | null;
  nationality: string | null;
  country: string | null;
};

const DriverDetailsForm = () => {
  const { dateOfBirth, id, gender, maritalStatus } = useSelector(
    (state: RootState) => state.user
  );
  const {
    store: {
      driverDetails: {
        name,
        address1,
        address2,
        address3,
        city,
        drivingExp,
        email,
        mobileNumber,
        nationality,
        occupation,
        postalCode,
        race,
        state,
      },
    },
    dispatch,
  } = useContext(MultiStepFormContext);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      email: email,
      city,
      drivingExp,
      mobileNumber,
      name: name,
      postalCode: postalCode,
      address1: address1,
      address2: address2,
      address3: address3,
      country: nationality,
      occupation: occupation,
      nationality: nationality,
      race: race,
      state: state,
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  function updateStoreValue(updateValue: Partial<DriverDetails>) {
    dispatch({
      type: DriverTypes.UpdateDriverInfo,
      payload: {
        updatedValues: updateValue,
      },
    });
  }

  return (
    <div className="relative max-w-xl w-full">
      <div className="inline-block w-full">
        <h2 className="text-2xl text-left text-primary-black font-bold">
          Insured Details
        </h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="relative mt-4 w-full">
        <div className="grid grid-cols-1 mobile-xl:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-x-4 w-full">
          {/* Name field */}
          <InputTextField
            label="Name(as per NRIC)"
            name="name"
            register={register}
            errors={errors.name}
            placeholder="Name"
            options={{
              required: {
                value: true,
                message: "Provide a name",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                value = value.toUpperCase();
                event.currentTarget.value = value;
                updateStoreValue({ name: value });
              },
            }}
          />
          {/* DOB Field */}
          <div className="relative pb-5 w-full">
            <div className="relative">
              <span className="inline-block mb-1 text-base text-left text-primary-black font-semibold">
                DOB
              </span>
              <div className="py-1.5 px-2 w-full text-sm text-left text-[#9ca3af] bg-[#fafafa] border border-solid border-[#CFD0D7] rounded cursor-default">
                {dateOfBirth?.toString()?.slice(0, 10) || "DOB"}
              </div>
            </div>
          </div>
          {/* ID Type Field */}
          <div className="relative pb-5 w-full">
            <div className="relative">
              <span className="inline-block mb-1 text-base text-left text-primary-black font-semibold">
                ID Type
              </span>
              <div className="py-1.5 px-2 w-full text-sm text-left text-[#9ca3af] bg-[#fafafa] border border-solid border-[#CFD0D7] rounded cursor-default">
                {id.type ?? "NRIC"}
              </div>
            </div>
          </div>
          {/* ID No. Field */}
          <div className="flex items-center w-auto">
            <div className="relative pb-5 w-full">
              <div className="relative">
                <span className="inline-block mb-1 text-base text-left text-primary-black font-semibold">
                  ID/Company Reg No.
                </span>
                <div className="py-1.5 px-2 w-full font-medium text-sm text-left text-[#9ca3af] bg-[#fafafa] border border-solid border-[#CFD0D7] rounded cursor-default">
                  {id.number || "92374887"}
                </div>
              </div>
            </div>
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
                let updatedValue = value.replace(/\D/g, "");
                event.currentTarget.value = updatedValue;
                updateStoreValue({ mobileNumber: updatedValue });
              },
            }}
          />
          {/* Email Field */}
          <InputTextField
            label="Email Address"
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
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                updateStoreValue({ email: value });
              },
            }}
          />
          {/* Marital Status Field */}
          <div className="relative pb-5 w-full">
            <div className="relative">
              <span className="inline-block mb-1 text-base text-left text-primary-black font-semibold">
                Marital Status
              </span>
              <div className="py-1.5 px-2 w-full text-sm text-left text-[#9ca3af] bg-[#fafafa] border border-solid border-[#CFD0D7] rounded cursor-default">
                {maritalStatus ?? "Single"}
              </div>
            </div>
          </div>
          {/* Gender Field */}
          <div className="relative pb-5 w-full">
            <div className="relative">
              <span className="inline-block mb-1 text-base text-left text-primary-black font-semibold">
                Gender
              </span>
              <div className="py-1.5 px-2 w-full text-sm text-left text-[#9ca3af] bg-[#fafafa] border border-solid border-[#CFD0D7] rounded cursor-default">
                {gender ?? "Male"}
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
                  onChange={(val: string) => {
                    setValue("nationality", val);
                    updateStoreValue({ nationality: val });
                  }}
                  selected={value}
                  error={error}
                  placeholder="Malaysia"
                  optionList={[
                    { label: "Malaysia", value: "Malaysia" },
                    { label: "India", value: "India" },
                    { label: "Others", value: "Others" },
                  ]}
                />
              )}
            />
          </div>
          {/* Race Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="raceType"
              className="text-base text-center text-primary-black font-semibold"
            >
              Race
            </label>
            <Controller
              control={control}
              name="race"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="raceType"
                  onChange={(val: string) => {
                    setValue("race", val);
                    updateStoreValue({ race: val });
                  }}
                  selected={value}
                  error={error}
                  placeholder="Chinese"
                  optionList={[
                    { label: "Chinese", value: "Chinese" },
                    { label: "Eurasian", value: "Eurasian" },
                    { label: "Malay", value: "Malay" },
                    { label: "Indian", value: "Indian" },
                    { label: "Others", value: "Others" },
                  ]}
                />
              )}
            />
          </div>
          {/* Occupation Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="occupationType"
              className="text-base text-center text-primary-black font-semibold"
            >
              Occupation
            </label>
            <Controller
              control={control}
              name="occupation"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="occupationType"
                  onChange={(val: string) => {
                    setValue("occupation", val);
                    updateStoreValue({ occupation: val });
                  }}
                  selected={value}
                  error={error}
                  placeholder="Teacher"
                  optionList={[
                    { label: "Teacher", value: "Teacher" },
                    { label: "Engineer", value: "Engineer" },
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
                const updatedValue = value.replace(/\D/g, "");
                event.currentTarget.value = updatedValue;
                updateStoreValue({ drivingExp: updatedValue });
              },
            }}
          />
          {/* Address 1 Field */}
          <InputTextField
            label="Address 1"
            name="address1"
            placeholder="Address"
            register={register}
            errors={errors.address1}
            options={{
              maxLength: {
                value: 250,
                message: "Maximum 250 characters allowed.",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                updateStoreValue({ address1: value });
              },
            }}
          />
          {/* Address 2 Field */}
          <InputTextField
            label="Address 2"
            name="address2"
            placeholder="Address"
            register={register}
            options={{
              maxLength: {
                value: 250,
                message: "Maximum 250 characters allowed.",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                updateStoreValue({ address2: value });
              },
            }}
          />
          {/* Address 3 Field */}
          <InputTextField
            label="Address 3"
            name="address3"
            placeholder="Address"
            register={register}
            options={{
              maxLength: {
                value: 250,
                message: "Maximum 250 characters allowed.",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                updateStoreValue({ address3: value });
              },
            }}
          />
          {/* Country Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="country"
              className="text-base text-center text-primary-black font-semibold"
            >
              Country
            </label>
            <Controller
              control={control}
              name="country"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="country"
                  onChange={(val: string) => {
                    setValue("country", val);
                    updateStoreValue({ country: val });
                  }}
                  selected={value}
                  error={error}
                  placeholder="Malaysia"
                  optionList={[
                    { label: "Malaysia", value: "Malaysia" },
                    { label: "India", value: "India" },
                  ]}
                />
              )}
            />
          </div>
          {/* State Field */}
          <InputTextField
            label="State"
            name="state"
            placeholder="State"
            register={register}
            options={{
              maxLength: {
                value: 100,
                message: "Maximum 100 characters allowed.",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                updateStoreValue({ state: value });
              },
            }}
          />
          {/* City Field */}
          <InputTextField
            label="City"
            name="city"
            placeholder="City"
            register={register}
            options={{
              maxLength: {
                value: 100,
                message: "Maximum 100 characters allowed.",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                updateStoreValue({ city: value });
              },
            }}
          />
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
                let updatedValue = value.replace(/\D/g, "");
                event.currentTarget.value = updatedValue;
                updateStoreValue({ postalCode: value });
              },
            }}
          />
        </div>
      </form>
    </div>
  );
};

export default DriverDetailsForm;
