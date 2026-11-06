@AGENTS.md

# Le Duo d'Artisans — règles du projet

Site vitrine statique (Next.js 16 App Router, React 19, TypeScript strict, Tailwind 4), boulangerie-pâtisserie à Rantigny. Le README décrit les pages, le contenu modifiable et le déploiement : le lire avant toute évolution.

## Commandes

- `npm run dev` : développement
- `npx tsc --noEmit` puis `npm run lint` puis `npm run build` : à passer avant toute livraison

## Contenu : ce qui ne s'invente pas

- Coordonnées, horaires, infos légales : `lib/site.config.ts`. Valeur non confirmée = `null` ou `confirmed: false`, jamais inventée.
- Produits : `data/products.ts`. Prix `null` tant qu'ils ne sont pas confirmés, allergènes uniquement s'ils sont confirmés.
- Photos : `data/images.ts`. Chaque photo n'apparaît qu'à un seul endroit du site ; les photos libres de droit (`stock()`) montrant un produit portent « Photo d'illustration ». La façade reste sur « Nous trouver ».
- Aucune revendication non vérifiée (« fait maison », labels, avis, prix).
- Le formulaire n'affiche jamais un succès non confirmé par Formspree ; sans identifiant, il reste en mode démonstration signalé.

## Direction artistique « La vitrine en couleurs »

- Jetons dans `styles/globals.css` : bleu de façade, crème, framboise, pistache, citron. Titres en Fraunces avec `font-variation-settings: "SOFT" 100` (utilitaires `t-mega`, `t-hero`, `t-h1`…).
- Tout est arrondi : boutons et en-tête en pastille (`rounded-full`), cartes `rounded-[1.75rem]` à `rounded-[2.5rem]`, sections bleues `rounded-[2.5rem] lg:rounded-[4rem]`, arches (`rounded-arch`). Ne pas réintroduire d'angles vifs.
- Décor partagé dans `components/ui/Decor.tsx` (Chip, Macaron, RotatingBadge, Glow) ; boutons dans `components/ui/Button.tsx` (`variant`, `size`, `arrow`).
- Chaque page garde sa personnalité : ne pas recopier une section d'une page à l'autre.

## Animations : règles qui évitent les bugs

1. Pas de `pin` ScrollTrigger : `position: sticky` + `scrub`.
2. Pas de `once` : apparitions uniques via `RevealImage`, `SplitReveal`, `FadeIn` (IntersectionObserver, `components/animations/Reveal.tsx`).
3. États de départ en CSS sous `.anim` (`data-fade`, `data-split`, `data-pop`, `data-reveal`) ; la classe est retirée après 8 s si le JS ne démarre pas.
4. Dans une timeline, un `fromTo` avec `stagger` n'applique son état de départ qu'au premier élément : un `fromTo` par élément ou un `gsap.set` préalable.
5. Mouvements continus CSS en propriétés individuelles (`translate`, `rotate`, `scale`) : GSAP pilote `transform`.
6. Toute animation passe par `gsap.matchMedia()` avec `MQ` (`lib/gsap.ts`) : rien ne bouge avec `prefers-reduced-motion`.
7. Les animations d'entrée attendent `onStageReady` (`lib/stage.ts`) : fin de l'intro ou du rideau de transition.

## Vérification visuelle

Contrôler au minimum 320, 390, 768, 1024, 1440 et 2560 px, sans débordement horizontal, et le mode mouvement réduit.
