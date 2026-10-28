import { useEffect, useState } from 'react';

import { isBackgroundRemovalSupported, removeBackgroundAsync } from '../../modules/background-remover';

type CutoutResult = { source: string; cutout?: string; error?: string };

/**
 * Verilen görselin arka planını cihazda siler.
 * Desteklenmeyen ortamlarda (Expo Go, simülatör, Android) hiçbir şey yapmaz.
 */
export function useCutout(uri: string) {
  const supported = isBackgroundRemovalSupported();
  const [result, setResult] = useState<CutoutResult>();

  useEffect(() => {
    if (!supported) return;
    let cancelled = false;
    removeBackgroundAsync(uri).then(
      (cutout) => !cancelled && setResult({ source: uri, cutout }),
      (error: unknown) =>
        !cancelled &&
        setResult({ source: uri, error: error instanceof Error ? error.message : String(error) }),
    );
    return () => {
      cancelled = true;
    };
  }, [supported, uri]);

  const current = result?.source === uri ? result : undefined;
  return {
    supported,
    loading: supported && !current,
    cutout: current?.cutout,
    error: current?.error,
  };
}
