import { updateVehicleState } from "../../store/slices/vehicle";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { RootState } from "../../store/store";
import { useSelector, useDispatch } from "react-redux";
// import InputTextField from "../fields/InputText";
import SelectDropdown from "../fields/SelectDropdown";
// import CheckboxWithTextField from "../fields/CheckboxWithText";
import FixedInputTextField from "../fields/FixedInputText";
import { VehicleStateType } from "../../store/slices/types";
import { useContext, useState } from "react";
import DefaultPopup from "../popup/Default";
import RadioFieldWithRFH from "../rhfFields/RadioField";
import {
  addAcountId,
  addInquiryId,
  addVehicleId,
} from "../../store/slices/credentials";
import { addUserBasicInfo } from "../../store/slices/user";
import { CredentialContext, CredentialTypes } from "../../context/Credential";
import { LoaderActionTypes, LoaderContext } from "../../context/Loader";
import { checkTokenIsExpired, createInquiry } from "../../services/apiServices";

const VehicleInfoForm = ({
  setShowLoading,
}: {
  setShowLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    state: { isLoading },
    dispatch: loaderDispatch,
  } = useContext(LoaderContext);

  const {
    state: { token, session, requestId },
    dispatch: credentialDispatch,
  } = useContext(CredentialContext);

  const { user: userState, vehicle: vehicleState } = useSelector(
    (state: RootState) => state
  );
  // extract variant options from vehicle state and map it to the format required by SelectDropdown component
  const variantOptionList = vehicleState.nvicList.map(({ vehicleVariant }) => ({
    label: vehicleVariant,
    value: vehicleVariant,
  }));
  // state for handling error
  const [error, setError] = useState<{
    isVisible: boolean;
    title: string | null;
    description: string | null;
  }>({
    isVisible: false,
    title: null,
    description: null,
  });
  // react hook form
  const {
    watch,
    register,
    handleSubmit,
    control,
    setValue,
    clearErrors,
    // formState: { errors },
  } = useForm<VehicleStateType>({
    defaultValues: {
      ...vehicleState,
      region:
        vehicleState.region === "" ? "West Malaysia" : vehicleState.region,
    },
  });

  const dispatch = useDispatch();

  const onSubmit: SubmitHandler<VehicleStateType> = async (
    val: VehicleStateType
  ) => {
    // make api call to agiliux backend
    try {
      if (token) {
        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: true,
        });

        const isTokenExpired = checkTokenIsExpired(token);

        if (isTokenExpired) {
          credentialDispatch({
            type: CredentialTypes.ToggleTokenHasExpired,
            payload: true,
          });
          return;
        }

        const createInquiryResponse = await createInquiry(
          session?.sessionName || "",
          vehicleState.contractNumber,
          requestId,
          userState.mobileNumber,
          userState.email,
          userState.id.number,
          userState.dateOfBirth,
          userState.id.type,
          userState.gender,
          userState.maritalStatus,
          userState.postalCode,
          vehicleState.polEffectiveDate,
          vehicleState.polExpiryDate,
          vehicleState.vehicleLicenseId,
          vehicleState.vehicleMake,
          vehicleState.vehicleModel,
          vehicleState.vehicleEngine,
          vehicleState.vehicleEngineCC,
          vehicleState.seatingCapacity,
          vehicleState.ncdPercentage,
          vehicleState.yearOfManufacture,
          vehicleState.vehicleChassis,
          val.region,
          val.variant?.vehicleVariant || "",
          val.variant?.vehicleMarketValue?.toString() || "",
          userState.referralCode
        );

        if (createInquiryResponse.inquiryId === "") {
          setError({
            isVisible: true,
            title: "Error",
            description: "Something went wrong, please try again later",
          });
          loaderDispatch({
            type: LoaderActionTypes.ToggleLoading,
            payload: false,
          });
          return;
        }

        dispatch(updateVehicleState(val));
        dispatch(addInquiryId(createInquiryResponse.inquiryId));
        dispatch(addAcountId(createInquiryResponse.accountid));
        dispatch(addVehicleId(createInquiryResponse.vehicleId));
        dispatch(
          addUserBasicInfo({
            dateOfBirth: createInquiryResponse.dob,
          })
        );

        loaderDispatch({
          type: LoaderActionTypes.ToggleLoading,
          payload: false,
        });

        setShowLoading(true);
      } else {
        setError({
          isVisible: true,
          title: "Error",
          description: "Something went wrong, please try again later",
        });
      }
    } catch (err: any) {
      loaderDispatch({
        type: LoaderActionTypes.ToggleLoading,
        payload: false,
      });

      setError({
        isVisible: true,
        title: "Error",
        description:
          err.message || "Something went wrong, please try again later",
      });

      console.error(err);
    }
  };

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
          <FixedInputTextField
            title="Vehicle Make"
            value={vehicleState.vehicleMake}
          />
          <FixedInputTextField
            title="Vehicle Model"
            value={vehicleState.vehicleModel}
          />
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
          {/* <InputTextField
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
          /> */}
          {/* NCD Field */}
          <FixedInputTextField
            title="NCD"
            value={vehicleState.ncdPercentage.toString()}
          />
          {/* Vehicle Model Field  */}
          {vehicleState.region !== "" ? (
            <FixedInputTextField title="Region" value={vehicleState.region} />
          ) : (
            <div className="relative pb-5 flex flex-col items-start gap-y-1 w-auto h-auto">
              <span className="text-base text-center text-primary-black font-semibold">
                Region*
              </span>
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
          )}
          {/* Period Of Coverage */}
          <FixedInputTextField
            title="Period of Coverage"
            value={vehicleState.periodOfCoverage}
          />
          {/* Recond Indicator */}
          <div className="relative w-full">
            <div className="group/info absolute top-[3px] left-[120px] h-4 w-4 cursor-pointer z-10">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.43734 13.1667H9.68734V8.16669H8.43734V13.1667ZM8.99984 6.62502C9.19428 6.62502 9.35748 6.56252 9.48942 6.43752C9.62136 6.31252 9.68734 6.1528 9.68734 5.95835C9.68734 5.76391 9.62136 5.59724 9.48942 5.45835C9.35748 5.31946 9.19428 5.25002 8.99984 5.25002C8.80539 5.25002 8.6422 5.31946 8.51025 5.45835C8.37831 5.59724 8.31234 5.76391 8.31234 5.95835C8.31234 6.1528 8.37831 6.31252 8.51025 6.43752C8.6422 6.56252 8.80539 6.62502 8.99984 6.62502ZM8.99984 17.3334C7.86095 17.3334 6.78456 17.1146 5.77067 16.6771C4.75678 16.2396 3.87137 15.6424 3.11442 14.8854C2.35748 14.1285 1.76025 13.2431 1.32275 12.2292C0.885254 11.2153 0.666504 10.132 0.666504 8.97919C0.666504 7.8403 0.885254 6.76391 1.32275 5.75002C1.76025 4.73613 2.35748 3.85419 3.11442 3.10419C3.87137 2.35419 4.75678 1.76044 5.77067 1.32294C6.78456 0.885437 7.86789 0.666687 9.02067 0.666687C10.1596 0.666687 11.2359 0.885437 12.2498 1.32294C13.2637 1.76044 14.1457 2.35419 14.8957 3.10419C15.6457 3.85419 16.2394 4.73613 16.6769 5.75002C17.1144 6.76391 17.3332 7.84724 17.3332 9.00002C17.3332 10.1389 17.1144 11.2153 16.6769 12.2292C16.2394 13.2431 15.6457 14.1285 14.8957 14.8854C14.1457 15.6424 13.2637 16.2396 12.2498 16.6771C11.2359 17.1146 10.1526 17.3334 8.99984 17.3334Z"
                  fill="#959698"
                />
              </svg>
              <div className="group-hover/info:inline-block hidden absolute top-[calc(100%+14px)] left-2 -translate-x-1/2 py-2 px-3 min-w-[250px] max-w-[250px] w-auto bg-[#959698] rounded-xl z-[2]">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 inline-block w-4 h-4 bg-[#959698] rotate-45" />
                <p className="text-xs text-center text-white font-normal">
                  A recond or recon car is a used car imported from another
                  countries and sold by recon or used car dealers in Malaysia.
                </p>
              </div>
            </div>
            <RadioFieldWithRFH
              name="reconIndicator"
              register={register}
              selectedValue={watch("reconIndicator")}
              title="Reconditon Car?"
              isRequired={false}
              options={[
                {
                  value: "yes",
                  title: "Yes",
                },
                {
                  value: "no",
                  title: "No",
                },
              ]}
            />
          </div>
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
          {isLoading ? (
            <div className="relative py-3 px-4 flex items-center justify-center gap-x-2 max-w-[250px] w-full h-auto bg-primary-blue rounded-full">
              <span className="text-base text-center text-white font-medium">
                Loading...
              </span>
            </div>
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
