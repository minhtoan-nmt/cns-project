import { useEffect, useState } from 'react';
import { getOrCreateGuestId, bootChative } from '../../utils/chativeBoot';

/**
 * Chative Live Chat – boot với guest ID + cảnh báo khi storage bị chặn (chế độ ẩn danh)
 */
export default function ChativeChat() {
  const [storageBlocked, setStorageBlocked] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    const { guestId, storageOk } = getOrCreateGuestId();
    if (!storageOk) setStorageBlocked(true);

    const tryBoot = () => {
      if (window.chativeApi) {
        bootChative({ guestId });
        return true;
      }
      return false;
    };

    if (tryBoot()) return;

    const interval = setInterval(() => {
      if (tryBoot()) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  if (!storageBlocked || bannerDismissed) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-[9998] max-w-sm rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 shadow-lg sm:left-4 sm:right-auto"
      role="alert"
    >
      <p className="text-sm text-amber-900">
        Để chat AI hoạt động, hãy tắt chế độ ẩn danh hoặc cho phép cookie cho trang web này.
      </p>
      <button
        type="button"
        onClick={() => setBannerDismissed(true)}
        className="mt-2 text-xs font-medium text-amber-700 underline hover:text-amber-900"
      >
        Đã hiểu
      </button>
    </div>
  );
}
