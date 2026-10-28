/** Kombin motorunun doldurduğu yerler. Bir kombin = (üst + alt) veya elbise, + ayakkabı. */
export type Slot = 'top' | 'bottom' | 'dress' | 'outer' | 'shoes' | 'accessory';

export type CategoryId =
  | 'tisort'
  | 'gomlek'
  | 'kazak'
  | 'sweatshirt'
  | 'pantolon'
  | 'sort'
  | 'etek'
  | 'elbise'
  | 'ceket'
  | 'mont'
  | 'ayakkabi'
  | 'aksesuar';

export type ColorId =
  | 'siyah'
  | 'beyaz'
  | 'gri'
  | 'bej'
  | 'kahverengi'
  | 'lacivert'
  | 'mavi'
  | 'acik-mavi'
  | 'yesil'
  | 'haki'
  | 'kirmizi'
  | 'bordo'
  | 'pembe'
  | 'mor'
  | 'sari'
  | 'turuncu';

export type Season = 'ilkbahar' | 'yaz' | 'sonbahar' | 'kis';

export type Pattern = 'duz' | 'desenli';

/** 1 = spor/ev, 5 = resmi */
export type Formality = 1 | 2 | 3 | 4 | 5;

export interface ClothingItem {
  id: string;
  /** Uygulamanın belge klasöründeki dosya adı. Tam yol her açılışta yeniden çözülür (iOS kapsayıcı yolu değişebilir). */
  imageFile: string;
  category: CategoryId;
  colors: ColorId[];
  pattern: Pattern;
  formality: Formality;
  seasons: Season[];
  createdAt: number;
  /** Supabase Storage'daki yol; görsel yüklenince dolar. */
  imagePath?: string;
  /** false ise yerel değişiklik henüz Supabase'e gönderilmedi. */
  synced: boolean;
}

export type ClothingItemDraft = Pick<
  ClothingItem,
  'category' | 'colors' | 'pattern' | 'formality' | 'seasons'
>;
