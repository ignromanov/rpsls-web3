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
    <div className="fixed top-0 left-auto right-auto mt-8 bg-red-100 flex justify-center z-50 shadow-lg">
      <div className="p-2 rounded  text-red-900 text-xs overflow-auto whitespace-normal flex items-center justify-between">
        <div className="text-center">
          Be vigilant! <br />
          <strong className="text-sm">PHISHING WARNING:</strong> <br />
          Ensure you&apos;re visiting the authentic site:{" "}
          <strong>{APP_HOST}</strong>. <br />
          Stay safe from phishing attacks!
        </div>
      </div>
      <button onClick={closeBanner} className="relative h-min top-1 right-2">
        ✖
      </button>
    </div>
  );
});
AntiPhishingBanner.displayName = "AntiPhishingBanner";

export default AntiPhishingBanner;
