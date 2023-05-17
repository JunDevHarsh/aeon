import React from "react";
import { IconProps } from "../../icons/types";

const WindScreenIcon: React.FC<Partial<IconProps>> = ({
  svgColor = "none",
  pathColor = "#9C9C9C",
}) => {
  return (
    <svg
      width="92"
      height="92"
      viewBox="0 0 92 92"
      fill={svgColor}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M82.8002 33.7337V27.6001H61.3338L42.9338 46.0001L9.2002 55.2001L12.2666 73.6001H21.4666V72.0665C21.4666 63.6126 28.3454 56.7337 36.8002 56.7337C45.255 56.7337 52.1338 63.6126 52.1338 72.0665V73.6001H82.8002V46.0001H51.6067L63.873 33.7337H82.8002Z"
        fill={pathColor}
      />
      <path
        d="M36.8 61.3337C30.8752 61.3337 26.0664 66.1371 26.0664 72.0665C26.0664 77.9959 30.8752 82.8001 36.8 82.8001C42.7239 82.8001 47.5337 77.9959 47.5337 72.0665C47.5337 66.1371 42.7239 61.3337 36.8 61.3337ZM36.8 76.6665C34.2608 76.6665 32.2 74.6093 32.2 72.0665C32.2 69.5236 34.2608 67.4665 36.8 67.4665C39.3392 67.4665 41.4 69.5236 41.4 72.0665C41.4 74.6093 39.3392 76.6665 36.8 76.6665Z"
        fill={pathColor}
      />
      <path
        d="M48.7582 14.4349L42.6521 20.5446C41.4543 21.7424 39.5122 21.7424 38.3144 20.5446C37.1183 19.3468 37.1183 17.4065 38.3144 16.2086L44.4222 10.0989C41.0035 8.47604 36.8046 9.0446 33.9775 11.8718C31.1503 14.6989 30.5827 18.8978 32.2074 22.3147L16.2316 38.2914C15.0319 39.4892 15.0337 41.4304 16.2316 42.6274C17.4294 43.8252 19.3706 43.8252 20.5685 42.6274L36.5443 26.6506C39.9611 28.2735 44.1619 27.7077 46.989 24.8806C49.8153 22.0534 50.3848 17.8554 48.7582 14.4349Z"
        fill={pathColor}
      />
    </svg>
  );
};

export default WindScreenIcon;
