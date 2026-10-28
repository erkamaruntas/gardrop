import type { CategoryId, ColorId, Formality, Pattern, Season, Slot } from '@/types/wardrobe';

export const CATEGORIES: { id: CategoryId; label: string; slot: Slot }[] = [
  { id: 'tisort', label: 'Tişört', slot: 'top' },
  { id: 'gomlek', label: 'Gömlek', slot: 'top' },
  { id: 'kazak', label: 'Kazak', slot: 'top' },
  { id: 'sweatshirt', label: 'Sweatshirt', slot: 'top' },
  { id: 'pantolon', label: 'Pantolon', slot: 'bottom' },
  { id: 'sort', label: 'Şort', slot: 'bottom' },
  { id: 'etek', label: 'Etek', slot: 'bottom' },
  { id: 'elbise', label: 'Elbise', slot: 'dress' },
  { id: 'ceket', label: 'Ceket', slot: 'outer' },
  { id: 'mont', label: 'Mont', slot: 'outer' },
  { id: 'ayakkabi', label: 'Ayakkabı', slot: 'shoes' },
  { id: 'aksesuar', label: 'Aksesuar', slot: 'accessory' },
];

/** `neutral` renkler kombin motorunda her şeyle uyumlu sayılır. */
export const COLORS: { id: ColorId; label: string; hex: string; neutral: boolean }[] = [
  { id: 'siyah', label: 'Siyah', hex: '#111111', neutral: true },
  { id: 'beyaz', label: 'Beyaz', hex: '#FAFAFA', neutral: true },
  { id: 'gri', label: 'Gri', hex: '#8E8E93', neutral: true },
  { id: 'bej', label: 'Bej', hex: '#D9C7A7', neutral: true },
  { id: 'kahverengi', label: 'Kahverengi', hex: '#7B5136', neutral: true },
  { id: 'lacivert', label: 'Lacivert', hex: '#1F2A4D', neutral: true },
  { id: 'mavi', label: 'Mavi', hex: '#2F6FD6', neutral: false },
  { id: 'acik-mavi', label: 'Açık mavi', hex: '#9CC3EC', neutral: false },
  { id: 'yesil', label: 'Yeşil', hex: '#2E8B57', neutral: false },
  { id: 'haki', label: 'Haki', hex: '#7C7A4F', neutral: false },
  { id: 'kirmizi', label: 'Kırmızı', hex: '#D0312D', neutral: false },
  { id: 'bordo', label: 'Bordo', hex: '#7A1F2B', neutral: false },
  { id: 'pembe', label: 'Pembe', hex: '#F2A2C0', neutral: false },
  { id: 'mor', label: 'Mor', hex: '#7D4CB0', neutral: false },
  { id: 'sari', label: 'Sarı', hex: '#F2C94C', neutral: false },
  { id: 'turuncu', label: 'Turuncu', hex: '#EE8434', neutral: false },
];

export const SEASONS: { id: Season; label: string }[] = [
  { id: 'ilkbahar', label: 'İlkbahar' },
  { id: 'yaz', label: 'Yaz' },
  { id: 'sonbahar', label: 'Sonbahar' },
  { id: 'kis', label: 'Kış' },
];

export const PATTERNS: { id: Pattern; label: string }[] = [
  { id: 'duz', label: 'Düz' },
  { id: 'desenli', label: 'Desenli' },
];

export const FORMALITY: { id: Formality; label: string }[] = [
  { id: 1, label: 'Spor' },
  { id: 2, label: 'Günlük' },
  { id: 3, label: 'Smart casual' },
  { id: 4, label: 'İş' },
  { id: 5, label: 'Resmi' },
];

export const categoryLabel = (id: CategoryId) => CATEGORIES.find((c) => c.id === id)?.label ?? id;
export const colorOf = (id: ColorId) => COLORS.find((c) => c.id === id);
