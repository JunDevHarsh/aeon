import { useState } from "react";
import PaymentProvidersImg from "../assets/images/payment_providers.png";
import GuyImg from "../assets/images/guy_holding_stick.png";
import PaymentSuccessfulContainer from "../components/container/PaymentSuccess";
import PaymentFailedContainer from "../components/container/PaymentFailed";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

interface PaymentStatusType {
  price: string;
  loading: boolean;
  status: "success" | "failed" | null;
  transactionId: string;
}

const PaymentPage = () => {
  const amount = useSelector((state: RootState) => state.insurance.finalPrice);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>({
    price: "",
    loading: false,
    status: null,
    transactionId: "",
  });

  async function handleOnClick() {
    setPaymentStatus((prev) => ({ ...prev, loading: true }));
    try {
      const res: any = await makePayment(amount || "400");
      const transId = res.transactionId;
      setPaymentStatus((_) => ({
        price: res.amount,
        loading: false,
        status: "success",
        transactionId: transId,
      }));
    } catch (err) {
      console.log(err);
      setPaymentStatus((prev) => ({
        ...prev,
        loading: false,
        status: "failed",
      }));
    }
  }

  function makePayment(amount: string) {
    return new Promise((res, _) => {
      setTimeout(() => {
        res({ transactionId: "KJHKH432", amount: amount });
      }, 2000);
    });
  }

  if (paymentStatus.loading) {
    return (
      <div className="mx-auto py-auto py-10 flex flex-col items-center justify-between max-w-3xl w-full">
        <img
          src={GuyImg}
          alt="guy-holding-stick-in-his-hand"
          className="mx-auto"
        />
        <p className="text-3xl text-center text-primary-black font-bold">
          Loading
        </p>
      </div>
    );
  }

  if (paymentStatus.status === "success") {
    return (
      <PaymentSuccessfulContainer
        amountPaid={paymentStatus.price}
        transactionId={paymentStatus.transactionId}
      />
    );
  } else if (paymentStatus.status === "failed") {
    return <PaymentFailedContainer />;
  }

  return (
    <>
      <div className="relative py-10 flex items-center justify-center mx-auto max-w-5xl w-full">
        <div
          className="flex items-center justify-center max-w-3xl w-full"
          onClick={handleOnClick}
        >
          <img
            src={PaymentProvidersImg}
            alt="payment-provider-images"
            className="w-full min-h-[calc(100vh-224px)] h-auto"
          />
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
