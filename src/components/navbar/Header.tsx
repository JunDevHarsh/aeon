import { Link } from "react-router-dom";
import AEONLogo from "../../assets/images/AEON_LOGO.png";
import { useState } from "react";

interface MenuListType {
  name: string;
  path: string;
}

const menuList: Array<MenuListType> = [
  {
    name: "Home",
    path: "/",
  },
  {
    name: "Products",
    path: "/products",
  },
];

const Header = () => {
  const [showMobileMenu, setShowMobileMenu] = useState<boolean>(false);

  function handleToggleMobileMenu() {
    setShowMobileMenu((prev) => !prev);
  }

  return (
    <header className="relative w-full h-[60px] bg-white z-[1]">
      <div className="fixed top-0 left-0 right-0 w-full h-auto bg-white shadow-navbar-header">
        <div className="mx-auto py-2 px-4 flex items-center justify-between max-w-7xl w-full h-auto">
          <div className="flex items-center justify-center  w-auto h-full">
            <Link
              to="/"
              aria-label="AEON Insurance Brokers"
              title="AEON Insurance Brokres"
              onClick={() => setShowMobileMenu(false)}
            >
              <img
                src={AEONLogo}
                className="max-w-[220px] mobile-s:max-w-[250px] mobile-l:max-w-[265px] w-auto h-auto"
                alt="aeon-insurance-brokers-logo"
              />
            </Link>
          </div>
          <button
            className="inline-block sm:hidden text-primary-pink"
            type="button"
            onClick={handleToggleMobileMenu}
          >
            <span className="sr-only">
              {showMobileMenu ? "Open Navigation" : "Close Navigation"}
            </span>
            {showMobileMenu ? (
              <svg viewBox="0 0 10 10" className="w-6 h-3 overflow-visible">
                <path
                  d="M0 0L10 10M10 0L0 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
              </svg>
            ) : (
              <svg width="24" height="24">
                <path
                  d="M5 6h14M5 12h14M5 18h14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
              </svg>
            )}
          </button>
          {showMobileMenu && (
            <div
              className="block sm:hidden fixed left-0 right-0 z-50 top-[55px] inset-0 overflow-y-auto lg:hidden"
              role="dialog"
              aria-modal="true"
            >
              <div className="block sm:hidden fixed left-0 right-0 top-[55px] inset-0 bg-black/20 backdrop-blur-sm dark:bg-slate-900/80" />
              <div className="block sm:hidden relative bg-white w-full p-6">
                <nav className="block sm:hidden relative w-full">
                  <ul className="flex sm:hidden flex-col items-center justify-center w-auto h-full">
                    {menuList.map((item, index) => (
                      <li
                        className="relative mb-3 last:mb-0 w-full text-center"
                        key={`header-mobile-item-${index + 1}`}
                      >
                        <Link
                          to={item.path}
                          className="inline-block w-full text-xl text-center text-black font-bold"
                          title={item.name}
                          aria-label={`GoTo: ${item.name}`}
                          onClick={handleToggleMobileMenu}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            </div>
          )}

          <nav className="hidden sm:flex items-center justify-center w-auto">
            <ul className="flex items-center justify-center w-auto gap-x-8 h-full">
              {menuList.map((item, index) => (
                <li className="w-auto" key={`header-item-${index + 1}`}>
                  <Link
                    to={item.path}
                    className="text-base text-center text-black font-bold"
                    title={item.name}
                    aria-label={`GoTo: ${item.name}`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
