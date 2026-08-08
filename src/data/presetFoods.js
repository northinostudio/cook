// Built-in cook times so you don't have to guess or Google mid-cook.
// Defaults follow conventional home-kitchen timing (standard stovetop heat,
// average cut/portion sizes — see the per-item notes for the assumption).
// Every one of these is just a starting point: click a food in the app,
// edit the minutes/seconds, and hit "Save as default" to make it stick.

export const CATEGORIES = ['Eggs', 'Grains', 'Vegetables', 'Meat & Fish', 'Other'];

export const PRESET_FOODS = [
  // Eggs — size adjustable
  {
    id: 'egg-soft',
    name: 'Boiled Egg — Soft',
    category: 'Eggs',
    seconds: 6 * 60,
    note: 'Jammy/runny yolk, from a boil',
    adjust: 'eggSize',
  },
  {
    id: 'egg-medium',
    name: 'Boiled Egg — Medium',
    category: 'Eggs',
    seconds: 8 * 60,
    note: 'Set white, soft-set yolk',
    adjust: 'eggSize',
  },
  {
    id: 'egg-hard',
    name: 'Boiled Egg — Hard',
    category: 'Eggs',
    seconds: 11 * 60,
    note: 'Fully set yolk',
    adjust: 'eggSize',
  },
  {
    id: 'egg-poached',
    name: 'Poached Egg',
    category: 'Eggs',
    seconds: 3 * 60,
    note: 'Simmering water, soft yolk',
  },

  // Grains — servings adjustable where it matters
  { id: 'rice-white', name: 'White Rice', category: 'Grains', seconds: 18 * 60, adjust: 'servings' },
  { id: 'rice-brown', name: 'Brown Rice', category: 'Grains', seconds: 45 * 60, adjust: 'servings' },
  { id: 'pasta', name: 'Pasta (al dente)', category: 'Grains', seconds: 10 * 60, adjust: 'servings' },
  { id: 'noodles-instant', name: 'Instant Noodles', category: 'Grains', seconds: 3 * 60 },
  { id: 'quinoa', name: 'Quinoa', category: 'Grains', seconds: 15 * 60, adjust: 'servings' },
  { id: 'lentils-red', name: 'Red Lentils', category: 'Grains', seconds: 15 * 60, adjust: 'servings', note: 'Simmer until soft — they cook faster than other lentils' },
  { id: 'couscous', name: 'Couscous (off heat, covered)', category: 'Grains', seconds: 5 * 60 },
  { id: 'oatmeal', name: 'Oatmeal', category: 'Grains', seconds: 5 * 60 },

  // Vegetables
  { id: 'potato-boiled-chunks', name: 'Boiled Potato (chunks)', category: 'Vegetables', seconds: 15 * 60, note: '2-3cm pieces, from a boil' },
  { id: 'potato-boiled-whole', name: 'Boiled Potato (whole)', category: 'Vegetables', seconds: 25 * 60, note: 'Medium potato, from a boil' },
  { id: 'potato-fried', name: 'Fried Potato / Chips', category: 'Vegetables', seconds: 10 * 60, note: 'Raw-cut, pan or deep-fried — turn halfway' },
  { id: 'veg-steamed', name: 'Steamed Vegetables (mixed)', category: 'Vegetables', seconds: 7 * 60 },
  { id: 'broccoli-steamed', name: 'Steamed Broccoli', category: 'Vegetables', seconds: 5 * 60 },
  { id: 'carrots-boiled', name: 'Boiled Carrots', category: 'Vegetables', seconds: 10 * 60, note: 'Sliced' },
  { id: 'corn-boiled', name: 'Corn on the Cob', category: 'Vegetables', seconds: 8 * 60, note: 'From when water returns to a boil' },
  { id: 'green-beans', name: 'Steamed Green Beans', category: 'Vegetables', seconds: 5 * 60 },
  { id: 'asparagus', name: 'Sautéed Asparagus', category: 'Vegetables', seconds: 5 * 60, note: 'Medium-high heat, turning occasionally' },

  // Meat & fish
  { id: 'chicken-breast-boiled', name: 'Boiled Chicken Breast', category: 'Meat & Fish', seconds: 15 * 60, note: 'Boneless, ~170g, gentle simmer' },
  { id: 'chicken-breast-pan', name: 'Pan-Fried Chicken Breast', category: 'Meat & Fish', seconds: 14 * 60, note: '~7 min per side, medium heat' },
  { id: 'chicken-thighs-pan', name: 'Pan-Fried Chicken Thighs', category: 'Meat & Fish', seconds: 14 * 60, note: 'Boneless, skinless, ~7 min per side' },
  { id: 'steak-medium', name: 'Steak (medium, pan)', category: 'Meat & Fish', seconds: 8 * 60, note: '~2.5cm thick, ~4 min per side + rest' },
  { id: 'bacon-pan', name: 'Bacon (pan)', category: 'Meat & Fish', seconds: 7 * 60, note: 'Medium heat, flipping occasionally' },
  { id: 'salmon-pan', name: 'Pan-Seared Salmon', category: 'Meat & Fish', seconds: 8 * 60, note: 'Skin-on fillet, ~4 min skin-side down' },
  { id: 'ground-beef', name: 'Ground Beef (browning)', category: 'Meat & Fish', seconds: 8 * 60, note: '~500g, medium-high, breaking apart' },
  { id: 'shrimp-pan', name: 'Shrimp (pan)', category: 'Meat & Fish', seconds: 4 * 60, note: 'Medium-large, ~2 min per side' },

  // Other
  { id: 'soup-reheat', name: 'Soup (reheat, simmer)', category: 'Other', seconds: 5 * 60 },
  { id: 'toast', name: 'Toast', category: 'Other', seconds: 3 * 60 },
  { id: 'tea-steep', name: 'Tea Steep', category: 'Other', seconds: 4 * 60 },
];

// Deltas applied on top of a base egg time, in seconds.
export const EGG_SIZE_ADJUST = [
  { id: 'small', label: 'Small', deltaSeconds: -60 },
  { id: 'medium', label: 'Medium', deltaSeconds: 0 },
  { id: 'large', label: 'Large', deltaSeconds: 60 },
  { id: 'xl', label: 'X-Large', deltaSeconds: 120 },
];

// Mild, diminishing-returns scaling for batch cooking (rice/pasta/grains).
// Boil/absorption time doesn't scale linearly with quantity, so each extra
// serving only adds a fraction of the base time, capped.
export function servingsSeconds(baseSeconds, servings) {
  const extra = Math.min(servings - 1, 5) * 0.12 * baseSeconds;
  return Math.round(baseSeconds + extra);
}