import { useEffect, useState } from "react";

export const OfflineBanner = (): JSX.Element | null => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    // Set initial state
    setIsOnline(navigator.onLine);

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-warning px-4 py-2 text-center">
      <p className="text-sm font-medium text-on-tertiary">
        <span className="material-symbols-outlined text-sm align-middle mr-2">
          wifi_off
        </span>
        You're offline. Some features may be limited until you reconnect.
      </p>
    </div>
  );
};
