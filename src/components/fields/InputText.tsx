import {
  FieldError,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { Inputs } from "../form/UserRegistration";

type InputTextFieldProps = {
  label: string;
  name: Path<Inputs>;
  register: UseFormRegister<Inputs>;
  options?: RegisterOptions<Inputs> | undefined;
  errors?: FieldError;
  rest?: any;
};

const InputTextField = ({
  label,
  name,
  register,
  options,
  errors,
  rest,
}: InputTextFieldProps) => {
  return (
    <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
      <label
        htmlFor="vehicleRegNo"
        className="text-base text-center text-primary-black font-semibold"
      >
        {`${label}${options?.required && "*"}`}
      </label>
      <input
        type="text"
        id="vehicleRegNo"
        placeholder="Reg No."
        {...register(name, {
          ...options,
        })}
        {...rest}
        className={`py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink ${
          errors
            ? "border-[#e57398] placeholder:text-[#e57398]"
            : "border-[#CFD0D7] focus-visible:border-primary-pink"
        }`}
      />
      {errors && (
        <span
          role="alert"
          className="absolute bottom-0 left-0 text-sm text-left font-medium text-[#e57398]"
        >
          {errors.message}
        </span>
      )}
    </div>
  );
};

export default InputTextField;
