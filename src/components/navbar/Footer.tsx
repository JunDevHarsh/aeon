import { Link } from "react-router-dom";

interface MenuListType {
  name: string;
  path: string;
}

const menuList: Array<MenuListType> = [
  {
    name: "Terms & Conditions",
    path: "https://aeoninsurance.com.my/terms-and-conditions/",
  },
  {
    name: "Privacy Policy",
    path: "https://aeoninsurance.com.my/privacy-policy",
  },
];

const Footer = () => {
  return (
    <footer className="relative w-full h-auto bg-primary-pink">
      <div className="py-4 px-2 mx-auto flex flex-col sm:flex-row items-center justify-between max-w-7xl w-full">
        <ul className="mb-3 sm:mb-0 flex items-center w-auto">
          {/* Facebook Icon */}
          <li className="w-auto">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="relative flex items-center justify-center w-auto"
              title="Facebook"
              aria-label="Link: Facebook"
            >
              <svg
                width="11"
                height="21"
                viewBox="0 0 11 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M0.771128 11.152H2.96345V20.1774C2.96345 20.3556 3.10784 20.5 3.28603 20.5H7.00319C7.18139 20.5 7.32577 20.3556 7.32577 20.1774V11.1945H9.84603C10.0099 11.1945 10.1478 11.0715 10.1665 10.9088L10.5493 7.58606C10.5598 7.49465 10.5308 7.4031 10.4696 7.33452C10.4084 7.26587 10.3208 7.22658 10.2289 7.22658H7.3259V5.14374C7.3259 4.51587 7.66397 4.19748 8.3308 4.19748C8.42584 4.19748 10.2289 4.19748 10.2289 4.19748C10.4071 4.19748 10.5514 4.05303 10.5514 3.8749V0.824968C10.5514 0.646774 10.4071 0.502387 10.2289 0.502387H7.61306C7.59461 0.501484 7.55364 0.5 7.49326 0.5C7.03938 0.5 5.46177 0.589097 4.21558 1.73555C2.8348 3.006 3.02674 4.52716 3.07261 4.7909V7.22652H0.771128C0.592934 7.22652 0.448547 7.3709 0.448547 7.5491V10.8294C0.448547 11.0075 0.592934 11.152 0.771128 11.152Z"
                  fill="#f0f0f0"
                />
              </svg>
            </a>
          </li>
          {/* Instagram Icon */}
          <li className="ml-4 w-auto">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="relative flex items-center justify-center w-auto"
              title="Instagram"
              aria-label="Link: Instagram"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.032 0.5H6.07058C3.02733 0.5 0.551453 2.976 0.551453 6.01924V14.9806C0.551453 18.024 3.02733 20.4999 6.07058 20.4999H15.032C18.0755 20.4999 20.5513 18.0239 20.5513 14.9806V6.01924C20.5515 2.976 18.0755 0.5 15.032 0.5ZM18.777 14.9806C18.777 17.0455 17.097 18.7254 15.0321 18.7254H6.07058C4.00579 18.7255 2.32594 17.0455 2.32594 14.9806V6.01924C2.32594 3.95445 4.00579 2.27449 6.07058 2.27449H15.032C17.0969 2.27449 18.7768 3.95445 18.7768 6.01924V14.9806H18.777Z"
                  fill="#f0f0f0"
                />
                <path
                  d="M10.5515 5.34668C7.70984 5.34668 5.39804 7.65848 5.39804 10.5001C5.39804 13.3417 7.70984 15.6534 10.5515 15.6534C13.3932 15.6534 15.705 13.3417 15.705 10.5001C15.705 7.65848 13.3932 5.34668 10.5515 5.34668ZM10.5515 13.8788C8.68841 13.8788 7.17253 12.3631 7.17253 10.5C7.17253 8.63681 8.68829 7.12105 10.5515 7.12105C12.4147 7.12105 13.9305 8.63681 13.9305 10.5C13.9305 12.3631 12.4146 13.8788 10.5515 13.8788Z"
                  fill="#f0f0f0"
                />
                <path
                  d="M15.921 3.84204C15.5791 3.84204 15.2432 3.98045 15.0018 4.22296C14.7591 4.46429 14.6197 4.80026 14.6197 5.14333C14.6197 5.48533 14.7593 5.82118 15.0018 6.0637C15.2431 6.30503 15.5791 6.44462 15.921 6.44462C16.264 6.44462 16.5988 6.30503 16.8413 6.0637C17.0838 5.82118 17.2222 5.48522 17.2222 5.14333C17.2222 4.80026 17.0838 4.46429 16.8413 4.22296C16.6 3.98045 16.264 3.84204 15.921 3.84204Z"
                  fill="#f0f0f0"
                />
              </svg>
            </a>
          </li>
          {/* LinkedIn Icon  */}
          <li className="ml-4 w-auto">
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer noopener"
              className="relative flex items-center justify-center w-auto"
              title="LinkedIn"
              aria-label="Link: LinkedIn"
            >
              <svg
                width="21"
                height="21"
                viewBox="0 0 21 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.951 0.501794H2.26391C2.04883 0.49172 1.83386 0.524154 1.63133 0.59726C1.4288 0.670366 1.24267 0.782693 1.0836 0.927804C0.924544 1.07293 0.79566 1.248 0.704349 1.44298C0.613039 1.63798 0.561077 1.84906 0.551453 2.06415V18.7877C0.564052 19.2377 0.748523 19.6661 1.06698 19.9844C1.38543 20.3029 1.81372 20.4874 2.26391 20.5H18.951C19.3886 20.4805 19.8013 20.2903 20.1004 19.9702C20.3995 19.6501 20.5612 19.2256 20.551 18.7877V2.06415C20.5546 1.85479 20.5154 1.64693 20.4357 1.45327C20.3561 1.25962 20.2377 1.08428 20.0879 0.937979C19.9381 0.791692 19.76 0.677553 19.5645 0.602547C19.369 0.527542 19.1603 0.493257 18.951 0.501794ZM6.80131 17.1753H3.88888V8.26362H6.80131V17.1753ZM5.41384 6.91371C5.21061 6.92079 5.0081 6.88577 4.81905 6.81085C4.63 6.73594 4.45848 6.62273 4.31528 6.47836C4.17207 6.33398 4.06026 6.16156 3.98689 5.97192C3.9135 5.78227 3.88014 5.5795 3.88888 5.37635C3.87989 5.17099 3.91393 4.96603 3.98881 4.77461C4.0637 4.58318 4.17777 4.40952 4.3237 4.26477C4.46965 4.12001 4.64423 4.00736 4.83627 3.93404C5.02831 3.86071 5.23356 3.82834 5.43884 3.83899C5.64207 3.83191 5.84458 3.86692 6.03363 3.94184C6.22269 4.01676 6.39421 4.12996 6.5374 4.27434C6.68061 4.41871 6.79242 4.59113 6.8658 4.78078C6.93918 4.97042 6.97254 5.17319 6.96381 5.37635C6.97279 5.5817 6.93876 5.78666 6.86387 5.97808C6.78898 6.16951 6.67491 6.34317 6.52898 6.48792C6.38303 6.63268 6.20845 6.74533 6.01642 6.81865C5.82437 6.89198 5.61912 6.92436 5.41384 6.91371ZM17.2261 17.1753H14.3011V12.3007C14.3011 11.1384 13.8886 10.3384 12.8512 10.3384C12.5289 10.3412 12.2153 10.4435 11.9536 10.6315C11.6917 10.8195 11.4945 11.0839 11.3887 11.3883C11.3075 11.6166 11.2735 11.8589 11.2887 12.1008V17.1753H8.41377V8.26362H11.2887V9.51351C11.5443 9.04392 11.9247 8.65421 12.3879 8.38723C12.8512 8.12038 13.3792 7.98675 13.9136 8.00111C15.8011 8.00111 17.2261 9.25103 17.2261 11.9133V17.1753Z"
                  fill="#f0f0f0"
                />
              </svg>
            </a>
          </li>
        </ul>
        <ul className="flex items-center justify-center w-auto">
          {menuList.map((item, index) => (
            <li className="w-auto last:ml-8" key={`footer-item-${index + 1}`}>
              <Link
                to={item.path}
                className="text-base text-center text-white font-medium"
                title={item.name}
                aria-label={`GoTo: ${item.name}`}
                target={
                  item.path.includes("https") ? "_blank" : "_self"
                }
                rel="noreferrer noopener"
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="block py-1 px-2 w-full bg-secondary-pink">
        <div className="mx-auto flex items-center justify-center max-w-7xl w-full">
          <p className="text-sm text-center text-white font-normal tracking-wide">
            Copyright &#169; 2023 ÆON INSURANCE BROKERS &#x2768;M&#x2769; SDN. BHD. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
