import { useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Chip } from '@/components/chip';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { CATEGORIES, COLORS, FORMALITY, PATTERNS, SEASONS } from '@/constants/wardrobe';
import type { CategoryId, ClothingItemDraft, ColorId, Season } from '@/types/wardrobe';

type ItemFormProps = {
  initial?: ClothingItemDraft;
  submitLabel: string;
  onSubmit: (draft: ClothingItemDraft) => void;
  submitting?: boolean;
};

const EMPTY: Omit<ClothingItemDraft, 'category'> & { category: CategoryId | null } = {
  category: null,
  colors: [],
  pattern: 'duz',
  formality: 2,
  seasons: ['ilkbahar', 'yaz', 'sonbahar', 'kis'],
};

function toggle<T>(list: T[], value: T) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export function ItemForm({ initial, submitLabel, onSubmit, submitting }: ItemFormProps) {
  const [draft, setDraft] = useState(initial ?? EMPTY);
  const { category } = draft;
  const isValid = category !== null && draft.colors.length > 0 && draft.seasons.length > 0;

  return (
    <View style={styles.form}>
      <Field label="Kategori">
        {CATEGORIES.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={draft.category === c.id}
            onPress={() => setDraft({ ...draft, category: c.id })}
          />
        ))}
      </Field>

      <Field label="Renkler">
        {COLORS.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            swatch={c.hex}
            selected={draft.colors.includes(c.id)}
            onPress={() => setDraft({ ...draft, colors: toggle<ColorId>(draft.colors, c.id) })}
          />
        ))}
      </Field>

      <Field label="Desen">
        {PATTERNS.map((p) => (
          <Chip
            key={p.id}
            label={p.label}
            selected={draft.pattern === p.id}
            onPress={() => setDraft({ ...draft, pattern: p.id })}
          />
        ))}
      </Field>

      <Field label="Tarz">
        {FORMALITY.map((f) => (
          <Chip
            key={f.id}
            label={f.label}
            selected={draft.formality === f.id}
            onPress={() => setDraft({ ...draft, formality: f.id })}
          />
        ))}
      </Field>

      <Field label="Mevsim">
        {SEASONS.map((s) => (
          <Chip
            key={s.id}
            label={s.label}
            selected={draft.seasons.includes(s.id)}
            onPress={() => setDraft({ ...draft, seasons: toggle<Season>(draft.seasons, s.id) })}
          />
        ))}
      </Field>

      <Button
        title={submitLabel}
        disabled={!isValid || submitting}
        onPress={() => category && onSubmit({ ...draft, category })}
      />
      {!isValid && (
        <ThemedText type="small" themeColor="textSecondary" style={styles.hint}>
          Kategori, en az bir renk ve en az bir mevsim seç.
        </ThemedText>
      )}
    </View>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <View style={styles.chips}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.four,
  },
  field: {
    gap: Spacing.two,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  hint: {
    textAlign: 'center',
  },
});
