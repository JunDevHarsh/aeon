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
import { OptionContext } from "../../context/OptionContext";
import FixedInputText from "../fields/FixedInputText";

type Inputs = {
  name: string;
  email: string;
  mobileNumber: string;
  race: string | null;
  postalCode: string;
  occupation: string | null;
  occupationOthers: string;
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
        occupationOthers,
        nationality,
        occupation,
        postalCode,
        race,
        state,
        errors,
      },
    },
    dispatch,
  } = useContext(MultiStepFormContext);

  const {
    store: { nationality: nationalityList, occupation: occupationList },
  } = useContext(OptionContext);

  const occupationOptions = occupationList.map((item: any) => ({
    label: item,
    value: item,
  }));

  const nationalityOptions = nationalityList.map((item: any) => ({
    label: item.Description,
    value: item.Description,
  }));

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    // formState: { errors },
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
      occupationOthers: occupationOthers,
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

  const occupationValue = watch("occupation");

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
          <div className="relative">
            <InputTextField
              label="Name (as per NRIC)"
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
                  updateStoreValue({
                    name: value,
                    errors: {
                      ...errors,
                      name: value === "" ? "Field can'bt empty" : "",
                    },
                  });
                },
              }}
            />
            {errors.name && (
              <span
                role="alert"
                className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
              >
                {errors.name}
              </span>
            )}
          </div>
          {/* DOB Field */}
          <FixedInputText
            title="DOB"
            value={
              dateOfBirth?.toString().split("-").reverse().join("-") ||
              "27-01-2023"
            }
          />
          {/* ID Type Field */}
          <FixedInputText title="ID Type" value={id.type || ""} />
          {/* ID No. Field */}
          <FixedInputText title="ID/Company Reg No." value={id.number} />
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
          <FixedInputText title="Marital Status" value={maritalStatus || ""} />
          {/* Gender Field */}
          <FixedInputText title="Gender" value={gender || ""} />
          {/* Nationality Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <div className="text-base text-center text-primary-black font-semibold">
              Nationality*
            </div>
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
                  optionList={nationalityOptions}
                />
              )}
            />
          </div>
          {/* Race Field */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <div className="text-base text-center text-primary-black font-semibold">
              Race*
            </div>
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
            <div className="text-base text-center text-primary-black font-semibold">
              Occupation*
            </div>
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
                    updateStoreValue({
                      occupation: val,
                      errors: {
                        ...errors,
                        occupation: "",
                      },
                    });
                  }}
                  selected={value}
                  error={error}
                  placeholder="Teacher/ Lecturer"
                  optionList={occupationOptions}
                />
              )}
            />
          </div>
          {/* Others Occupation Field */}
          {occupationValue === "Others" && (
            <div className="relative">
              <InputTextField
                label="Other Occupation"
                name="occupationOthers"
                placeholder="Peon"
                register={register}
                errors={errors.occupationOthers}
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
                    // const updatedValue = value.replace(/\D/g, "");
                    // event.currentTarget.value = updatedValue;
                    updateStoreValue({
                      occupationOthers: value,
                      errors: {
                        ...errors,
                        occupationOthers:
                          value === "" ? "Field can't be empty" : "",
                      },
                    });
                  },
                }}
              />
              {errors.occupationOthers && (
                <span
                  role="alert"
                  className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
                >
                  {errors.occupationOthers}
                </span>
              )}
            </div>
          )}
          {/* Driving Experience Field */}
          <div className="relative">
            <InputTextField
              label="Driving Experience"
              name="drivingExp"
              placeholder="Enter experience"
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
                  updateStoreValue({
                    drivingExp: updatedValue,
                    errors: {
                      ...errors,
                      drivingExp:
                        updatedValue === "" ? "Field can't be empty" : "",
                    },
                  });
                },
              }}
            />
            {errors.drivingExp && (
              <span
                role="alert"
                className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
              >
                {errors.drivingExp}
              </span>
            )}
          </div>
          {/* Address 1 Field */}
          <div className="relative">
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
                  updateStoreValue({
                    address1: value,
                    errors: {
                      ...errors,
                      address1: value === "" ? "Field can't be empty" : "",
                    },
                  });
                },
              }}
            />
            {errors.address1 && (
              <span
                role="alert"
                className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
              >
                {errors.address1}
              </span>
            )}
          </div>
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
            <div className="text-base text-center text-primary-black font-semibold">
              Country*
            </div>
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
                    updateStoreValue({
                      country: val,
                      errors: {
                        ...errors,
                        country: "",
                      },
                    });
                  }}
                  selected={value}
                  error={error}
                  placeholder="Malaysia"
                  optionList={nationalityOptions}
                />
              )}
            />
          </div>
          {/* State Field */}
          <div className="relative">
            <InputTextField
              label="State"
              name="state"
              placeholder="State"
              register={register}
              errors={errors.state}
              options={{
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters allowed.",
                },
                onChange(event: React.ChangeEvent<HTMLInputElement>) {
                  let { value } = event.currentTarget;
                  updateStoreValue({
                    state: value,
                    errors: {
                      ...errors,
                      state: value === "" ? "Field can't be empty" : "",
                    },
                  });
                },
              }}
            />
            {errors.state && (
              <span
                role="alert"
                className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
              >
                {errors.state}
              </span>
            )}
          </div>
          {/* City Field */}
          <div className="relative">
            <InputTextField
              label="City"
              name="city"
              placeholder="City"
              register={register}
              errors={errors.city}
              options={{
                maxLength: {
                  value: 100,
                  message: "Maximum 100 characters allowed.",
                },
                onChange(event: React.ChangeEvent<HTMLInputElement>) {
                  let { value } = event.currentTarget;
                  updateStoreValue({
                    city: value,
                    errors: {
                      ...errors,
                      city: value === "" ? "Field can't be empty" : "",
                    },
                  });
                },
              }}
            />
            {errors.city && (
              <span
                role="alert"
                className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
              >
                {errors.city}
              </span>
            )}
          </div>
          {/* Postal Code Field */}
          <FixedInputText title="Postal Code" value={postalCode} />
          {/* <InputTextField
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
          /> */}
        </div>
      </form>
    </div>
  );
};

export default DriverDetailsForm;
