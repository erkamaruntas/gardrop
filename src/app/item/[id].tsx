import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { ItemForm } from '@/components/item-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { categoryLabel } from '@/constants/wardrobe';
import { useTheme } from '@/hooks/use-theme';
import { imageUri } from '@/lib/images';
import { useWardrobe } from '@/stores/wardrobe';

export default function ItemDetailScreen() {
  const theme = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = useWardrobe((s) => s.items.find((i) => i.id === id));
  const updateItem = useWardrobe((s) => s.updateItem);
  const removeItem = useWardrobe((s) => s.removeItem);

  if (!item) {
    return (
      <ThemedView style={styles.missing}>
        <ThemedText themeColor="textSecondary">Bu parça bulunamadı.</ThemedText>
      </ThemedView>
    );
  }

  const confirmDelete = () =>
    Alert.alert('Parçayı sil', 'Bu parça gardırobundan kalıcı olarak silinecek.', [
      { text: 'Vazgeç', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: () => {
          router.back();
          removeItem(item.id);
        },
      },
    ]);

  const { imageFile, category, colors, pattern, formality, seasons } = item;
  const draft = { category, colors, pattern, formality, seasons };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: categoryLabel(item.category) }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Image
          source={{ uri: imageUri(imageFile) }}
          style={[styles.image, { backgroundColor: theme.backgroundElement }]}
          contentFit="contain"
        />

        <View style={styles.actions}>
          <Button title="Bununla kombinle (yakında)" variant="secondary" disabled onPress={() => {}} />
        </View>

        <ItemForm
          initial={draft}
          submitLabel="Değişiklikleri kaydet"
          onSubmit={(next) => {
            updateItem(item.id, next);
            router.back();
          }}
        />

        <Button title="Parçayı sil" variant="danger" onPress={confirmDelete} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  missing: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing.three,
    gap: Spacing.four,
    paddingBottom: Spacing.six,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Spacing.three,
  },
  actions: {
    gap: Spacing.two,
  },
});
