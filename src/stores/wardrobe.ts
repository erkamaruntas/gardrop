import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { deleteImage, persistImage } from '@/lib/images';
import { deleteRemoteItem, pushItem } from '@/lib/remote';
import type { ClothingItem, ClothingItemDraft } from '@/types/wardrobe';

type PendingDelete = { id: string; imageFile: string };

interface WardrobeState {
  items: ClothingItem[];
  /** Silinmiş ama Supabase'den henüz kaldırılamamış parçalar. */
  pendingDeletes: PendingDelete[];
  syncing: boolean;
  addItem: (sourceUri: string, draft: ClothingItemDraft) => Promise<ClothingItem>;
  updateItem: (id: string, draft: ClothingItemDraft) => void;
  removeItem: (id: string) => void;
  /** Bekleyen tüm değişiklikleri Supabase'e gönderir. Hata olursa sonraki çağrıda tekrar dener. */
  syncPending: () => Promise<void>;
}

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const useWardrobe = create<WardrobeState>()(
  persist(
    (set, get) => ({
      items: [],
      pendingDeletes: [],
      syncing: false,

      addItem: async (sourceUri, draft) => {
        const id = newId();
        const imageFile = await persistImage(sourceUri, id);
        const item: ClothingItem = { ...draft, id, imageFile, createdAt: Date.now(), synced: false };
        set({ items: [item, ...get().items] });
        get().syncPending();
        return item;
      },

      updateItem: (id, draft) => {
        set({
          items: get().items.map((item) => (item.id === id ? { ...item, ...draft, synced: false } : item)),
        });
        get().syncPending();
      },

      removeItem: (id) => {
        const item = get().items.find((i) => i.id === id);
        if (!item) return;
        deleteImage(item.imageFile);
        set({
          items: get().items.filter((i) => i.id !== id),
          // Yükleme o an sürüyor olabilir; uzakta yoksa silme zararsızdır.
          pendingDeletes: [...get().pendingDeletes, { id, imageFile: item.imageFile }],
        });
        get().syncPending();
      },

      syncPending: async () => {
        if (get().syncing) return;
        set({ syncing: true });
        try {
          // Senkron sürerken gelen değişiklikler de bu döngüde işlenir.
          while (true) {
            const pendingDelete = get().pendingDeletes.at(0);
            if (pendingDelete) {
              await deleteRemoteItem(pendingDelete.id, pendingDelete.imageFile);
              set({ pendingDeletes: get().pendingDeletes.filter((p) => p.id !== pendingDelete.id) });
              continue;
            }

            const pushed = get().items.find((i) => !i.synced);
            if (!pushed) break;
            const imagePath = await pushItem(pushed);
            set({
              items: get().items.map((i) =>
                // Yükleme sürerken düzenlenen parça (farklı nesne) senkronsuz kalır ve tekrar gönderilir.
                i.id === pushed.id ? { ...i, imagePath, synced: i === pushed } : i,
              ),
            });
          }
        } catch (error) {
          console.warn('Senkronizasyon başarısız, daha sonra tekrar denenecek:', error);
        } finally {
          set({ syncing: false });
        }
      },
    }),
    {
      name: 'wardrobe',
      version: 2,
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ items: state.items, pendingDeletes: state.pendingDeletes }),
      migrate: (persisted, version) => {
        const state = persisted as { items: ClothingItem[]; pendingDeletes?: PendingDelete[] };
        if (version < 2) {
          // v1 sadece yereldi: tüm parçalar ilk açılışta Supabase'e yüklenir.
          state.items = state.items.map((i) => ({ ...i, synced: false }));
          state.pendingDeletes = [];
        }
        return state as WardrobeState;
      },
    },
  ),
);
