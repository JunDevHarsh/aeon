import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../navbar/Header";
import Footer from "../navbar/Footer";

const RootLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <Header />
      <main className="relative w-full h-full bg-[#F6F6F6] min-h-[calc(100vh-143px)]">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default RootLayout;
