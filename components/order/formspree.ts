import { inspirations, occasions } from "@/data/order";
import { formatLongDate } from "@/lib/dates";
import { siteConfig } from "@/lib/site.config";
import type { OrderValues } from "./schema";

export const FORMSPREE_ID = siteConfig.formspree.orderFormId;
export const isDemoMode = !FORMSPREE_ID;

/**
 * Notification structurée reçue par la boulangerie : chaque champ porte un
 * libellé lisible, dans l'ordre utile au traitement de la demande.
 */
export function buildNotification(v: OrderValues) {
  const occasion = occasions.find((o) => o.id === v.occasion)?.label ?? v.occasion;
  const occasionLabel = v.occasion === "autre" && v.occasionOther ? `${occasion} : ${v.occasionOther}` : occasion;
  const inspiration = inspirations.find((i) => i.id === v.inspiration)?.label ?? v.inspiration;
  const date = v.pickupDate ? formatLongDate(v.pickupDate) : "";
  const dash = (s?: string) => (s && s.trim() ? s.trim() : "—");

  const fields: [string, string][] = [
    ["Client", v.fullName],
    ["Téléphone", v.phone],
    ["E-mail", v.email],
    ["Occasion", occasionLabel],
    ["Inspiration", inspiration],
    ["Type de gâteau", v.cakeType],
    ["Nombre de personnes", String(v.guests)],
    ["Date de retrait souhaitée", `${date} (à confirmer par la boutique)`],
    ["Message à inscrire", dash(v.message)],
    ["Saveurs souhaitées", dash(v.flavours)],
    ["Couleurs ou thème", dash(v.theme)],
    ["Allergies et contraintes", dash(v.allergies)],
    ["Informations complémentaires", dash(v.details)],
    ["Retrait", siteConfig.order.pickupLabel],
    ["Consentement", "Le client accepte l’utilisation de ses coordonnées pour le traitement de sa demande."],
  ];

  return {
    subject: `Demande de gâteau : ${occasion}, retrait souhaité le ${date}`,
    fields,
  };
}

export type SubmitResult = { ok: true } | { ok: false; message: string };

/** Envoi réel à Formspree (aucune simulation). Aucune donnée n'est journalisée. */
export async function submitOrder(v: OrderValues): Promise<SubmitResult> {
  if (isDemoMode) return { ok: false, message: "Le formulaire n’est pas encore relié : aucune demande envoyée." };

  const { subject, fields } = buildNotification(v);
  const file =
    siteConfig.formspree.acceptsFiles && v.photo instanceof FileList && v.photo.length > 0 ? v.photo[0] : null;

  let body: BodyInit;
  const headers: Record<string, string> = { Accept: "application/json" };

  if (file) {
    const fd = new FormData();
    fd.append("_subject", subject);
    fd.append("email", v.email);
    for (const [k, val] of fields) fd.append(k, val);
    fd.append("Photo d’inspiration", file);
    fd.append("_gotcha", v.company ?? "");
    body = fd;
  } else {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify({
      _subject: subject,
      email: v.email,
      ...Object.fromEntries(fields),
      _gotcha: v.company ?? "",
    });
  }

  try {
    const res = await fetch(`https://formspree.io/f/${encodeURIComponent(FORMSPREE_ID)}`, {
      method: "POST",
      headers,
      body,
    });
    if (res.ok) return { ok: true };
    const data = (await res.json().catch(() => null)) as { errors?: { message: string }[] } | null;
    const detail = data?.errors?.map((e) => e.message).join(" ");
    return {
      ok: false,
      message: detail
        ? `La demande a été refusée par le service d’envoi : ${detail}.`
        : "Le service d’envoi n’a pas accepté la demande. Réessayez dans un instant.",
    };
  } catch {
    return { ok: false, message: "La connexion a échoué. Vérifiez votre réseau puis réessayez." };
  }
}
