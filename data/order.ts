/**
 * Options du configurateur « Gâteaux sur mesure ».
 * Les inspirations ne montrent que des créations réellement photographiées
 * à la boulangerie.
 */
import type { ImageKey } from "./images";

export const occasions = [
  { id: "anniversaire", label: "Anniversaire", hint: "Un âge, un prénom, une surprise" },
  { id: "mariage", label: "Mariage", hint: "Pièce à partager, dessert de réception" },
  { id: "bapteme", label: "Baptême", hint: "Douceur et teintes tendres" },
  { id: "famille", label: "Fête de famille", hint: "Communion, retrouvailles, fêtes" },
  { id: "entreprise", label: "Événement professionnel", hint: "Pot de départ, séminaire, lancement" },
  { id: "autre", label: "Autre occasion", hint: "Racontez-nous" },
] as const;

export type OccasionId = (typeof occasions)[number]["id"];

export const inspirations: {
  id: string;
  label: string;
  description: string;
  image: ImageKey | null;
  defaultType: string;
}[] = [
  {
    id: "number-cake",
    label: "Number cake",
    description: "Chiffres ou lettres garnis de crème, fleurs et macarons",
    image: "numberCake",
    defaultType: "Number cake",
  },
  {
    id: "grand-fraisier",
    label: "Gâteau aux fruits",
    description: "Fraisier rectangulaire couronné de fruits frais",
    image: "fraisierDetail",
    defaultType: "Fraisier aux fruits",
  },
  {
    id: "assortiment",
    label: "Pâtisseries individuelles",
    description: "Un assortiment pour un buffet ou une réception",
    image: "vitrinePatisseries",
    defaultType: "Assortiment de pâtisseries individuelles",
  },
  {
    id: "idee-personnalisee",
    label: "J'ai une idée personnalisée",
    description: "Décrivez-nous votre gâteau rêvé",
    image: null,
    defaultType: "",
  },
];
