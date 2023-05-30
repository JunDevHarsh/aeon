import OnlinePaymentReceivedImg from "../../assets/images/online_payment_received.png";
import { Link } from "react-router-dom";

interface PaymentSuccessfulContainerProps {
  amountPaid: string;
  transactionId: string;
}

const PaymentSuccessfulContainer = ({
  amountPaid,
  transactionId,
}: PaymentSuccessfulContainerProps) => {
  return (
    <div className="relative p-8 flex items-center justify-center w-full h-auto">
      <div className="inline-block px-8 py-10 max-w-3xl w-full h-auto rounded-lg bg-white shadow-container">
        <div className="flex flex-col items-center justify-start w-full h-auto">
          <div className="inline-block max-w-xs w-full">
            <img
              src={OnlinePaymentReceivedImg}
              alt="online-payment-received-img"
              className="w-full h-auto"
            />
          </div>
          <h2 className="text-2xl mobile-xl:text-4xl text-center text-primary-black font-bold">
            Transaction Successful
          </h2>
          <p className="mt-2 text-base text-center text-primary-black font-medium">
            Thank you for your payment. Your policy will be sent shortly via
            email
          </p>
          <div className="relative my-8 px-0 py-4 mobile-xl:px-4 flex flex-col items-start max-w-sm bg-[#fcf6ff] w-full rounded">
            <div className="flex flex-col mobile-xl:flex-row items-center justify-center w-full">
              <span className="text-lg text-center text-primary-black font-bold">
                Amount Paid:
              </span>
              <span className="ml-0 mobile-xl:ml-2 text-lg text-center text-primary-black font-medium">
                RM {amountPaid}
              </span>
            </div>
            <div className="mt-2 flex flex-col mobile-xl:flex-row items-center justify-center w-full">
              <span className="text-lg text-center text-primary-black font-bold">
                Transaction Number:
              </span>
              <span className="ml-0 mobile-xl:ml-2 text-lg text-center text-primary-black font-medium">
                {transactionId}
              </span>
            </div>
          </div>
          <p className="text-base text-center text-primary-black font-medium">
            Your account is created on our customer portal which is a simple and
            easy to use interface for you to manage your policies. Track claims
            send us enquiries whenever required
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-center w-full">
            <Link
              to="/portal-login"
              title="Goto Portal Login"
              aria-label="Go to Portal Login"
              className="relative py-4 px-6 flex items-center justify-center w-auto h-auto bg-primary-blue rounded-full"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                  fill="white"
                />
              </svg>
              <span className="ml-2 text-base text-center text-white font-medium">
                Customer Portal Login
              </span>
            </Link>
            <Link
              to="/"
              title="Goto Homepage"
              aria-label="Go to Home"
              className="relative mt-4 sm:mt-0 ml-0 sm:ml-4 py-4 px-6 flex items-center justify-center w-auto h-auto bg-primary-blue rounded-full"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.525 14.55L15.6 7.475L14.45 6.35L8.525 12.275L5.525 9.275L4.4 10.4L8.525 14.55ZM10 20C8.63333 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3667 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.02917 3.825 2.9375 2.925C3.84583 2.025 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.63333 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3667 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.975 16.1542 17.075 17.0625C16.175 17.9708 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20Z"
                  fill="white"
                />
              </svg>
              <span className="ml-2 text-base text-center text-white font-medium">
                Back to Homepage
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessfulContainer;
