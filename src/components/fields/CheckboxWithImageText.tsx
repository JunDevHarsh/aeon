import { useEffect, useRef, useState } from "react";

type OptionList = {
  value: string;
  title: string;
  imgName: string;
};

type CheckboxWithImageTextProps = {
  name: string;
  selectedValue: string;
  updateValue: (val: string) => void;
  optionList: OptionList[];
};

function CheckboxWithImageText({
  name,
  selectedValue,
  updateValue,
  optionList,
}: CheckboxWithImageTextProps) {
  return (
    <div className="block my-4 w-full">
      <div className="flex flex-col md:flex-row items-center justify-center w-full">
        {optionList.map(({ value, title, imgName }: OptionList) => (
          <SingleCheckboxField
            key={`checkBoxWithImageTextValueOf${value}`}
            {...{
              name,
              value,
              title,
              imgName,
              selectedValue,
              updateValue,
            }}
          />
        ))}
      </div>
    </div>
  );
}

type SingleCheckboxFieldProps = {
  name: string;
  value: string;
  title: string;
  imgName: string;
  selectedValue: string;
  updateValue: (val: string) => void;
};

function SingleCheckboxField({
  name,
  title,
  value,
  imgName,
  updateValue,
  selectedValue,
}: SingleCheckboxFieldProps) {
  const [pathLoaded, setPathLoaded] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imgRef = useRef<string>("");

  useEffect(() => {
    async function importImageDynamically() {
      const importedImage = await import(`../../assets/images/${imgName}.png`);
      imgRef.current = importedImage.default;
      setPathLoaded(true);
    }
    importImageDynamically();
  }, []);

  return (
    <div
      className={`${
        !isLoaded ? "animate-pulse min-w-[250px] h-[53px]" : ""
      } relative even:mt-4 md:even:mt-0 even:ml-0 md:even:ml-4 w-auto rounded`}
      key={`checkBoxWithImageTextValueOf${value}`}
    >
      {!isLoaded && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-300 z-10 rounded" />
      )}
      <input
        type="radio"
        name={name}
        id={name + value}
        value={value}
        onChange={() => updateValue(value)}
        className="peer absolute top-0 left-0 -z-10 opacity-0"
      />
      <label
        htmlFor={name + value}
        className={`relative px-2.5 flex items-center justify-start w-auto border border-solid rounded cursor-pointer outline-2 outline outline-transparent peer-focus-visible:outline-primary-black ${
          selectedValue === value
            ? "bg-[#F8F9FF] border-[#4B5EAA]"
            : "bg-white border-[#8A8A8A]"
        }`}
      >
        <span
          className={`inline-block w-2 mobile-m:w-3 h-2 mobile-m:h-3 rounded-full ${
            selectedValue === value
              ? "bg-[#4B5EAA] shadow-selected"
              : "bg-white shadow-unselected"
          }`}
        />
        {pathLoaded && (
          <img
            src={imgRef.current}
            alt={`Image of ${title}`}
            onLoad={() => setIsLoaded(true)}
            className={`ml-3 mr-1 w-9 mobile-m:w-auto h-auto`}
          />
        )}
        <span
          className="text-lg mobile-m:text-xl text-center text-primary-black font-bold whitespace-nowrap"
          aria-label={title}
        >
          {title}
        </span>
      </label>
    </div>
  );
}

export default CheckboxWithImageText;
