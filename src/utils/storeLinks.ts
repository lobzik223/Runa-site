export const APP_STORE_URL = 'https://apps.apple.com/ru/app/runa-finance/id6758866400';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.runafinance.app';

export type StorePlatform = 'ios' | 'android' | 'other';

export function detectStorePlatform(): StorePlatform {
  if (typeof navigator === 'undefined') return 'other';

  const ua = navigator.userAgent || navigator.vendor || '';
  if (/android/i.test(ua)) return 'android';

  if (
    /iPad|iPhone|iPod/i.test(ua)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) {
    return 'ios';
  }

  return 'other';
}

export function getStoreUrl(platform: StorePlatform = detectStorePlatform()): string {
  if (platform === 'android') return PLAY_STORE_URL;
  return APP_STORE_URL;
}
