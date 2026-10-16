import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Screen from '../components/Screen';
import AppHeader from '../components/AppHeader';
import FigmaIcon from '../components/FigmaIcon';
import { GlassCard, Pill, StarCount } from '../components/ui';
import { useAppState } from '../state/AppState';
import { SHOP_CATEGORIES, SHOP_ITEMS, ShopCategory, ShopItem } from '../constants/shop';
import { Colors, Fonts, Type } from '../constants/theme';

function ItemCard({ item }: { item: ShopItem }) {
  const { stars, inventory, buyItem } = useAppState();
  const owned = inventory.includes(item.id);
  const missing = item.price - stars;

  let label = `Acheter ${item.name}`;
  if (owned) label = `${item.name}, déjà acquis`;
  else if (missing > 0) label = `${item.name} : il te manque ${missing} étoiles`;

  return (
    <GlassCard style={styles.card}>
      <View style={styles.preview}>
        <FigmaIcon name="iconCloth" />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {item.name}
      </Text>
      <View style={styles.cardFooter}>
        <StarCount value={item.price} />
        <TouchableOpacity
          onPress={() => buyItem(item.id)}
          disabled={owned || missing > 0}
          activeOpacity={0.85}
          accessibilityRole="button"
          aria-label={label}
          style={[styles.buy, owned && styles.owned, !owned && missing > 0 && styles.unaffordable]}
        >
          <Text style={[styles.buyText, owned && styles.ownedText]}>
            {owned ? 'Acquis' : 'Acheter'}
          </Text>
        </TouchableOpacity>
      </View>
    </GlassCard>
  );
}

export default function BoutiqueScreen() {
  const navigation = useNavigation();
  const { stars } = useAppState();
  const [category, setCategory] = useState<ShopCategory>('accessoires');
  const items = SHOP_ITEMS.filter((item) => item.category === category);

  return (
    <Screen
      header={
        <AppHeader
          variant="shop"
          title="Boutique"
          stars={stars}
          onBack={() => navigation.navigate('Accueil' as never)}
        />
      }
    >
      <View style={styles.main}>
        <View style={styles.heading}>
          <Text style={Type.title} accessibilityRole="header">
            Accessoires et ambiances
          </Text>
          <Text style={Type.subtitle}>Des objets doux gagnés avec tes XP</Text>
        </View>

        <View style={styles.tabs} accessibilityRole="tablist">
          {SHOP_CATEGORIES.map((c) => (
            <Pill
              key={c.id}
              label={c.label}
              selected={c.id === category}
              onPress={() => setCategory(c.id)}
            />
          ))}
        </View>

        {items.length === 0 ? (
          <Text style={styles.empty}>Bientôt de nouvelles douceurs ici. Reviens vite !</Text>
        ) : (
          <View style={styles.grid}>
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </View>
        )}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  main: {
    gap: 32,
  },
  heading: {
    gap: 8,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '48%',
    flexGrow: 1,
    flexBasis: 140,
    gap: 12,
  },
  preview: {
    height: 130,
    borderRadius: 12,
    backgroundColor: Colors.lightBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontFamily: Fonts.interSemiBold,
    fontSize: 12,
    lineHeight: 16,
    color: Colors.black,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buy: {
    backgroundColor: Colors.blue,
    borderRadius: 50,
    paddingHorizontal: 12,
  },
  buyText: {
    fontFamily: Fonts.jakartaBold,
    fontSize: 12,
    lineHeight: 32,
    letterSpacing: -1.2,
    color: Colors.white,
  },
  unaffordable: {
    opacity: 0.4,
  },
  owned: {
    backgroundColor: Colors.white,
  },
  ownedText: {
    color: Colors.blue,
  },
  empty: {
    fontFamily: Fonts.interRegular,
    fontSize: 14,
    lineHeight: 20,
    color: Colors.inkMuted,
  },
});
