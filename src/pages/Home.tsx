import ManAndWomanImg from "../assets/images/man_woman_handshaking.png";
import UserRegistrationForm from "../components/form/UserRegistration";

const HomePage = () => {
  return (
    <div className="relative mx-auto max-w-7xl w-full">
      <div className="block py-6 px-4 lg:pl-8 pr-4 w-full">
        <div className="flex items-center justify-center xl:justify-between w-full">
          <div className="block px-4 md:px-8 py-10 max-w-4xl w-full h-auto bg-white rounded-[20px] shadow-container">
            <div className="block w-full">
              <h2 className="text-xl mobile-m:text-2xl sm:text-3xl text-center text-primary-black font-bold">
                <span className="text-primary-pink">Compare &#38; Buy</span> the
                best Insurance Online
              </h2>
            </div>
            <UserRegistrationForm />
          </div>
          <div className="ml-0 xl:ml-2 hidden xl:flex items-center justify-center w-auto h-full">
            <img
              src={ManAndWomanImg}
              alt="man-and-woman-handshaking-img"
              className="w-auto h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
