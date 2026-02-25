/**
 * Chative Live Chat boot helper
 * - Dùng guest ID lưu localStorage để giữ phiên chat khi third-party cookie bị chặn
 * - Thêm hostname giúp Chative nhận diện domain
 */

const CHATIVE_GUEST_KEY = 'cns_chative_guest_id';
const CHANNEL_ID = 'sbdd832c0-715c-42c6-878c-5b3e5de6c9ac';

/**
 * Lấy hoặc tạo guest ID (persistent nếu localStorage khả dụng)
 * @returns {{ guestId: string, storageOk: boolean }}
 */
export function getOrCreateGuestId() {
  try {
    let id = localStorage.getItem(CHATIVE_GUEST_KEY);
    if (!id) {
      id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
      localStorage.setItem(CHATIVE_GUEST_KEY, id);
    }
    return { guestId: id, storageOk: true };
  } catch {
    const id = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
    return { guestId: id, storageOk: false };
  }
}

/**
 * Gọi boot Chative với guest ID (giúp session ổn định hơn khi cookie bị chặn)
 * @param {{ guestId: string }} opts
 */
export function bootChative(opts) {
  const { guestId } = opts;
  if (typeof window === 'undefined' || !window.chativeApi) return;

  try {
    window.chativeApi('boot', {
      user_id: guestId,
      isHidden: false,
    });
  } catch {
    // Chative chưa sẵn sàng, bỏ qua
  }
}

export { CHANNEL_ID };
