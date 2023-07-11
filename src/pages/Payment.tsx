import { useEffect, useState } from "react";
import GuyImg from "../assets/images/guy_holding_stick.png";
import PaymentSuccessfulContainer from "../components/container/PaymentSuccess";
import PaymentFailedContainer from "../components/container/PaymentFailed";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { checkSession, getPaymentConfig } from "../services/apiServices";
// import { SHA256 } from "../utils/helpers";

interface PaymentStatusType {
  price: string;
  loading: boolean;
  status: "success" | "failed" | "loading" | "pending";
  transactionId: string;
}

const PaymentPage = () => {
  // const amount = useSelector((state: RootState) => state.insurance.finalPrice);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatusType>({
    price: "",
    loading: false,
    status: "loading",
    transactionId: "",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function updatePaymentStatus(
    amount: string,
    transId: string,
    status: string
  ) {
    try {
      if (status === "1") {
        setPaymentStatus((prev) => ({
          ...prev,
          loading: false,
          price: amount,
          status: "success",
          transactionId: transId,
        }));
        // return;
      } else if (status === "0") {
        setPaymentStatus((prev) => ({
          ...prev,
          status: "failed",
          price: amount,
          transactionId: transId,
        }));
      } else {
        setPaymentStatus((prev) => ({
          ...prev,
          status: "failed",
        }));
      }
      // const credentialResponse: any = await checkSession(null, null);
      // const paymentConfig = await getPaymentConfig(
      // credentialResponse.session.sessionName
      // );
      // const signature = SHA256(
      //   `3jeL1HvYCE${paymentConfig.MerchantCode}${refNo}100MYR`
      // );
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");
    const transId = searchParams.get("trans_id");
    // const hashString = searchParams.get("hashstring");
    // const refNo = searchParams.get("refno");
    if (amount && status && transId) {
      updatePaymentStatus(amount, transId, status);
    } else {
      navigate("/");
    }
  }, []);

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
        <div className="flex flex-col items-center justify-between w-full">
          <img
            src={GuyImg}
            alt="guy-holding-stick-in-his-hand"
            className="mx-auto"
          />
          <p className="text-3xl text-center text-primary-black font-bold">
            Loading
          </p>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
