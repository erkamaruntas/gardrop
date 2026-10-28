import BackgroundRemoverModule from './src/BackgroundRemoverModule';

/** Bu cihazda (ve bu build'de) arka plan silme kullanılabilir mi? Expo Go'da her zaman false. */
export function isBackgroundRemovalSupported(): boolean {
  return BackgroundRemoverModule?.isSupported() ?? false;
}

/**
 * Görseldeki ana nesneyi keser. Şeffaf arka planlı, nesneye kırpılmış PNG'nin URI'sini döner.
 * Desteklenmiyorsa veya nesne bulunamazsa hata fırlatır.
 */
export function removeBackgroundAsync(uri: string): Promise<string> {
  if (!BackgroundRemoverModule) {
    return Promise.reject(new Error('Arka plan silme bu build’de mevcut değil.'));
  }
  return BackgroundRemoverModule.removeBackgroundAsync(uri);
}
