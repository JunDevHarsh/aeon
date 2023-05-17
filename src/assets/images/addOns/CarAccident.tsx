import React from "react";
import { IconProps } from "./types";

const CarAccidentIcon: React.FC<Partial<IconProps>> = ({
  svgColor = "none",
  pathColor = "#9C9C9C",
}) => {
  return (
    <svg
      width="93"
      height="92"
      viewBox="0 0 93 92"
      fill={svgColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M57.9669 38.2067L44.3979 43.6338L46.5359 32.9369L42.8587 35.6978L35.5907 28.4289L37.45 36.8H31.1664L25.0337 9.20001L43.4337 27.6L55.7001 18.4L52.6337 33.7327L67.9664 27.6L61.8337 46H55.3679L57.9669 38.2067Z"
        fill={pathColor}
      />
      <path
        d="M83.2999 52.1327H72.27L80.4497 39.8664H83.2999V33.7327H77.1663L64.8999 52.1327L46.2506 60.1238C44.7022 60.789 43.4326 62.7136 43.4326 64.4V76.6664H53.1947C54.4625 80.2332 57.8315 82.8 61.8335 82.8C65.8346 82.8 69.2037 80.2332 70.4705 76.6664H83.2999V52.1327ZM61.8335 76.6664C60.138 76.6664 58.7663 75.2946 58.7663 73.6C58.7663 71.9044 60.138 70.5327 61.8335 70.5327C63.5282 70.5327 64.8999 71.9044 64.8999 73.6C64.8999 75.2946 63.5282 76.6664 61.8335 76.6664Z"
        fill={pathColor}
      />
      <path
        d="M31.1666 52.1327L26.0044 36.6436C25.4708 35.0419 23.6529 33.7327 21.9666 33.7327H9.7002V39.8664H20.6132L24.7036 52.1327H9.7002V76.6664H13.3296C14.5964 80.2332 17.9682 82.8 21.9666 82.8C25.9686 82.8 29.3404 80.2332 30.6044 76.6664H37.3002V58.2664C37.3002 54.8762 34.5577 52.1327 31.1666 52.1327ZM21.9666 76.6664C20.2719 76.6664 18.9002 75.2946 18.9002 73.6C18.9002 71.9044 20.2719 70.5327 21.9666 70.5327C23.6621 70.5327 25.0338 71.9044 25.0338 73.6C25.0338 75.2946 23.6621 76.6664 21.9666 76.6664Z"
        fill={pathColor}
      />
    </svg>
  );
};

export default CarAccidentIcon;
