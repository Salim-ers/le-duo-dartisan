import { z } from "zod";
import { occasions } from "@/data/order";
import { pickupDateStatus } from "@/lib/dates";
import { siteConfig } from "@/lib/site.config";

const { guests, messageMaxLength } = siteConfig.order;
const occasionIds = occasions.map((o) => o.id) as [string, ...string[]];

const DATE_ERRORS: Record<string, string> = {
  "too-soon": `Merci de prévoir au moins ${siteConfig.order.minLeadDays} jours de délai.`,
  "too-far": "Cette date est trop lointaine pour être réservée en ligne : appelez-nous.",
  closed: "La boutique est fermée ce jour-là.",
  exceptional: "La boutique est exceptionnellement fermée à cette date.",
};

export const orderSchema = z
  .object({
    occasion: z.enum(occasionIds, { error: "Choisissez une occasion." }),
    occasionOther: z.string().trim().max(80, "80 caractères maximum.").optional(),
    inspiration: z.string().min(1, "Choisissez une inspiration ou « J’ai une idée personnalisée »."),
    cakeType: z.string().trim().min(2, "Précisez le type de gâteau souhaité.").max(80, "80 caractères maximum."),
    guests: z
      .number({ error: "Indiquez un nombre de personnes." })
      .int("Indiquez un nombre entier.")
      .min(guests.min, `Minimum ${guests.min} personnes.`)
      .max(guests.max, `Au-delà de ${guests.max} personnes, appelez-nous directement.`),
    pickupDate: z
      .string()
      .min(1, "Choisissez une date de retrait souhaitée.")
      .superRefine((v, ctx) => {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) {
          ctx.addIssue({ code: "custom", message: "Date invalide." });
          return;
        }
        const status = pickupDateStatus(v);
        if (status !== "ok") ctx.addIssue({ code: "custom", message: DATE_ERRORS[status] });
      }),
    message: z.string().trim().max(messageMaxLength, `${messageMaxLength} caractères maximum.`).optional(),
    flavours: z.string().trim().max(500, "500 caractères maximum.").optional(),
    theme: z.string().trim().max(300, "300 caractères maximum.").optional(),
    allergies: z.string().trim().max(500, "500 caractères maximum.").optional(),
    details: z.string().trim().max(1000, "1000 caractères maximum.").optional(),
    photo: z.any().optional(),
    fullName: z.string().trim().min(2, "Indiquez votre prénom et votre nom.").max(80),
    email: z.email({ error: "Adresse e-mail invalide." }),
    phone: z
      .string()
      .trim()
      .refine((v) => /^\+?\d{9,15}$/.test(v.replace(/[\s.\-()]/g, "")), "Numéro de téléphone invalide."),
    consent: z.literal(true, { error: "Votre accord est nécessaire pour traiter la demande." }),
    /** Pot de miel antispam (doit rester vide). */
    company: z.string().max(0).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.occasion === "autre" && !v.occasionOther?.trim()) {
      ctx.addIssue({ code: "custom", path: ["occasionOther"], message: "Précisez l’occasion." });
    }
  });

export type OrderValues = z.input<typeof orderSchema>;

export const STEP_FIELDS: (keyof OrderValues)[][] = [
  ["occasion", "occasionOther"],
  ["inspiration"],
  ["cakeType", "guests", "pickupDate", "message", "flavours", "theme", "allergies", "details", "photo"],
  ["fullName", "email", "phone", "consent"],
  [],
];

export const STEPS = [
  { title: "L’occasion", short: "Occasion" },
  { title: "Votre inspiration", short: "Inspiration" },
  { title: "Votre gâteau", short: "Détails" },
  { title: "Vos coordonnées", short: "Coordonnées" },
  { title: "Récapitulatif", short: "Récapitulatif" },
] as const;
