export type ShopCategory = 'accessoires' | 'themes' | 'ambiances';

export interface ShopItem {
  id: string;
  name: string;
  price: number;
  category: ShopCategory;
}

export const SHOP_CATEGORIES: { id: ShopCategory; label: string }[] = [
  { id: 'accessoires', label: 'Accessoires' },
  { id: 'themes', label: 'Thèmes' },
  { id: 'ambiances', label: 'Ambiances' },
];

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'gants', name: 'Gants galactiques', price: 280, category: 'accessoires' },
  { id: 'bottines', name: 'Bottines nébuleuses', price: 280, category: 'accessoires' },
  { id: 'chapeau', name: 'Chapeau astral', price: 280, category: 'accessoires' },
  { id: 'ceinture', name: 'Ceinture d’astéroïdes', price: 280, category: 'accessoires' },
  { id: 'lunettes', name: 'Lunettes cosmos', price: 280, category: 'accessoires' },
  { id: 'echarpe', name: 'Écharpe céleste', price: 280, category: 'accessoires' },
];
