import {
  FieldError,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type MobileNumberFieldProps = {
  id: string;
  label: string;
  fixedValue: string;
  name: Path<any>;
  placeholder?: string;
  register: UseFormRegister<any>;
  options?: RegisterOptions<any> | undefined;
  errors?: FieldError;
};

const MobileNumberField = ({
  id,
  name,
  label,
  fixedValue,
  placeholder,
  register,
  errors,
  options,
}: MobileNumberFieldProps) => {
  return (
    <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
      <label
        htmlFor={id}
        className="text-base text-center text-primary-black font-semibold"
      >
        {`${label}${options?.required && "*"}`}
      </label>
      <div className="relative w-full">
        <span className="absolute top-[1px] left-[1px] px-2 h-[calc(100%-2px)] flex items-center justify-center w-auto bg-[#f6f6f6] rounded-tl-[3px] rounded-bl-[3px]">
          <span className="text-sm text-center text-primary-black font-medium">
            {fixedValue}
          </span>
        </span>
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          {...register(name, {
            ...options,
          })}
          className={`py-1.5 pl-12 pr-2 w-full text-sm text-left text-primary-black border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink ${
            errors
              ? "border-red-600 placeholder:text-red-600"
              : "border-[#CFD0D7] focus-visible:border-primary-pink"
          }`}
        />
      </div>
      {errors && (
        <span
          role="alert"
          className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
        >
          {errors.message}
        </span>
      )}
    </div>
  );
};

export default MobileNumberField;
