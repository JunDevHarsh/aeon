import { updateVehicleState } from "../../store/slices/vehicle";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
import InputTextField from "../fields/InputText";
import SelectDropdown from "../fields/SelectDropdown";
// import CheckboxWithTextField from "../fields/CheckboxWithText";
import FixedInputTextField from "../fields/FixedInputText";
import { VehicleStateType } from "../../store/slices/types";
import axios from "axios";
import { useState } from "react";
import DefaultPopup from "../popup/Default";

const VehicleInfoForm = ({
  setShowLoading,
}: {
  setShowLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  // extract state from redux store using useSelector hook
  const {
    user: userState,
    vehicle: vehicleState,
    credentials: { session: sessionState, requestId },
  } = useSelector((state: RootState) => state);
  // extract variant options from vehicle state and map it to the format required by SelectDropdown component
  const variantOptionList = vehicleState.nvicList.map(({ vehicleVariant }) => ({
    label: vehicleVariant,
    value: vehicleVariant,
  }));
  // state for handlgin error
  const [error, setError] = useState<{
    isVisible: boolean;
    title: string | null;
    description: string | null;
  }>({
    isVisible: false,
    title: null,
    description: null,
  });
  // state for handling loading
  const [loading, setLoading] = useState<boolean>(false);
  // react hook form
  const {
    watch,
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<VehicleStateType>({
    defaultValues: vehicleState,
  });

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<VehicleStateType> = async (
    val: VehicleStateType
  ) => {
    // make api call to agiliux backend
    try {
      setLoading(true);
      const vehicleResponse = await axios.post(
        "https://app.agiliux.com/aeon/webservice.php",
        {
          operation: "createInquiry",
          sessionName: sessionState?.sessionName,
          element: JSON.stringify({
            tenant_id: "67b61490-fec2-11ed-a640-e19d1712c006",
            requestId: requestId,
            client: {
              phone: userState.mobileNumber,
              email1: userState.email,
              vatregno: userState.id.number,
              ind_dob: userState.dateOfBirth,
              ind_ppno: userState.id.number,
              client_idtype: userState.id.type,
              client_gender: userState.gender,
              main_ms: userState.maritalStatus,
              ic_no: userState.id.number,
            },
            inquiry: {
              vehclass: "Private Vehicle",
              leadsource: "Others",
              sales_stage: "Inquiry Created",
              period_from: userState.polEffectiveDate,
              period_to: userState.polExpiryDate,
            },
            vehicle: {
              reg_no: vehicleState.vehicleLicenseId,
              vehicle_make: vehicleState.vehicleMake,
              vehicle_model: vehicleState.vehicleModel,
              engine_no: vehicleState.vehicleEngine,
              engine_capacity: vehicleState.vehicleEngineCC,
              passenger_cap: vehicleState.seatingCapacity,
              vehncd: vehicleState.ncdPercentage,
              year_manufacture: vehicleState.yearOfManufacture,
              chasis_no: vehicleState.vehicleChassis,
              fl_location: val.region,
              veh_variant: val.variant,
            },
          }),
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setLoading(false);
      if (vehicleResponse.data.error) {
        setError({
          isVisible: true,
          title: "Something went wrong!",
          description:
            "We are unable to process your request at the moment. Please try again later.",
        });
        throw new Error(vehicleResponse.data.error.message);
      }
      if (vehicleResponse.status === 200) {
        dispatch(updateVehicleState(val));
        setShowLoading((prev) => !prev);
        return;
      } else {
        setError({
          isVisible: true,
          title: "Something went wrong!",
          description:
            "We are unable to process your request at the moment. Please try again later.",
        });
        throw new Error("Something went wrong!");
      }
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };
  // react hook form watch
  const watchReconIndicator = watch("reconIndicator");

  return (
    <>
      {error.isVisible && (
        <DefaultPopup
          title={error.title}
          description={error.description}
          setShowWarningPopup={setError}
        />
      )}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-6 w-full h-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-0 md:gap-x-4 w-full">
          {/* Vehicle Reg No. */}
          <FixedInputTextField
            title="Vehicle Registration No."
            value={vehicleState.vehicleLicenseId}
          />
          {/* Vehicle Make Field  */}
          {/* <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
          <label
            htmlFor="vehicleMake"
            className="text-base text-center text-primary-black font-semibold"
          >
            Vehicle Make*
          </label>
          <Controller
            control={control}
            name="make"
            rules={{
              validate: (val) => val !== null || "Select an option",
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <SelectDropdown
                id="vehicleMake"
                placeholder="Select Make"
                onChange={(val: string) => (
                  setValue("make", val), clearErrors("make")
                )}
                selected={value}
                error={error}
                optionList={[{ label: "PERODUA", value: "PERODUA" }]}
              />
            )}
          />
        </div> */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
            <span className="text-base text-center text-primary-black font-semibold">
              Vehicle Make*
            </span>
            <span className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium cursor-default border border-solid border-[#CFD0D7] rounded">
              {watch("vehicleMake")}
            </span>
          </div>
          {/* Vehicle Model Field  */}
          {/* <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
          <label
            htmlFor="vehicleModel"
            className="text-base text-center text-primary-black font-semibold"
          >
            Vehicle Model*
          </label>
          <Controller
            control={control}
            name="model"
            rules={{
              validate: (val) => val !== null || "Select an option",
            }}
            render={({ field: { value }, fieldState: { error } }) => (
              <SelectDropdown
                id="vehicleModel"
                placeholder="Select Model"
                onChange={(val: string) => (
                  setValue("model", val), clearErrors("model")
                )}
                selected={value}
                error={error}
                optionList={[
                  {
                    label: "AXIA",
                    value: "AXIA",
                  },
                ]}
              />
            )}
          />
        </div> */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
            <span className="text-base text-center text-primary-black font-semibold">
              Vehicle Model*
            </span>
            <span className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium cursor-default border border-solid border-[#CFD0D7] rounded">
              {watch("vehicleModel")}
            </span>
          </div>
          {/* Vehicle Variant Field  */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="vehicleVariant"
              className="text-base text-center text-primary-black font-semibold"
            >
              Vehicle Variant*
            </label>
            {variantOptionList.length === 1 ? (
              <span className="py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium cursor-default border border-solid border-[#CFD0D7] rounded">
                {variantOptionList[0].value}
              </span>
            ) : (
              <Controller
                control={control}
                name="variant"
                rules={{
                  validate: (val) => val !== null || "Select an option",
                }}
                render={({ field: { value }, fieldState: { error } }) => (
                  <SelectDropdown
                    id="vehicleVariant"
                    placeholder="Select Variant"
                    onChange={(val: string) => {
                      const selectedVariant = vehicleState.nvicList.find(
                        (variant) => variant.vehicleVariant === val
                      );
                      if (selectedVariant) {
                        setValue("variant", selectedVariant);
                        clearErrors("variant");
                      }
                    }}
                    selected={value?.vehicleVariant || null}
                    error={error}
                    optionList={variantOptionList}
                  />
                )}
              />
            )}
          </div>
          {/* Engine CC Field */}
          <FixedInputTextField
            title="Engine CC"
            value={vehicleState.vehicleEngineCC}
          />
          {/* Engine No. Field */}
          <FixedInputTextField
            title="Engine No."
            value={vehicleState.vehicleEngine}
          />
          {/* Vehicle Class Field */}
          <FixedInputTextField title="Vehicle Class" value="Private Class" />
          {/* Seating Field */}
          <FixedInputTextField
            title="Seating"
            value={vehicleState.seatingCapacity.toString()}
          />
          {/* Driver Field */}
          <InputTextField
            label="Drivers"
            name="drivers"
            register={register}
            errors={errors.drivers}
            placeholder="2"
            options={{
              validate: {
                sadsad: (val: string) =>
                  parseInt(val) <= 10 || "Can't exceed more than 10",
              },
              maxLength: {
                value: 2,
                message: "Maximum 2 characters allowed.",
              },
              required: {
                value: true,
                message: "Field can't be empty",
              },
              onChange(event: React.ChangeEvent<HTMLInputElement>) {
                let { value } = event.currentTarget;
                // remove all spaces from the text
                value = value.replace(/\D/g, "");
                event.currentTarget.value = value;
              },
            }}
          />
          {/* NCD Field */}
          <FixedInputTextField
            title="NCD"
            value={vehicleState.ncdPercentage.toString()}
          />
          {/* Vehicle Model Field  */}
          <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
            <label
              htmlFor="vehicleModel"
              className="text-base text-center text-primary-black font-semibold"
            >
              Region*
            </label>
            <Controller
              control={control}
              name="region"
              rules={{
                validate: (val) => val !== null || "Select an option",
              }}
              render={({ field: { value }, fieldState: { error } }) => (
                <SelectDropdown
                  id="region"
                  placeholder="West Malaysia"
                  onChange={(val: string) => (
                    setValue("region", val), clearErrors("region")
                  )}
                  selected={value}
                  error={error}
                  optionList={[
                    {
                      label: "West Malaysia",
                      value: "West Malaysia",
                    },
                    {
                      label: "East Malaysia",
                      value: "East Malaysia",
                    },
                  ]}
                />
              )}
            />
          </div>
          {/* Period Of Coverage */}
          <FixedInputTextField
            title="Period of Coverage"
            value={vehicleState.periodOfCoverage}
          />
          {/* Recond Indicator */}
          <div className="relative pb-2 flex flex-col gap-y-1 items-start w-full h-auto">
            <span className="text-base text-center text-primary-black font-semibold">
              Recon Indicator
            </span>
            <div className="flex items-center justify-start w-full">
              <div className="relative flex items-center justify-center w-auto">
                <input
                  id="reconIndicatorYes"
                  type="radio"
                  value="yes"
                  className="peer absolute opacity-0 -z-10"
                  checked={watchReconIndicator === "yes"}
                  {...register("reconIndicator")}
                />
                <label
                  htmlFor="reconIndicatorYes"
                  className="px-1.5 flex items-center border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                >
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      watchReconIndicator === "yes"
                        ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    }`}
                  />
                  <span className="ml-2 text-sm text-center text-dark-1 font-normal">
                    Yes
                  </span>
                </label>
              </div>
              <div className="ml-2 relative flex items-center justify-center w-auto">
                <input
                  id="reconIndicatorNo"
                  type="radio"
                  value="no"
                  className="peer absolute opacity-0 -z-10"
                  checked={watchReconIndicator === "no"}
                  {...register("reconIndicator")}
                />
                <label
                  htmlFor="reconIndicatorNo"
                  className="px-1.5 flex items-center border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
                >
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      watchReconIndicator === "no"
                        ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                        : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    }`}
                  />
                  <span className="ml-2 text-sm text-center text-dark-1 font-normal">
                    No
                  </span>
                </label>
              </div>
            </div>
          </div>
          {/* E-hailing services */}
          {/* <Controller
          control={control}
          name="hailingServices"
          render={({ field: { value } }) => (
            <CheckboxWithTextField
              id="hailingServices"
              isSelected={value}
              text="This Vehicle used for E-Hailing Services"
              updateIsSelected={() => setValue("hailingServices", !value)}
            />
          )}
        /> */}
        </div>
        {/* Submit Form */}
        <div className="mt-4 flex flex-col items-center justify-center w-full">
          <div className="py-1.5 px-2 mr-2.5 mb-2 flex items-center justify-center w-auto bg-[#2ECC7133] rounded">
            <svg
              width={21}
              height={20}
              viewBox="0 0 21 20"
              fill="#fff"
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
          {loading ? (
            <button
              disabled
              className="relative py-3 px-4 flex items-center justify-center gap-x-2 max-w-[250px] w-full h-auto bg-primary-blue rounded-full"
            >
              <span className="animate-spin duration-300 inline-block w-5 h-5 border-[3px] border-solid border-white border-y-transparent rounded-full"></span>
              <span className="text-base text-center text-white font-medium">
                Loading...
              </span>
            </button>
          ) : (
            <button
              type="submit"
              className="relative py-3 px-4 flex items-center justify-center max-w-[250px] w-full h-auto bg-primary-blue rounded-full"
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
              <span className="ml-2 text-base text-center text-white font-medium">
                Submit
              </span>
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default VehicleInfoForm;
