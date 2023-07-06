import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FieldError } from "react-hook-form";

const maxAge = 80;

function DateOfBirthField({
  selected,
  onChange,
  disabled,
  error,
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  error?: FieldError;
}) {
  function handleDateChange(dateObj: Date | null) {
    onChange(dateObj);
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - maxAge);

  return (
    <div className="relative pb-1 w-full">
      <div className="relative pb-5">
        <label
          htmlFor="dateOfBirth"
          className="inline-block mb-1 text-base text-left text-primary-black font-semibold"
        >
          DOB
        </label>
        <DatePicker
          selected={selected}
          onChange={handleDateChange}
          name="dob"
          id="dateOfBirth"
          disabled={disabled}
          placeholderText={new Date().toISOString().substring(0, 10)}
          dateFormat="yyyy-MM-dd"
          maxDate={new Date()}
          minDate={maxDate}
          className={`py-1.5 px-2 w-full text-sm text-left text-primary-black border border-solid rounded outline outline-2 outline-transparent focus-visible:outline-primary-pink ${
            error
              ? "border-red-600 placeholder:text-red-600"
              : "border-[#CFD0D7] focus-visible:border-primary-pink"
          }`}
        />
        {error && (
          <span
            role="alert"
            className="absolute bottom-0 left-0 text-sm text-left font-medium text-red-600"
          >
            {error?.message}
          </span>
        )}
      </div>
    </div>
  );
}

export default DateOfBirthField;
