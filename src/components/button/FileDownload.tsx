interface FileDownloadButtonProps {
  text: string;
  href: string;
}

const FileDownloadButton = ({ text, href }: FileDownloadButtonProps) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.download = "download.pdf";
    link.click();
  };

  return (
    <button
      className="relative py-2 px-4 flex items-center justify-center w-auto bg-primary-blue rounded-full shadow-[0_1px_2px_0_#C6E4F60D]"
      onClick={handleDownload}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="white"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>

      <span className="ml-1 text-sm text-center font-medium text-white">
        {text}
      </span>
    </button>
  );
};

export default FileDownloadButton;
