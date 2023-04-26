import LoadingGif from "../assets/insurance_tick.gif";

const LoadingAnimation = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-auto">
      <img src={LoadingGif} alt="loading-gif" />
    </div>
  );
};

export default LoadingAnimation;
