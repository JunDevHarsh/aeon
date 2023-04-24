import Footer from "../navbar/Footer";
import Header from "../navbar/Header";
import { Outlet } from "react-router-dom";

const Root = () => {
  return (
    <>
      <Header />
      <main className="relative w-full h-full bg-[#F6F6F6] min-h-[calc(100vh-159px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Root;
