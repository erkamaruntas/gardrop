import { Directory, File, Paths } from 'expo-file-system';

const ITEMS_DIR = 'items';

function itemsDirectory() {
  const dir = new Directory(Paths.document, ITEMS_DIR);
  dir.create({ idempotent: true, intermediates: true });
  return dir;
}

/** Picker'ın geçici dosyasını kalıcı klasöre kopyalar, dosya adını döner. */
export async function persistImage(sourceUri: string, id: string): Promise<string> {
  const source = new File(sourceUri);
  const name = `${id}${source.extension || '.jpg'}`;
  await source.copy(new File(itemsDirectory(), name));
  return name;
}

export function imageUri(fileName: string) {
  return new File(Paths.document, ITEMS_DIR, fileName).uri;
}

export function deleteImage(fileName: string) {
  const file = new File(Paths.document, ITEMS_DIR, fileName);
  if (file.exists) file.delete();
}
