/**
 * CATALOGUE — Nos créations
 * ------------------------------------------------------------------
 * Seuls les produits réellement visibles sur les photographies fournies
 * sont listés. Les noms et descriptions décrivent ce que montre la photo :
 * ils sont à faire valider par la boulangerie (champ `toConfirm`).
 *
 * - price : laisser `null` tant qu'un tarif n'est pas confirmé (aucun faux prix).
 * - allergens : renseigner UNIQUEMENT des allergènes confirmés par la boulangerie.
 * - customizable : affiche le bouton « Demander cette création ».
 *
 * Les gâteaux sur mesure ne sont pas ici : ils ont leur propre page (data/order.ts).
 */
import { images, type ImageKey } from "./images";

export type CategoryId =
  | "pains"
  | "viennoiseries"
  | "patisseries"
  | "gourmandises"
  | "snacking";

export const categories: { id: CategoryId; label: string; short: string }[] = [
  { id: "pains", label: "Pains", short: "Pains" },
  { id: "viennoiseries", label: "Viennoiseries", short: "Viennoiseries" },
  { id: "patisseries", label: "Pâtisseries individuelles", short: "Pâtisseries" },
  { id: "gourmandises", label: "Macarons & gourmandises", short: "Gourmandises" },
  { id: "snacking", label: "Snacking & salades", short: "Snacking" },
];

export type Product = {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  image: ImageKey;
  /** Prix affiché tel quel, ex. "4,50 €" — null = non communiqué. */
  price: string | null;
  /** Ex. "Sur commande", "Le week-end" — null = non précisé. */
  availability: string | null;
  /** Allergènes confirmés uniquement. Vide = non communiqués. */
  allergens: string[];
  customizable: boolean;
  /** Nom / description à faire valider par la boulangerie. */
  toConfirm: boolean;
};

export const products: Product[] = [
  {
    id: "baguette",
    name: "La baguette",
    category: "pains",
    description: "Croûte dorée et grignes bien ouvertes : le pain de tous les jours, croustillant à souhait.",
    image: "baguettesAlignees",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "baguette-caractere",
    name: "La baguette de caractère",
    category: "pains",
    description: "Une croûte rustique et farinée, une mie généreusement alvéolée.",
    image: "baguettesCroisees",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "pain-au-chocolat",
    name: "Le pain au chocolat",
    category: "viennoiseries",
    description: "Un feuilletage doré aux couches bien dessinées, et le chocolat au cœur.",
    image: "painsChocolat",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "entremets-trompe-loeil",
    name: "Les fruits en trompe-l'œil",
    category: "patisseries",
    description: "Des pâtisseries individuelles façonnées en citron et en framboise, au fini velours.",
    image: "entremetsFruits",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "flans-individuels",
    name: "Les flans individuels",
    category: "patisseries",
    description: "Une pâte croustillante, un appareil doré et un nappage chocolat ou pistache concassée.",
    image: "flansIndividuels",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "macarons-framboise",
    name: "Les grands macarons aux framboises",
    category: "gourmandises",
    description: "Deux coques généreuses et une couronne de framboises fraîches, en rose ou en vert.",
    image: "macaronsFramboise",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "cookies-garnis",
    name: "Les cookies garnis",
    category: "gourmandises",
    description: "Épais et moelleux, coiffés de chocolat, de caramel, de fruits rouges ou de crème pistache.",
    image: "cookies",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "sandwichs",
    name: "Les sandwichs baguette",
    category: "snacking",
    description: "Un pain aux graines, du poulet pané, des crudités et une sauce onctueuse.",
    image: "sandwichs",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
  {
    id: "salades",
    name: "Les salades composées",
    category: "snacking",
    description:
      "Pâtes, semoule et pois chiches, saumon et crevettes ou poulet : des bols frais, sauce servie à part.",
    image: "salades",
    price: null,
    availability: null,
    allergens: [],
    customizable: false,
    toConfirm: true,
  },
];

export function productImage(p: Product) {
  return images[p.image];
}

export function isCategory(v: string | null | undefined): v is CategoryId {
  return !!v && categories.some((c) => c.id === v);
}
