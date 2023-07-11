import { Link } from "react-router-dom";
import AEONLogo from "../assets/images/AEON_LOGO.png";

const NotFoundPage = () => {
  return (
    <div className="relative py-16 px-2 w-full h-auto">
      <div className="mx-auto flex flex-col items-center justify-center gap-y-4 max-w-lg w-full">
        <img
          src={AEONLogo}
          alt="aeon-insurance-brokers-img"
          className="max-w-xs w-full h-auto"
        />
        <h2 className="text-4xl text-center text-primary-black font-bold">
          404 - Page Not Found
        </h2>
        <p className="text-base text-center text-primary-black font-medium">
          We are sorry, the page you requested could no be found. Please go back
          to the homepage or contact us at aeon@support.com
        </p>
        <Link
          to="/"
          className="px-6 py-2 text-base text-center text-white bg-[#2336B7] font-medium rounded"
          title="Homepage"
          aria-label="Go to Home page"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
