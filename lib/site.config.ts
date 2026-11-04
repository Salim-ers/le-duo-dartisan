/**
 * CONFIGURATION CENTRALE — Le Duo d'Artisans
 * ------------------------------------------------------------------
 * Toutes les informations commerciales du site se modifient ici :
 * coordonnées, horaires, réseaux sociaux, formulaire, carte, légal.
 *
 * Règle : une information non confirmée par la boulangerie reste
 * marquée `confirmed: false` (ou `null`) et n'est jamais inventée.
 */

export type DayKey =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

/** Créneau d'ouverture, au format 24 h "HH:MM". */
export type OpeningSlot = { open: string; close: string };

export const siteConfig = {
  name: "Le Duo d'Artisans",
  legalName: "LE DUO D'ARTISANS",
  tagline: "Le goût du savoir-faire",
  description:
    "Boulangerie-pâtisserie artisanale à Rantigny (Oise) : pains, viennoiseries, pâtisseries, snacking et gâteaux sur mesure pour vos occasions.",

  /** Domaine public — définir NEXT_PUBLIC_SITE_URL en production. */
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
  /** true seulement quand le domaine définitif est renseigné (active les canonical). */
  hasFinalDomain: Boolean(process.env.NEXT_PUBLIC_SITE_URL),

  address: {
    street: "7 rue Anatole France",
    postalCode: "60290",
    city: "Rantigny",
    region: "Oise",
    regionCode: "Hauts-de-France",
    country: "FR",
    /** Coordonnées issues d'un annuaire public — à vérifier sur Google Maps. */
    geo: { lat: 49.3296409, lng: 2.4405527 },
  },

  phone: {
    display: "03 44 28 55 61",
    e164: "+33344285561",
  },

  /** Aucune adresse e-mail publique communiquée : laisser null tant qu'elle n'est pas fournie. */
  email: null as string | null,

  social: {
    instagram: {
      handle: "@leduodartisans",
      url: "https://www.instagram.com/leduodartisans/",
      /** À passer à true après vérification du compte exact. */
      verified: false,
    },
  },

  /**
   * HORAIRES — issus d'un annuaire, NON confirmés par le commerçant.
   * Attention : la photo de façade fournie affiche des horaires différents
   * (coupure à midi). Faire valider avant mise en ligne.
   * Un jour fermé = tableau vide. Plusieurs créneaux possibles par jour.
   */
  hours: {
    confirmed: false,
    timezone: "Europe/Paris",
    week: {
      monday: [],
      tuesday: [{ open: "06:30", close: "19:30" }],
      wednesday: [{ open: "06:30", close: "19:30" }],
      thursday: [{ open: "06:30", close: "19:30" }],
      friday: [{ open: "06:30", close: "19:30" }],
      saturday: [{ open: "06:30", close: "19:00" }],
      sunday: [{ open: "07:00", close: "13:30" }],
    } satisfies Record<DayKey, OpeningSlot[]>,
    /**
     * Fermetures exceptionnelles (congés, jours fériés…), dates incluses, format AAAA-MM-JJ.
     * Elles sont aussi exclues du calendrier de commande.
     */
    closures: [] as { from: string; to: string; label: string }[],
  },

  /** Commandes de gâteaux sur mesure */
  order: {
    /** Délai minimum entre la demande et le retrait, en jours. */
    minLeadDays: 3,
    /** Horizon maximum de réservation, en jours. */
    maxAdvanceDays: 180,
    /** Nombre de parts proposé par défaut et bornes. */
    guests: { min: 4, max: 150, default: 10 },
    /** Longueur maximale du message inscrit sur le gâteau. */
    messageMaxLength: 60,
    /** Seul mode de retrait proposé. */
    pickupLabel: "Retrait en boutique, 7 rue Anatole France à Rantigny",
  },

  /** Formspree — l'identifiant se règle via variable d'environnement, jamais en dur. */
  formspree: {
    orderFormId: process.env.NEXT_PUBLIC_FORMSPREE_ORDER_FORM_ID ?? "",
    /**
     * L'envoi de fichiers n'est disponible que sur les offres payantes de Formspree.
     * Passer NEXT_PUBLIC_FORMSPREE_ACCEPTS_FILES=true uniquement si c'est le cas.
     */
    acceptsFiles: process.env.NEXT_PUBLIC_FORMSPREE_ACCEPTS_FILES === "true",
    maxFileSizeMb: 8,
  },

  maps: {
    /** Clé facultative pour l'API officielle Maps Embed (gratuite). Sans clé : intégration standard. */
    embedApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY ?? "",
    query: "Le Duo d'Artisans, 7 rue Anatole France, 60290 Rantigny",
  },

  catalogue: {
    /** Afficher les prix si renseignés dans data/products.ts. */
    showPrices: true,
  },

  /**
   * Informations légales. `null` = à fournir par la boulangerie.
   * SIREN/SIRET relevés dans un annuaire public — à vérifier sur annuaire-entreprises.data.gouv.fr.
   */
  legal: {
    legalForm: null as string | null,
    shareCapital: null as string | null,
    siren: "987 907 607",
    siret: "987 907 607 00012",
    rcs: null as string | null,
    vatNumber: null as string | null,
    publicationDirector: null as string | null,
    host: {
      name: "Vercel Inc.",
      address: "440 N Barranca Ave #4133, Covina, CA 91723, États-Unis",
      website: "https://vercel.com",
      /** Confirmer une fois le déploiement réalisé chez cet hébergeur. */
      confirmed: false,
    },
    /** Durée de conservation des demandes de gâteaux (à valider par la boulangerie). */
    orderRetention: "12 mois après le traitement de la demande",
    lastUpdated: "2026-11-04",
  },
} as const;

export const navigation = [
  { href: "/nos-creations", label: "Nos créations" },
  { href: "/gateaux-sur-mesure", label: "Gâteaux sur mesure" },
  { href: "/notre-maison", label: "Notre maison" },
  { href: "/nous-trouver", label: "Nous trouver" },
] as const;

export const fullAddress = `${siteConfig.address.street}, ${siteConfig.address.postalCode} ${siteConfig.address.city}`;

export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
  siteConfig.maps.query,
)}`;

export const mapsPlaceUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  siteConfig.maps.query,
)}`;

export const telHref = `tel:${siteConfig.phone.e164}`;
