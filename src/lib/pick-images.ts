import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

const PICKER_OPTIONS: ImagePicker.ImagePickerOptions = { mediaTypes: 'images', quality: 0.8 };

async function fromCamera(): Promise<string[]> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();
  if (!permission.granted) {
    Alert.alert('Kamera izni gerekli', 'Ayarlar’dan kamera erişimine izin verebilirsin.');
    return [];
  }
  const result = await ImagePicker.launchCameraAsync(PICKER_OPTIONS);
  return result.canceled ? [] : result.assets.map((a) => a.uri);
}

async function fromLibrary(): Promise<string[]> {
  const result = await ImagePicker.launchImageLibraryAsync({
    ...PICKER_OPTIONS,
    allowsMultipleSelection: true,
    selectionLimit: 20,
  });
  return result.canceled ? [] : result.assets.map((a) => a.uri);
}

/** Kamera / galeri seçimini sorar, seçilen görsellerin geçici URI'lerini döner. */
export function pickClothingImages(): Promise<string[]> {
  return new Promise((resolve) => {
    Alert.alert('Parça ekle', 'Kıyafeti düz bir zemine serip çekersen sonuç daha iyi olur.', [
      { text: 'Fotoğraf çek', onPress: () => fromCamera().then(resolve, () => resolve([])) },
      { text: 'Galeriden seç', onPress: () => fromLibrary().then(resolve, () => resolve([])) },
      { text: 'Vazgeç', style: 'cancel', onPress: () => resolve([]) },
    ]);
  });
}
