type FixedInputTextProps = {
  title: string;
  value: string;
};

const FixedInputText = ({ title, value }: FixedInputTextProps) => {
  return (
    <div className="relative pb-5 flex flex-col items-start gap-y-1 w-full h-auto">
      <span className="text-base text-center text-primary-black font-semibold">
        {title}
      </span>
      <span
        className={`${
          value.trim() === "" ? "py-4" : "py-1.5"
        } px-2 w-full text-sm text-left text-primary-black font-medium bg-[#e9e9e9] cursor-default border border-solid border-[#CFD0D7] rounded`}
      >
        {value}
      </span>
    </div>
  );
};

export default FixedInputText;
