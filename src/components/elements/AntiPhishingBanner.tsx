import { memo, useCallback, useEffect, useState } from "react";

const APP_HOST = process.env.NEXT_PUBLIC_RPSLS_APP_HOST;

const AntiPhishingBanner = memo(() => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showBanner =
      sessionStorage.getItem("showAntiPhishingBanner") !== "false";
    setIsVisible(showBanner);
  }, []);

  const closeBanner = useCallback(() => {
    setIsVisible(false);
    sessionStorage.setItem("showAntiPhishingBanner", "false");
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 mx-8 mt-8 flex justify-center">
      <div className="p-2 rounded bg-red-100 text-red-900 text-xs overflow-auto whitespace-normal flex items-center justify-between">
        <div className="text-center">
          <strong className="text-sm">PHISHING WARNING:</strong> <br />
          Be vigilant! <br />
          Ensure you&apos;re visiting the authentic site:{" "}
          <strong>{APP_HOST}</strong>. <br />
          Stay safe from phishing attacks!
        </div>
        <button onClick={closeBanner} className="ml-4">
          ✖
        </button>
      </div>
    </div>
  );
});
AntiPhishingBanner.displayName = "AntiPhishingBanner";

export default AntiPhishingBanner;
