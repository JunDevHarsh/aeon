import { Link } from "react-router-dom";
import AEONLogo from "../../assets/images/aeon_insurance_brokers_dark.png";

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
  return (
    <header className="relative w-full bg-white shadow-navbar-header z-[1]">
      <div className="mx-auto py-2 px-4 flex items-center justify-between max-w-7xl w-full h-auto">
        <div className="flex items-center justify-center  w-auto h-full">
          <Link
            to="/"
            aria-label="AEON Insurance Brokers"
            title="AEON Insurance Brokres"
          >
            <img
              src={AEONLogo}
              className="w-auto h-full"
              alt="aeon-insurance-brokers-logo"
            />
          </Link>
        </div>
        <nav className="flex items-center justify-center w-auto">
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
    </header>
  );
};

export default Header;
