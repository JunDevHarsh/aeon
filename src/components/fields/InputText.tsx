import {
  FieldError,
  Path,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";

type InputTextFieldProps = {
  label: string;
  name: Path<any>;
  register: UseFormRegister<any>;
  placeholder?: string;
  options?: RegisterOptions<any> | undefined;
  errors?: FieldError;
  rest?: any;
};

const InputTextField = ({
  label,
  name,
  register,
  placeholder = "Placeholder",
  options,
  errors,
  rest,
}: InputTextFieldProps) => {
  return (
    <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
      <label
        htmlFor={name}
        className="text-base text-center text-primary-black font-semibold"
      >
        {label}
        {options?.required && "*"}
      </label>
      <input
        type="text"
        id={name}
        placeholder={placeholder}
        {...register(name, {
          ...options,
        })}
        {...rest}
        className={`py-1.5 px-2 w-full text-sm text-left text-primary-black font-medium border border-solid rounded outline outline-1 outline-transparent focus-visible:outline-primary-pink ${
          errors
            ? "border-red-600 placeholder:text-red-600"
            : "border-[#CFD0D7] focus-visible:border-primary-pink"
        }`}
      />
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

export default InputTextField;
