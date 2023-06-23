import { UseFormRegister } from "react-hook-form";

type OptionList = {
  title: string;
  value: string;
};

type RadioFieldProps = {
  title: string;
  selectedValue: string;
  name: string;
  register: UseFormRegister<any>;
  options: OptionList[];
  isRequired?: boolean;
};

function RadioFieldWithRFH({
  title,
  name,
  selectedValue,
  register,
  options,
  isRequired = true,
}: RadioFieldProps) {
  return (
    <div className="relative pb-3 flex flex-col items-start w-full h-auto">
      <span className="mb-1 text-base text-center text-primary-black font-semibold">
        {title + (isRequired ? "*" : "")}
      </span>
      <div className="flex items-center justify-start w-full">
        {options.map(({ title, value }: OptionList) => (
          <div
            className="mr-2 relative flex items-center justify-center w-auto"
            key={`radioFieldWithValueOf${value}`}
          >
            <input
              type="radio"
              value={value}
              {...register(name)}
              id={`radioFieldIdOf${value}`}
              className="peer absolute opacity-0 -z-10"
              checked={selectedValue === value}
            />
            <label
              htmlFor={`radioFieldIdOf${value}`}
              className="px-1.5 flex items-center border-2 border-solid border-transparent peer-focus-visible:border-primary-black rounded cursor-pointer"
            >
              <span
                className={`mr-2 inline-block w-2.5 h-2.5 rounded-full ${
                  selectedValue === value
                    ? "bg-primary-black shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                    : "bg-white shadow-[0_0_0_2px_#fff,0_0_0_4px_#272727]"
                }`}
              />
              <span className="text-sm text-center text-primary-black font-normal">
                {title}
              </span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadioFieldWithRFH;
