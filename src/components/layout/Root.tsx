import { useEffect } from "react";
import Footer from "../navbar/Footer";
import Header from "../navbar/Header";
import { Outlet, useLocation } from "react-router-dom";

const Root = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

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
