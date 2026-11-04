# Le Duo d’Artisans — site vitrine

Site de la boulangerie-pâtisserie **Le Duo d’Artisans**, 7 rue Anatole France, 60290 Rantigny.
Application Next.js (App Router), entièrement statique, prête pour Vercel.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis compléter
npm run dev                  # http://localhost:3000
npm run build && npm start   # version de production
```

Node.js 20.9 ou plus récent.

## Pages

| Page | Route | Personnalité |
|---|---|---|
| Accueil | `/` | Page courte en 5 sections : accroche, créations, savoir-faire, sur mesure, adresse |
| Nos créations | `/nos-creations` | Catalogue filtrable (`?categorie=pains`…), fiches produit, plein écran |
| Gâteaux sur mesure | `/gateaux-sur-mesure` | Configurateur en 5 étapes, envoi Formspree |
| Notre maison | `/notre-maison` | Chapitres éditoriaux et galerie photo |
| Nous trouver | `/nous-trouver` | Adresse, appel, itinéraire, horaires, carte Google |
| Mentions légales | `/mentions-legales` | |
| Confidentialité | `/confidentialite` | RGPD, cookies, sous-traitants |

Plus : page 404, page d’erreur, `sitemap.xml`, `robots.txt`, image Open Graph, icônes, données structurées `Bakery` et fil d’Ariane.

## Modifier le contenu

Tout se fait dans quelques fichiers, sans toucher aux composants :

| Quoi | Fichier |
|---|---|
| Coordonnées, horaires, fermetures exceptionnelles, Instagram, délai de commande, infos légales | `lib/site.config.ts` |
| Produits du catalogue (nom, description, prix, allergènes, personnalisable) | `data/products.ts` |
| Photographies et textes alternatifs | `data/images.ts` + `public/images/` |
| Occasions et inspirations du configurateur | `data/order.ts` |

- **Horaires** : un jour fermé = `[]`. Plusieurs créneaux possibles (`[{open:"06:30",close:"13:30"},{open:"15:30",close:"19:30"}]`). Passer `hours.confirmed` à `true` une fois validés : ils sont alors publiés dans les données structurées Google et la mention « indicatifs » disparaît.
- **Fermetures exceptionnelles** : `hours.closures`, elles bloquent aussi les dates dans le calendrier de commande.
- **Prix** : laisser `null` tant qu’ils ne sont pas confirmés. Aucun prix n’est inventé.
- **Allergènes** : ne renseigner que des allergènes confirmés. Vide = « liste disponible en boutique ».
- **Remplacer une photo** : déposer le nouveau fichier au même chemin dans `public/images/`. `scripts/prepare-images.mjs` montre comment les originaux ont été convertis.
- **Photos d’ambiance** : `public/images/ambiance/`, licence CC0 (WordPress Photo Directory), recréées par `scripts/prepare-stock-images.mjs`. Elles se déclarent avec `stock()` dans `data/images.ts` et leurs crédits s’ajoutent seuls aux mentions légales. Une photo qui montre un produit porte la mention « Photo d’illustration ». Le catalogue et la galerie de « Notre maison » affirment montrer la boutique : n’y mettre que ses propres photos.

## Variables d’environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Domaine définitif (`https://…`). Active les URL canoniques ; utilisé par le sitemap et l’Open Graph. |
| `NEXT_PUBLIC_FORMSPREE_ORDER_FORM_ID` | Identifiant du formulaire Formspree. **Vide = mode démonstration** : formulaire parcourable, envoi désactivé et signalé. |
| `NEXT_PUBLIC_FORMSPREE_ACCEPTS_FILES` | `true` seulement si l’offre Formspree accepte les fichiers : affiche le champ « photo d’inspiration ». |
| `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY` | Facultatif. Clé (gratuite) de l’API officielle Maps Embed. Sans clé, l’intégration standard de Google Maps est utilisée. |

Aucun secret n’est codé en dur. Ces variables sont publiques par nature (identifiant de formulaire, clé d’intégration restreinte par domaine).

## Brancher Formspree

1. Créer un compte sur formspree.io et un nouveau formulaire.
2. Dans les réglages du formulaire, indiquer l’adresse e-mail de la boulangerie comme destinataire.
3. Copier l’identifiant (la partie après `/f/` de l’URL) dans `NEXT_PUBLIC_FORMSPREE_ORDER_FORM_ID` (Vercel → Settings → Environment Variables), puis redéployer.
4. Recommandé : dans Formspree, activer le filtrage antispam et restreindre les domaines autorisés au domaine du site.

Ce que reçoit la boulangerie : un e-mail intitulé « Demande de gâteau : Anniversaire, retrait souhaité le samedi 7 novembre 2026 », avec les champs dans cet ordre : Client, Téléphone, E-mail, Occasion, Inspiration, Type de gâteau, Nombre de personnes, Date de retrait souhaitée (à confirmer), Message à inscrire, Saveurs, Couleurs ou thème, Allergies et contraintes, Informations complémentaires, Retrait, Consentement. Le bouton « Répondre » écrit directement au client.

Protection : champ pot de miel (`_gotcha`), validation Zod côté client, filtrage Formspree. Aucune donnée n’est stockée ni journalisée par le site. Les états d’envoi, de succès et d’erreur sont gérés ; aucun succès n’est simulé.

## Déployer sur Vercel

1. Pousser le dépôt sur GitHub, puis « Import Project » sur vercel.com (framework détecté automatiquement).
2. Renseigner les variables d’environnement ci-dessus.
3. Une fois le domaine branché, définir `NEXT_PUBLIC_SITE_URL` et redéployer.

## À valider avec la boulangerie avant mise en ligne

- **Téléphone** : le brief indique 03 44 28 55 61, la plaque sur la photo de façade affiche 03 44 28 55 67. Le site utilise le numéro du brief.
- **Horaires** : ceux du site viennent d’un annuaire ; la plaque de façade montre une coupure à midi. `hours.confirmed` est à `false`.
- **Photographies** : les fichiers portent des noms « ChatGPT Image » et les étiquettes de vitrine diffèrent d’une photo à l’autre pour un même produit. Vérifier qu’elles représentent fidèlement les produits ; les remplacer par des originaux si possible. Les prix visibles sur les étiquettes en photo ne sont pas repris sur le site.
- **Noms des produits** du catalogue : décrits d’après les photos, champ `toConfirm: true`.
- **Instagram** : compte `@leduodartisans` non vérifié (`social.instagram.verified`).
- **Mentions légales** : forme juridique, capital, RCS, TVA, directeur de la publication (affichés « en cours de mise à jour »). SIREN 987 907 607 et SIRET relevés dans un annuaire public, à vérifier sur annuaire-entreprises.data.gouv.fr.
- **Hébergeur** : Vercel pré-renseigné, à confirmer après déploiement. **Durée de conservation** des demandes : 12 mois proposés.
- **Coordonnées GPS** (données structurées) issues d’un annuaire.
- **Adresse e-mail** publique : aucune communiquée, rien n’est affiché.

## Technique

- Next.js 16, React 19, TypeScript strict, Tailwind CSS 4.
- Défilement natif du navigateur. Les photos apparaissent en CSS pur (`.reveal`, `animation-timeline: view()`) : rien ne dépend de JavaScript pour s’afficher.
- Motion : menu mobile, modales, filtres, étapes du configurateur.
- Radix Dialog (base de shadcn/ui) pour les fenêtres accessibles, React Hook Form + Zod, Lucide.
- `next/image` : AVIF/WebP, tailles adaptées à chaque écran, flou de chargement, aucun décalage de mise en page.
- Polices auto-hébergées (Cormorant, Manrope, Damion) : aucune requête vers Google Fonts.
- Logo : vectorisé depuis le fichier fourni (`public/logo-le-duo-dartisans.svg`, tracé dans `lib/logo-path.ts`).

**Animations** : volontairement limitées pour éviter les bugs de défilement. GSAP, ScrollTrigger, Lenis, l’intro, le rideau de transition et le curseur personnalisé ont été retirés : la combinaison faisait planter l’accueil au rechargement et bloquait la molette dans les fenêtres. `prefers-reduced-motion` est respecté partout.

**Cookies** : aucun cookie de mesure ni publicitaire, donc pas de bandeau. La carte Google ne se charge qu’au clic du visiteur.

### Structure

```
app/                 pages, métadonnées, sitemap, robots, icônes
components/layout      en-tête, pied de page, barre mobile, fil d’Ariane
components/home        sections de l’accueil
components/products    catalogue et fiche produit
components/order       configurateur, calendrier, schéma, envoi Formspree
data/                  produits, images, options de commande
lib/                   configuration, horaires, dates, SEO
public/images/         photographies optimisées
styles/globals.css     jetons de design (couleurs, typographie, moulures)
```

Crédits photos : Le Duo d’Artisans pour les produits et la boutique ; photos d’ambiance en CC0 créditées dans les mentions légales.
