import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { CATEGORIES } from '@/constants/wardrobe';
import { useTheme } from '@/hooks/use-theme';
import { imageUri } from '@/lib/images';
import { pickClothingImages } from '@/lib/pick-images';
import { useWardrobe } from '@/stores/wardrobe';
import type { CategoryId } from '@/types/wardrobe';

const COLUMNS = 3;

export default function WardrobeScreen() {
  const theme = useTheme();
  const items = useWardrobe((s) => s.items);
  const [filter, setFilter] = useState<CategoryId | null>(null);
  const { width } = useWindowDimensions();
  const tileSize = (width - Spacing.three * 2 - Spacing.two * (COLUMNS - 1)) / COLUMNS;

  const unsyncedCount = items.filter((i) => !i.synced).length;
  const visible = filter ? items.filter((i) => i.category === filter) : items;
  const usedCategories = CATEGORIES.filter((c) => items.some((i) => i.category === c.id));

  const addItems = async () => {
    const uris = await pickClothingImages();
    if (uris.length > 0) {
      router.push({ pathname: '/item/new', params: { uris: JSON.stringify(uris) } });
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.container}>
        <View style={styles.header}>
          <ThemedText type="subtitle">Gardırop</ThemedText>
          <ThemedText type="small" themeColor="textSecondary">
            {items.length} parça
            {unsyncedCount > 0 && ` · ${unsyncedCount} yüklenmeyi bekliyor`}
          </ThemedText>
        </View>

        {usedCategories.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterBar}
            contentContainerStyle={styles.filters}>
            <Chip label="Tümü" selected={filter === null} onPress={() => setFilter(null)} />
            {usedCategories.map((c) => (
              <Chip
                key={c.id}
                label={c.label}
                selected={filter === c.id}
                onPress={() => setFilter(filter === c.id ? null : c.id)}
              />
            ))}
          </ScrollView>
        )}

        {items.length === 0 ? (
          <View style={styles.empty}>
            <ThemedText type="smallBold">Gardırobun henüz boş</ThemedText>
            <ThemedText type="small" themeColor="textSecondary" style={styles.emptyText}>
              Kıyafetlerinin fotoğrafını çek ya da galeriden toplu seç. İlk hedef: 10 parça.
            </ThemedText>
            <Button title="İlk parçanı ekle" onPress={addItems} />
          </View>
        ) : (
          <FlatList
            data={visible}
            keyExtractor={(item) => item.id}
            numColumns={COLUMNS}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.grid}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => router.push({ pathname: '/item/[id]', params: { id: item.id } })}
                style={({ pressed }) => [
                  styles.tile,
                  { width: tileSize, height: tileSize, backgroundColor: theme.backgroundElement },
                  pressed && styles.pressed,
                ]}>
                <Image source={{ uri: imageUri(item.imageFile) }} style={styles.image} contentFit="contain" />
              </Pressable>
            )}
          />
        )}

        {items.length > 0 && (
          <Pressable
            onPress={addItems}
            accessibilityRole="button"
            accessibilityLabel="Parça ekle"
            style={({ pressed }) => [styles.fab, { backgroundColor: theme.accent }, pressed && styles.pressed]}>
            <ThemedText style={[styles.fabIcon, { color: theme.onAccent }]}>+</ThemedText>
          </Pressable>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.two,
  },
  filterBar: {
    flexGrow: 0,
  },
  filters: {
    gap: Spacing.two,
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.three,
  },
  grid: {
    paddingHorizontal: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.six * 2,
    gap: Spacing.two,
  },
  row: {
    gap: Spacing.two,
  },
  tile: {
    borderRadius: Spacing.two,
    overflow: 'hidden',
    padding: Spacing.two,
  },
  image: {
    flex: 1,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.five,
    paddingBottom: BottomTabInset,
  },
  emptyText: {
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: Spacing.four,
    bottom: BottomTabInset + Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabIcon: {
    fontSize: 30,
    lineHeight: 34,
  },
  pressed: {
    opacity: 0.7,
  },
});
