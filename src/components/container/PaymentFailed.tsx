import OnlinePaymentFailedImg from "../../assets/images/online_payment_failed.png";
import { Link } from "react-router-dom";

const PaymentFailedContainer = () => {
  return (
    <div className="relative p-8 flex items-center justify-center w-full h-auto">
      <div className="inline-block px-8 py-10 max-w-3xl w-full h-auto rounded-lg bg-white shadow-container">
        <div className="flex flex-col items-center justify-start w-full h-auto">
          <div className="inline-block max-w-xs w-full h-auto">
            <img
              src={OnlinePaymentFailedImg}
              alt="online-payment-failed-img"
              className="w-auto h-auto"
            />
          </div>
          <h2 className="mt-2 text-4xl text-center text-primary-black font-bold">
            Transaction Failed
          </h2>
          <p className="mt-2 text-base text-center text-primary-black font-medium">
            Sorry, We couldn't process your payment. Please try again
          </p>
          <Link
            to="/payment"
            title="Goto Payment"
            aria-label="Go to Payment page"
            className="relative mt-4 py-4 px-6 flex items-center justify-center w-auto h-auto bg-primary-blue rounded-full"
          >
            <span className="text-base text-center text-white font-medium">
              Retry Payment
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedContainer;
