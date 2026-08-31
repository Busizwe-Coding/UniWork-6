import { SushiItem } from '../types';

export const seasonalSpecials: SushiItem[] = [
  {
    id: 'red-dragon-signature',
    name: 'Red Dragon Signature',
    japaneseName: 'レッドドラゴン',
    description: 'Fresh spicy tuna, avocado, cucumber, topped with seared red tuna slices, micro-greens, and artisanal spicy eel drizzle on a black slate platter.',
    price: 24.00,
    category: 'rolls',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjb8JDtnyqoITapwuGNqGr4K4Q4kPiG7uN6L113EE1r0TyK95ilcjdUORZG4fsMqv5aahwz1srlkYRQtT79fbcZ-5f1jwFOKl6tLvOpUMAIvKFGiLMQctQP3FT1PIpfthA9NOu1Lw9LPjj8bSEhcp6vXMVku5YlwgjMV-gXnAMc7P8guQ1oUWc-5_anM_MhYbYbXh7Nc-_AiCF39_svnUid4AK5uRvmfdaPL5MEYkwRQNYQCPBQ2jKTgPnTsNY45r33Bb7J1KQcxCf',
    isChefSpecial: true,
    collection: 'PRESTIGE COLLECTION',
    calories: 480,
    pieces: '8 Pcs',
    spicy: true,
    popular: true,
    tags: ['Chef Favorite', 'Signature', 'Spicy']
  },
  {
    id: 'tsukiji-sashimi',
    name: 'Tsukiji Sashimi',
    japaneseName: '築地刺身盛り',
    description: 'Direct from Tokyo’s morning market, hand-selected fatty tuna (Otoro) and premium wild salmon arranged with fresh wasabi and shiso.',
    price: 18.00,
    category: 'sashimi',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDwMShgvQD95bBeu0Sn4TPpYYOhne3ROjLgf3vVU_YfAtz28RKKs38XnT_ZWwyFl1s-Zdw18fRFR4LSUPjqgl3e-TEls7Z3BWQKAtFNNz3l-EbRVqYh9EKEgIwTIQLpxF9bl0NumZUgd-eJljUha6Op4BWV8jzxFnhFHWEkXe8SGB6SmKNErONUbxiQOyCuwjOgr8z5u5ymGxMS3SAPgmmEGPHGAJrtIaOWyAtA6vdIAOTNtxvXuV1l-4mo9kZA_ZHAQZw4cvOwd9a',
    calories: 220,
    pieces: '5 Pcs',
    popular: true,
    glutenFree: true,
    tags: ['Fresh Import', 'Gluten Free', 'Zero Carb']
  },
  {
    id: 'truffle-wagyu',
    name: 'Truffle Wagyu Nigiri',
    japaneseName: 'トリュフ和牛',
    description: 'A5 Miyazaki Wagyu beef lightly torched with culinary torch, finished with a sliver of fresh Italian black truffle and smoked sea salt.',
    price: 12.00,
    category: 'nigiri',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAz1U-fSNMSKb4JemqEqJdCq5sI5F3jMG0vHyHAaibf23QKD0FB2tJlKZ8k4191ZgKXEcqux7eElewAa0uJJR_yU1sInztUzhnA98tBntmKavzeD8_hBmJ2AS5CBu7s_UKGZMeNzgI2yvr9dE7ghe_4CJzteYu9uGKpm4ropspbkQO7euM3u1zODiKM6HKEVIFEB5gHjSirmmoW1VQalX9g6MjWYDsWPHo5eI8dKuchFMHPi5VxmHXAluJtyIgkizhN-JsFhTx01UWs',
    calories: 180,
    pieces: '1 Pc',
    tags: ['A5 Wagyu', 'Black Truffle']
  },
  {
    id: 'matcha-mochi',
    name: 'Matcha Mochi',
    japaneseName: '抹茶モチ',
    description: 'Artisanal Uji matcha green tea ice cream wrapped in soft sweet rice dough, dusted with organic ceremonial matcha powder.',
    price: 9.00,
    category: 'desserts',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKcQSY8S9mluYr3Mn_TKkklj5fmEdLwtPpzHU-nhuP1X192Gu5N8hM1PFza3dj78Ir824NoCq_xz_5nXinxasCLnoQDcp7CFP8TJth8vaii8S6YgvSt7VfTBTgXnIEzupkFpixos9H3Rtv3e39vuoM_KCd7apuw9xLI8YwaoBegJ0wr8QbG1wjAwn3Yev9LhoRg-5hdR6hWt8-idFVToG_fXV1Qna5vrqk0RTXzZ0oUQGuTIjc-zDfFamvxgzPx0RrMJItlg6EDgex',
    calories: 210,
    pieces: '3 Pcs',
    tags: ['Organic Matcha', 'Sweet Finish']
  }
];

export const fullMenu: SushiItem[] = [
  ...seasonalSpecials,
  {
    id: 'ginza-rainbow-roll',
    name: 'Ginza Rainbow Roll',
    japaneseName: '銀座レインボー',
    description: 'Crab salad and cucumber wrapped inside, layered on top with fresh yellowtail, salmon, tuna, and avocado.',
    price: 21.50,
    category: 'rolls',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&q=80&w=800',
    calories: 420,
    pieces: '8 Pcs',
    tags: ['Classic Favorite', 'Fresh Seafood']
  },
  {
    id: 'hamachi-ponzu-sashimi',
    name: 'Hamachi Jalapeño Sashimi',
    japaneseName: 'ハマチポン酢',
    description: 'Thinly sliced yellowtail amberjack topped with serrano jalapeño peppers, cilantro, and yuzu ponzu dressing.',
    price: 19.50,
    category: 'sashimi',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800',
    calories: 210,
    pieces: '6 Pcs',
    spicy: true,
    glutenFree: true,
    tags: ['Spicy Refresh', 'Yuzu Infused']
  },
  {
    id: 'uni-caviar-nigiri',
    name: 'Hokkaido Uni & Caviar Nigiri',
    japaneseName: '雲丹キャビア',
    description: 'Sea urchin from Hokkaido paired with Royal Osetra caviar and gold leaf on seasoned sushi rice.',
    price: 26.00,
    category: 'nigiri',
    image: 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&q=80&w=800',
    isChefSpecial: true,
    calories: 140,
    pieces: '2 Pcs',
    tags: ['Luxury Selection', 'Hokkaido Import']
  },
  {
    id: 'edamame-truffle-salt',
    name: 'Charred Edamame with Truffle Oil',
    japaneseName: '枝豆トリュフ',
    description: 'Wok-charred young soybean pods tossed in black truffle salt and toasted sesame oil.',
    price: 8.50,
    category: 'starters',
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&q=80&w=800',
    calories: 160,
    glutenFree: true,
    tags: ['Vegan', 'Warm Starter']
  },
  {
    id: 'kyoto-junmai-ginjo',
    name: 'Kyoto Dassai 23 Junmai Daiginjo',
    japaneseName: '獺祭磨き二割三分',
    description: 'Ultra-premium sake milled down to 23%. Delicate aromas of peach and melon with an ethereal silky finish.',
    price: 32.00,
    category: 'beverages',
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=800',
    calories: 130,
    tags: ['Premium Sake', '300ml Bottle']
  }
];
