/**
 * Registre des photographies du site.
 *
 * Règle : chaque photo n'apparaît qu'à UN seul endroit du site, sans photos qui se ressemblent.
 * - source "client" : photos fournies par la boulangerie (les produits vendus) :
 *   catalogue, inspirations du formulaire, « Nous trouver », vitrine de « Notre maison »
 *   et fraisier de l'accueil.
 * - source "stock" : photos libres de droit (licence Unsplash). Leurs crédits
 *   s'affichent dans les mentions légales. Celles qui montrent un produit portent
 *   la mention « Photo d'illustration ».
 *
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
import fraisierDetail from "@/public/images/gateaux/fraisier-detail.webp";
import assortimentDetail from "@/public/images/gateaux/assortiment-detail.webp";
import numberCake from "@/public/images/gateaux/number-cake.webp";
import painsChocolat from "@/public/images/viennoiseries/pains-au-chocolat.webp";
import cookies from "@/public/images/gourmandises/cookies-garnis.webp";
import macaronsFramboise from "@/public/images/gourmandises/macarons-framboise.webp";
import salades from "@/public/images/snacking/salades.webp";
import sandwichs from "@/public/images/snacking/sandwichs.webp";
import flansIndividuels from "@/public/images/patisseries/flans-individuels.webp";
import entremetsFruits from "@/public/images/patisseries/entremets-fruits.webp";
import vitrinePatisseries from "@/public/images/vitrine/vitrine-patisseries.webp";
import farineSurPain from "@/public/images/ambiance/farine-sur-pain.webp";
import baguetteFondNoir from "@/public/images/ambiance/baguette-fond-noir.webp";
import croissantsFondNoir from "@/public/images/ambiance/croissants-fond-noir.webp";
import tarteletteFramboises from "@/public/images/ambiance/tartelette-framboises.webp";
import sandwichBaguette from "@/public/images/ambiance/sandwich-baguette.webp";
import champDeBleCouchant from "@/public/images/ambiance/champ-de-ble-couchant.webp";
import gateauFleursBlanches from "@/public/images/ambiance/gateau-fleurs-blanches.webp";
import petrissageMains from "@/public/images/ambiance/petrissage-mains.webp";
import painsDeSeigle from "@/public/images/ambiance/pains-de-seigle.webp";
import pateFarineFondNoir from "@/public/images/ambiance/pate-farine-fond-noir.webp";
import dressageFraises from "@/public/images/ambiance/dressage-fraises.webp";

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

const stock = (src: StaticImageData, alt: string, author: string, id: string, focus?: string): SiteImage => ({
  src,
  alt,
  focus,
  source: "stock",
  credit: { author, url: `https://unsplash.com/photos/${id}` },
});

export const images = {
  // Nous trouver
  facade: client(
    facade,
    "Façade bleue de la boulangerie Le Duo d'Artisans, enseigne manuscrite blanche, rue Anatole France à Rantigny",
    "50% 40%",
  ),

  // Nos créations
  baguettesAlignees: client(
    baguettesAlignees,
    "Baguettes dorées aux grignes marquées, alignées sur un plan de travail clair",
  ),
  baguettesCroisees: client(
    baguettesCroisees,
    "Deux baguettes croustillantes croisées, croûte farinée et mie alvéolée",
    "55% 50%",
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

  // Gâteaux sur mesure : inspirations du formulaire
  fraisierDetail: client(
    fraisierDetail,
    "Gros plan sur un fraisier garni de fraises, de kiwis, de mûres et de feuilles en chocolat",
  ),
  numberCake: client(
    numberCake,
    "Number cake « 30 » garni de crème, de roses, de macarons, de framboises et de cœurs roses",
  ),
  assortimentDetail: client(
    assortimentDetail,
    "Assortiment de pâtisseries individuelles en vitrine : éclairs, tartelettes aux framboises, paris-brest et choux",
  ),

  // Accueil
  fraisier: client(
    fraisier,
    "Grand fraisier rectangulaire bordé de fraises, garni de fruits frais et de feuilles en chocolat",
  ),
  farineSurPain: stock(
    farineSurPain,
    "Mains saupoudrant un nuage de farine au-dessus d'un pain rustique, sur fond noir",
    "Tetiana Padurets",
    "I5G_suhoqBQ",
    "50% 40%",
  ),
  baguetteFondNoir: stock(
    baguetteFondNoir,
    "Baguette dorée et farinée sur un plan de travail noir",
    "Ilham Putra",
    "dY8F7ZlZvYU",
  ),
  croissantsFondNoir: stock(
    croissantsFondNoir,
    "Croissants dorés saupoudrés de sucre glace, sur fond sombre",
    "Mae Mu",
    "m9pzwmxm2rk",
  ),
  tarteletteFramboises: stock(
    tarteletteFramboises,
    "Tartelette aux framboises fraîches sur un plateau de bois, fond sombre",
    "Jordane Mathieu",
    "83sgp9jxW8k",
  ),
  sandwichBaguette: stock(
    sandwichBaguette,
    "Sandwich baguette au jambon et au fromage en gros plan",
    "petradr",
    "eQqY_KQOqEE",
  ),
  champDeBleCouchant: stock(
    champDeBleCouchant,
    "Champ de blé doré au soleil couchant, sous un ciel orangé",
    "heino eisner",
    "y6dUxc66kAs",
    "50% 62%",
  ),

  // Gâteaux sur mesure : en-tête
  gateauFleursBlanches: stock(
    gateauFleursBlanches,
    "Grand gâteau blanc à étages orné de roses blanches et de feuillage",
    "Denio Rodríguez",
    "HBETvpRcRgA",
    "50% 45%",
  ),

  // Notre maison
  vitrinePatisseries: client(
    vitrinePatisseries,
    "Vitrine de la boutique : macarons, tartelettes citron meringuées, éclairs, flans et entremets",
    "45% 60%",
  ),
  petrissageMains: stock(
    petrissageMains,
    "Mains pétrissant une pâte sur un plan de travail en bois fariné",
    "DDP",
    "5CRzqqWzEKQ",
  ),
  painsDeSeigle: stock(
    painsDeSeigle,
    "Pains au levain à la croûte craquelée, l'un d'eux coupé en deux",
    "DDP",
    "QnQSxrXFgnw",
  ),
  pateFarineFondNoir: stock(
    pateFarineFondNoir,
    "Boule de pâte entourée de farine dispersée, vue du dessus sur fond noir",
    "Patrick Fore",
    "m9qWesqRN0M",
    "82% 50%",
  ),
  dressageFraises: stock(
    dressageFraises,
    "Mains gantées déposant des fraises et des myrtilles sur des pâtisseries alignées",
    "Toa Heftiba",
    "xNV90NpObDQ",
    "60% 50%",
  ),
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
