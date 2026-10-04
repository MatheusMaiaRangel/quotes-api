import { Link } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useQuotesColors } from '@/constants/quotes-theme';
import { useFavorites } from '@/contexts/favorites-context';

export function QuotesHeader({ active }: { active: 'explore' | 'favorites' }) {
  const colors = useQuotesColors();
  const { favorites } = useFavorites();

  return (
    <View style={styles.bar}>
      <View style={styles.brand}>
        <View style={[styles.icon, { backgroundColor: colors.feature }]}>
          <Text style={styles.iconText}>“</Text>
        </View>
        <Text style={[styles.brandText, { color: colors.ink }]}>quotes<Text style={{ color: colors.accent }}>.</Text></Text>
      </View>
      <View style={[styles.navigation, { backgroundColor: colors.soft }]}>
        <Link href="/" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityState={{ selected: active === 'explore' }}
            style={StyleSheet.flatten([styles.navItem, active === 'explore' && { backgroundColor: colors.surface }])}>
            <Text style={[styles.navText, { color: active === 'explore' ? colors.ink : colors.muted }]}>Explorar</Text>
          </Pressable>
        </Link>
        <Link href="/favorites" asChild>
          <Pressable
            accessibilityRole="link"
            accessibilityState={{ selected: active === 'favorites' }}
            style={StyleSheet.flatten([styles.navItem, active === 'favorites' && { backgroundColor: colors.surface }])}>
            <Text style={[styles.navText, { color: active === 'favorites' ? colors.ink : colors.muted }]}>
              ♥ Curtidas{favorites.length > 0 ? ` ${favorites.length}` : ''}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { minHeight: 84, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  icon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  iconText: { color: '#FFFFFF', fontSize: 28, fontWeight: '700', lineHeight: 34, marginTop: 6 },
  brandText: { fontSize: 24, fontWeight: '700', letterSpacing: -1.3 },
  navigation: { flexDirection: 'row', padding: 4, borderRadius: 50, alignItems: 'center' },
  navItem: { minHeight: 44, borderRadius: 22, paddingHorizontal: 13, alignItems: 'center', justifyContent: 'center' },
  navText: { fontSize: 12, fontWeight: '700' },
});
