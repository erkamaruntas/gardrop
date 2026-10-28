import { Image } from 'expo-image';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Chip } from '@/components/chip';
import { ItemForm } from '@/components/item-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useCutout } from '@/hooks/use-cutout';
import { useTheme } from '@/hooks/use-theme';
import { useWardrobe } from '@/stores/wardrobe';
import type { ClothingItemDraft } from '@/types/wardrobe';

function parseUris(raw: string | undefined): string[] {
  try {
    const parsed: unknown = JSON.parse(raw ?? '[]');
    return Array.isArray(parsed) ? parsed.filter((u): u is string => typeof u === 'string') : [];
  } catch {
    return [];
  }
}

/** Seçilen her görsel için sırayla etiket formu gösterir. */
export default function NewItemScreen() {
  const { uris: rawUris } = useLocalSearchParams<{ uris: string }>();
  const [uris] = useState(() => parseUris(rawUris));
  const [index, setIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const addItem = useWardrobe((s) => s.addItem);

  const current = uris.at(index);
  if (!current) return null;

  const save = async (imageUri: string, draft: ClothingItemDraft) => {
    setSaving(true);
    try {
      await addItem(imageUri, draft);
      if (index + 1 < uris.length) setIndex(index + 1);
      else router.back();
    } catch (error) {
      Alert.alert('Kaydedilemedi', String(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{ title: uris.length > 1 ? `Yeni parça ${index + 1}/${uris.length}` : 'Yeni parça' }}
      />
      <NewItemEditor
        key={current}
        sourceUri={current}
        isLast={index + 1 === uris.length}
        saving={saving}
        onSave={save}
      />
    </ThemedView>
  );
}

type NewItemEditorProps = {
  sourceUri: string;
  isLast: boolean;
  saving: boolean;
  onSave: (imageUri: string, draft: ClothingItemDraft) => void;
};

/** Tek bir görsel: arka plan silme önizlemesi + etiket formu. Her görsel için key ile sıfırlanır. */
function NewItemEditor({ sourceUri, isLast, saving, onSave }: NewItemEditorProps) {
  const theme = useTheme();
  const { supported, loading, cutout, error } = useCutout(sourceUri);
  const [useOriginal, setUseOriginal] = useState(false);
  const imageUri = cutout && !useOriginal ? cutout : sourceUri;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View>
        <Image
          source={{ uri: imageUri }}
          style={[styles.image, { backgroundColor: theme.backgroundElement }]}
          contentFit="contain"
        />
        {loading && (
          <View style={[styles.overlay, { backgroundColor: `${theme.background}CC` }]}>
            <ActivityIndicator color={theme.text} />
            <ThemedText type="small">Arka plan siliniyor…</ThemedText>
          </View>
        )}
      </View>

      {cutout && (
        <View style={styles.toggle}>
          <Chip label="Arka plansız" selected={!useOriginal} onPress={() => setUseOriginal(false)} />
          <Chip label="Orijinal" selected={useOriginal} onPress={() => setUseOriginal(true)} />
        </View>
      )}
      {supported && error && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.note}>
          Arka plan silinemedi: {error} Orijinal fotoğraf kullanılacak.
        </ThemedText>
      )}

      <ItemForm
        submitLabel={isLast ? 'Kaydet' : 'Kaydet ve sonrakine geç'}
        submitting={saving || loading}
        onSubmit={(draft) => onSave(imageUri, draft)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    borderRadius: Spacing.three,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  note: {
    textAlign: 'center',
  },
});
