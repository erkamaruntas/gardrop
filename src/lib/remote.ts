import { File } from 'expo-file-system';

import { imageUri } from '@/lib/images';
import { ensureSession, supabase } from '@/lib/supabase';
import type { ClothingItem } from '@/types/wardrobe';

const BUCKET = 'items';

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.heic': 'image/heic',
  '.webp': 'image/webp',
};

/** Görseli (henüz yüklenmediyse) ve satırı Supabase'e yazar. Uzak görsel yolunu döner. */
export async function pushItem(item: ClothingItem): Promise<string> {
  const session = await ensureSession();
  let imagePath = item.imagePath;

  if (!imagePath) {
    const file = new File(imageUri(item.imageFile));
    const path = remoteImagePath(session?.user.id, item.imageFile);
    const { error } = await supabase.storage.from(BUCKET).upload(path, await file.arrayBuffer(), {
      contentType: CONTENT_TYPES[file.extension.toLowerCase()] ?? 'image/jpeg',
      upsert: true,
    });
    if (error) throw error;
    imagePath = path;
  }

  const { error } = await supabase.from('items').upsert({
    id: item.id,
    image_path: imagePath,
    category: item.category,
    colors: item.colors,
    pattern: item.pattern,
    formality: item.formality,
    seasons: item.seasons,
    created_at: new Date(item.createdAt).toISOString(),
  });
  if (error) throw error;

  return imagePath;
}

/** Satırı ve görseli siler. Uzakta hiç yoksa hata vermez. */
export async function deleteRemoteItem(id: string, imageFile: string) {
  const session = await ensureSession();
  const { error } = await supabase.from('items').delete().eq('id', id);
  if (error) throw error;
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([remoteImagePath(session?.user.id, imageFile)]);
  if (storageError) throw storageError;
}

const remoteImagePath = (userId: string | undefined, imageFile: string) => `${userId}/${imageFile}`;
