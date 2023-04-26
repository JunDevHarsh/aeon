import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const minAge = 16;
const maxAge = 80;

function DateOfBirthField({
  selected,
  onChange,
}: {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}) {
  function handleDateChange(dateObj: Date | null) {
    // if (dateObj) {
    //   const year = dateObj.getFullYear().toString().substring(2);
    //   const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    //   const day = dateObj.getDate().toString().padStart(2, "0");
    //   const result = year + month + day;
    //   console.log(result);
    // }
    onChange(dateObj);
  }

  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - maxAge);

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - minAge);

  return (
    <div className="relative pb-5 w-full">
      <div className="relative">
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
          placeholderText={new Date().toISOString().substring(0, 10)}
          dateFormat="yyyy-MM-dd"
          maxDate={minDate}
          minDate={maxDate}
          className="py-1.5 px-2 w-full text-sm text-left text-primary-black border border-solid border-[#CFD0D7] rounded outline outline-2 outline-transparent focus-visible:outline-primary-pink"
        />
      </div>
    </div>
  );
}

export default DateOfBirthField;
