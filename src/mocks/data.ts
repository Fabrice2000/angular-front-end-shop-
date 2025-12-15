export interface Product {
  id: number;
  name: string;
  price: number;
  created_at: string;
  owner_id: number;
  ratings: { user_id: number; value: number }[];
  stock?: number;
  lowStockThreshold?: number;
  image?: string;
  category?: string;
  description?: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Stylo Bleu',
    price: 2.5,
    created_at: '2025-01-10T10:00:00Z',
    owner_id: 10,
    ratings: [{ user_id: 2, value: 4 }],
    stock: 150,
    lowStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=400&fit=crop',
    category: 'Écriture',
    description: 'Stylo à bille bleu de haute qualité, encre fluide et longue durée. Parfait pour l\'écriture quotidienne.'
  },
  {
    id: 2,
    name: 'Cahier A5',
    price: 3.9,
    created_at: '2025-02-01T09:30:00Z',
    owner_id: 11,
    ratings: [{ user_id: 3, value: 5 }],
    stock: 85,
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400&h=400&fit=crop',
    category: 'Papeterie',
    description: 'Cahier spirale A5, 100 pages lignées. Couverture cartonnée résistante, idéal pour les notes et croquis.'
  },
  {
    id: 3,
    name: 'Classeur Rouge',
    price: 4.5,
    created_at: '2025-02-12T12:00:00Z',
    owner_id: 12,
    ratings: [{ user_id: 4, value: 3 }],
    stock: 60,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop',
    category: 'Classement',
    description: 'Classeur 4 anneaux format A4, dos 40mm. Finition mate, mécanisme robuste pour un rangement optimal.'
  },
  {
    id: 4,
    name: 'Crayon HB',
    price: 1.2,
    created_at: '2025-03-01T08:45:00Z',
    owner_id: 13,
    ratings: [{ user_id: 2, value: 5 }],
    stock: 200,
    lowStockThreshold: 30,
    image: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=400&fit=crop',
    category: 'Écriture',
    description: 'Crayon à papier HB avec gomme intégrée. Mine de qualité supérieure pour un trait précis et régulier.'
  },
  {
    id: 5,
    name: 'Règle 30cm',
    price: 1.5,
    created_at: '2025-03-05T07:20:00Z',
    owner_id: 14,
    ratings: [{ user_id: 1, value: 4 }],
    stock: 120,
    lowStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1611532736579-6b16e2b50449?w=400&h=400&fit=crop',
    category: 'Géométrie',
    description: 'Règle transparente en plastique rigide 30cm. Graduations précises en cm et mm des deux côtés.'
  },
  {
    id: 6,
    name: 'Gomme Blanche',
    price: 0.9,
    created_at: '2025-03-10T14:10:00Z',
    owner_id: 15,
    ratings: [{ user_id: 3, value: 4 }],
    stock: 300,
    lowStockThreshold: 50,
    image: 'https://images.unsplash.com/photo-1563657019283-9e2b61aa8c88?w=400&h=400&fit=crop',
    category: 'Correction',
    description: 'Gomme blanche sans latex, efface proprement sans abîmer le papier. Ne laisse pas de traces.'
  },
  {
    id: 7,
    name: 'Surligneur Jaune',
    price: 1.7,
    created_at: '2025-03-11T11:00:00Z',
    owner_id: 16,
    ratings: [{ user_id: 6, value: 5 }],
    stock: 180,
    lowStockThreshold: 25,
    image: 'https://images.unsplash.com/photo-1592806088932-05058af0ad8d?w=400&h=400&fit=crop',
    category: 'Écriture',
    description: 'Surligneur fluo jaune à encre liquide. Pointe biseautée 4mm, idéal pour surligner vos textes importants.'
  },
  {
    id: 8,
    name: 'Pochette Plastique',
    price: 0.3,
    created_at: '2025-03-12T09:00:00Z',
    owner_id: 17,
    ratings: [{ user_id: 3, value: 3 }],
    stock: 500,
    lowStockThreshold: 100,
    image: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=400&h=400&fit=crop',
    category: 'Classement',
    description: 'Pochette perforée transparente A4. Perforation 11 trous, ouverture par le haut, vendue à l\'unité.'
  },
  {
    id: 9,
    name: 'Feutre Noir',
    price: 2.0,
    created_at: '2025-03-15T10:30:00Z',
    owner_id: 18,
    ratings: [{ user_id: 5, value: 4 }],
    stock: 140,
    lowStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop',
    category: 'Écriture',
    description: 'Feutre à pointe fine 0.4mm, encre noire indélébile. Parfait pour l\'écriture précise et le dessin.'
  },
  {
    id: 10,
    name: 'Bloc Notes',
    price: 3.0,
    created_at: '2025-03-20T16:00:00Z',
    owner_id: 19,
    ratings: [{ user_id: 7, value: 5 }],
    stock: 95,
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=400&h=400&fit=crop',
    category: 'Papeterie',
    description: 'Bloc notes repositionnable 76x76mm, 100 feuilles. Adhésif de qualité, ne laisse pas de traces.'
  },
  {
    id: 11,
    name: 'Feuilles A4',
    price: 4.0,
    created_at: '2025-03-22T12:40:00Z',
    owner_id: 20,
    ratings: [{ user_id: 2, value: 4 }],
    stock: 250,
    lowStockThreshold: 40,
    image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop',
    category: 'Papeterie',
    description: 'Ramette 500 feuilles A4 80g/m². Papier blanc premium compatible imprimante laser et jet d\'encre.'
  },
  {
    id: 12,
    name: 'Trousse Bleue',
    price: 6.5,
    created_at: '2025-03-25T13:00:00Z',
    owner_id: 21,
    ratings: [{ user_id: 8, value: 5 }],
    stock: 70,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1584673251492-bd2ff27c2be1?w=400&h=400&fit=crop',
    category: 'Accessoires',
    description: 'Trousse en toile robuste avec fermeture éclair. 2 compartiments pour une organisation optimale.'
  },
  {
    id: 13,
    name: 'Colle Bâton',
    price: 1.3,
    created_at: '2025-04-01T07:00:00Z',
    owner_id: 10,
    ratings: [{ user_id: 9, value: 3 }],
    stock: 220,
    lowStockThreshold: 35,
    image: 'https://images.unsplash.com/photo-1591462774817-e8ba26f7dd30?w=400&h=400&fit=crop',
    category: 'Collage',
    description: 'Colle en bâton 21g, application propre et précise. Sèche rapidement, idéale pour le papier et le carton.'
  },
  {
    id: 14,
    name: 'Ruban Adhésif',
    price: 2.8,
    created_at: '2025-04-03T08:00:00Z',
    owner_id: 11,
    ratings: [{ user_id: 1, value: 4 }],
    stock: 160,
    lowStockThreshold: 25,
    image: 'https://images.unsplash.com/photo-1580870069867-74c57ee60d19?w=400&h=400&fit=crop',
    category: 'Collage',
    description: 'Ruban adhésif transparent 19mm x 33m avec dérouleur. Colle puissante, ne jaunit pas avec le temps.'
  },
  {
    id: 15,
    name: 'Stylo Rouge',
    price: 2.5,
    created_at: '2025-04-05T10:20:00Z',
    owner_id: 12,
    ratings: [{ user_id: 3, value: 5 }],
    stock: 135,
    lowStockThreshold: 20,
    image: 'https://images.unsplash.com/photo-1565024146808-e3f48621d779?w=400&h=400&fit=crop',
    category: 'Écriture',
    description: 'Stylo à bille rouge pour corrections et annotations. Encre fluide et résistante à l\'eau.'
  },
  {
    id: 16,
    name: 'Feutres Couleur (Pack x10)',
    price: 7.9,
    created_at: '2025-04-10T14:00:00Z',
    owner_id: 13,
    ratings: [{ user_id: 6, value: 4 }],
    stock: 55,
    lowStockThreshold: 10,
    image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=400&h=400&fit=crop',
    category: 'Dessin',
    description: 'Set de 10 feutres de couleurs vives. Pointe moyenne 2mm, idéal pour le coloriage et les travaux créatifs.'
  },
  {
    id: 17,
    name: 'Pinceau Fin',
    price: 2.2,
    created_at: '2025-04-12T12:30:00Z',
    owner_id: 14,
    ratings: [{ user_id: 5, value: 3 }],
    stock: 90,
    lowStockThreshold: 15,
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop',
    category: 'Dessin',
    description: 'Pinceau synthétique pointe fine n°2. Manche en bois, idéal pour l\'aquarelle et la peinture acrylique.'
  },
  {
    id: 18,
    name: 'Palette Aquarelle',
    price: 9.5,
    created_at: '2025-04-15T11:10:00Z',
    owner_id: 15,
    ratings: [{ user_id: 8, value: 5 }],
    stock: 40,
    lowStockThreshold: 8,
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    category: 'Dessin',
    description: 'Palette aquarelle 12 couleurs avec pinceau inclus. Pigments de qualité, couleurs vives et miscibles.'
  },
  {
    id: 19,
    name: 'Marqueur Effaçable',
    price: 3.4,
    created_at: '2025-04-18T09:40:00Z',
    owner_id: 16,
    ratings: [{ user_id: 2, value: 4 }],
    stock: 110,
    lowStockThreshold: 18,
    image: 'https://images.unsplash.com/photo-1592806088932-05058af0ad8d?w=400&h=400&fit=crop',
    category: 'Écriture',
    description: 'Marqueur pour tableau blanc, encre effaçable à sec. Pointe biseautée 3mm, 4 couleurs disponibles.'
  },
  {
    id: 20,
    name: 'Tampon Encreur',
    price: 5.0,
    created_at: '2025-04-20T15:00:00Z',
    owner_id: 17,
    ratings: [{ user_id: 9, value: 4 }],
    stock: 65,
    lowStockThreshold: 12,
    image: 'https://images.unsplash.com/photo-1561835491-ed2567d96913?w=400&h=400&fit=crop',
    category: 'Accessoires',
    description: 'Tampon encreur automatique 38x14mm. Encre bleue rechargeable, jusqu\'à 10 000 impressions.'
  },
];
