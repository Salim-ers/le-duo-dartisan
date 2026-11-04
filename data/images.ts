/**
 * Registre des photographies du site.
 * - source "client" : photos fournies par la boulangerie (les produits vendus).
 * - source "stock" : photos d'ambiance libres de droit (CC0), jamais présentées
 *   comme des produits de la boutique. Leurs crédits s'affichent dans les mentions légales.
 * Pour remplacer une photo : déposer le nouveau fichier dans public/images/
 * au même chemin, ou modifier l'import ci-dessous.
 *
 * Les imports statiques donnent à next/image les dimensions et un flou
 * de chargement automatique (pas de décalage de mise en page).
 */
import type { StaticImageData } from "next/image";

import facade from "@/public/images/maison/facade.webp";
import baguettesAlignees from "@/public/images/pains/baguettes-alignees.webp";
import baguettesCroisees from "@/public/images/pains/baguettes-croisees.webp";
import fraisier from "@/public/images/gateaux/fraisier-fruits.webp";
import numberCake from "@/public/images/gateaux/number-cake.webp";
import painsChocolat from "@/public/images/viennoiseries/pains-au-chocolat.webp";
import cookies from "@/public/images/gourmandises/cookies-garnis.webp";
import macaronsFramboise from "@/public/images/gourmandises/macarons-framboise.webp";
import salades from "@/public/images/snacking/salades.webp";
import sandwichs from "@/public/images/snacking/sandwichs.webp";
import flansIndividuels from "@/public/images/patisseries/flans-individuels.webp";
import entremetsFruits from "@/public/images/patisseries/entremets-fruits.webp";
import petrissage from "@/public/images/fabrication/petrissage.webp";
import vitrineFlans from "@/public/images/vitrine/vitrine-flans-macarons.webp";
import vitrineTartes from "@/public/images/vitrine/vitrine-tartes.webp";
import vitrineEclairs from "@/public/images/vitrine/vitrine-eclairs.webp";
import vitrinePatisseries from "@/public/images/vitrine/vitrine-patisseries.webp";
import dReligieuses from "@/public/images/details/religieuses.webp";
import dEclairsChocolat from "@/public/images/details/eclairs-chocolat.webp";
import dTartelettesMeringuees from "@/public/images/details/tartelettes-meringuees.webp";
import dEntremetsCitron from "@/public/images/details/entremets-citron.webp";
import dFlanCoco from "@/public/images/details/flan-coco.webp";
import dEclairsPistache from "@/public/images/details/eclairs-pistache.webp";
import dTartelettesFruitsRouges from "@/public/images/details/tartelettes-fruits-rouges.webp";
import champDeBle from "@/public/images/ambiance/champ-de-ble.webp";
import episDeBle from "@/public/images/ambiance/epis-de-ble.webp";
import patonsFarine from "@/public/images/ambiance/patons-farine.webp";
import croissants from "@/public/images/ambiance/croissants.webp";

export type SiteImage = {
  src: StaticImageData;
  alt: string;
  /** Point focal pour object-position (recadrages mobile / desktop). */
  focus?: string;
  source: "client" | "stock";
  /** Auteur et page d'origine, pour les photos libres de droit. */
  credit?: { author: string; url: string };
};

const client = (src: StaticImageData, alt: string, focus?: string): SiteImage => ({
  src,
  alt,
  focus,
  source: "client",
});

const stock = (src: StaticImageData, alt: string, author: string, url: string, focus?: string): SiteImage => ({
  src,
  alt,
  focus,
  source: "stock",
  credit: { author, url },
});

export const images = {
  facade: client(
    facade,
    "Façade bleue de la boulangerie Le Duo d'Artisans, enseigne manuscrite blanche, rue Anatole France à Rantigny",
    "50% 40%",
  ),
  baguettesAlignees: client(
    baguettesAlignees,
    "Baguettes dorées aux grignes marquées, alignées sur un plan de travail clair",
  ),
  baguettesCroisees: client(
    baguettesCroisees,
    "Deux baguettes croustillantes croisées, croûte farinée et mie alvéolée",
    "55% 50%",
  ),
  fraisier: client(
    fraisier,
    "Grand fraisier rectangulaire bordé de fraises, garni de fruits frais et de feuilles en chocolat",
  ),
  numberCake: client(
    numberCake,
    "Number cake « 30 » garni de crème, de roses, de macarons, de framboises et de cœurs roses",
  ),
  painsChocolat: client(
    painsChocolat,
    "Pains au chocolat dorés au feuilletage apparent",
    "50% 60%",
  ),
  cookies: client(
    cookies,
    "Cookies épais garnis de chocolat, de caramel, de fruits rouges et de crème pistache sur un plateau en bois",
  ),
  macaronsFramboise: client(
    macaronsFramboise,
    "Grands macarons roses et verts garnis de framboises fraîches",
  ),
  salades: client(
    salades,
    "Salades composées en bol : pâtes, semoule et pois chiches, saumon et crevettes, poulet et crudités",
  ),
  sandwichs: client(
    sandwichs,
    "Sandwichs baguette aux graines garnis de poulet pané, tomate, salade et concombre",
  ),
  flansIndividuels: client(
    flansIndividuels,
    "Flans pâtissiers individuels dorés, nappés de chocolat ou de pistache concassée",
  ),
  entremetsFruits: client(
    entremetsFruits,
    "Pâtisseries individuelles en trompe-l'œil, en forme de citron et de framboise",
  ),
  petrissage: client(
    petrissage,
    "Pâte lisse et brillante en cours de pétrissage dans la cuve d'un batteur",
  ),
  vitrineFlans: client(
    vitrineFlans,
    "Vitrine de la boutique : flans entiers, coffrets de macarons, tartelettes, religieuses et éclairs",
    "50% 60%",
  ),
  vitrineTartes: client(
    vitrineTartes,
    "Vitrine de la boutique : tartes aux fruits, meringues et pâtisseries individuelles",
  ),
  vitrineEclairs: client(
    vitrineEclairs,
    "Vitrine de la boutique : éclairs, tartelettes aux fraises, choux et flans",
  ),
  vitrinePatisseries: client(
    vitrinePatisseries,
    "Vitrine de pâtisseries colorées : macarons, tartelettes citron meringuées, éclairs et entremets",
    "45% 60%",
  ),
  // Détails recadrés dans les vitrines (résolution limitée : affichage en petit format)
  detailReligieuses: client(dReligieuses, "Religieuses en vitrine"),
  detailEclairsChocolat: client(dEclairsChocolat, "Éclairs enrobés de chocolat en vitrine"),
  detailTartelettesMeringuees: client(
    dTartelettesMeringuees,
    "Tartelettes meringuées et éclairs en vitrine",
  ),
  detailEntremetsCitron: client(dEntremetsCitron, "Parts d'entremets au glaçage jaune et framboise"),
  detailFlanCoco: client(dFlanCoco, "Grand flan coco découpé en parts"),
  detailEclairsPistache: client(dEclairsPistache, "Éclairs au glaçage jaune et pistache"),
  detailTartelettesFruitsRouges: client(
    dTartelettesFruitsRouges,
    "Tartelettes aux fraises et framboises, crème fouettée",
  ),
  // Photographies d'ambiance libres de droit (CC0, WordPress Photo Directory)
  champDeBle: stock(
    champDeBle,
    "Champ de blé doré ondulant sous un grand soleil",
    "Chuck Grimmett",
    "https://wordpress.org/photos/photo/27461ffbf8/",
    "50% 70%",
  ),
  episDeBle: stock(
    episDeBle,
    "Épis de blé mûrs en gros plan sur fond de ciel bleu",
    "Jennifer Bourn",
    "https://wordpress.org/photos/photo/343637b078/",
  ),
  patonsFarine: stock(
    patonsFarine,
    "Pâtons ronds alignés sur un plan de travail fariné, à côté d'un rouleau à pâtisserie",
    "Tawhid Sadman",
    "https://wordpress.org/photos/photo/99169d2662/",
  ),
  croissants: stock(
    croissants,
    "Croissants et viennoiseries dorés au feuilletage bien marqué",
    "Reyes Martínez",
    "https://wordpress.org/photos/photo/210622cf27/",
  ),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
