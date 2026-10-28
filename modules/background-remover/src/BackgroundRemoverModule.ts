import { NativeModule, requireOptionalNativeModule } from 'expo';

declare class BackgroundRemoverModule extends NativeModule<{}> {
  isSupported(): boolean;
  removeBackgroundAsync(uri: string): Promise<string>;
}

// Expo Go'da native modül yoktur; null döner ve uygulama arka plan silmeden çalışmaya devam eder.
export default requireOptionalNativeModule<BackgroundRemoverModule>('BackgroundRemover');
