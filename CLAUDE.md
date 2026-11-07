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
- Décor partagé dans `components/ui/Decor.tsx` (Macaron, RotatingBadge, Glow) ; boutons dans `components/ui/Button.tsx` (`variant`, `size`, `arrow`).
- Pas d’effets « template IA » : pas d’étiquette en pastille au-dessus des titres, pas de ruban de mots qui défile, pas de texte qui s’allume mot à mot, pas de nuage d’étiquettes. Un titre se suffit à lui-même ; les vraies photos de la boutique priment sur le décor.
- Chaque page garde sa personnalité : ne pas recopier une section d'une page à l'autre.

## Animations : règles qui évitent les bugs

1. Pas de `pin` ScrollTrigger : `position: sticky` + `scrub`.
2. Pas de `once` : apparitions uniques via `RevealImage`, `SplitReveal`, `FadeIn` (IntersectionObserver, `components/animations/Reveal.tsx`).
3. États de départ en CSS sous `.anim` (`data-fade`, `data-split`, `data-pop`, `data-reveal`) ; la classe est retirée après 8 s si le JS ne démarre pas.
4. Dans une timeline, un `fromTo` avec `stagger` n'applique son état de départ qu'au premier élément : un `fromTo` par élément ou un `gsap.set` préalable.
5. Mouvements continus CSS en propriétés individuelles (`translate`, `rotate`, `scale`) : GSAP pilote `transform`.
6. Toute animation passe par `gsap.matchMedia()` avec `MQ` (`lib/gsap.ts`) : rien ne bouge avec `prefers-reduced-motion`.
7. Les animations d'entrée attendent `onStageReady` (`lib/stage.ts`) : fin de l'intro ou du rideau de transition.

## Performance : règles issues de l'audit

1. Pas de `filter: blur()` sur un élément animé ou très grand : les halos (`Glow`) sont des dégradés radiaux.
2. Pas d'animation CSS infinie sur un élément caché : l'activer seulement quand il est visible (ex. points du rideau, `data-active`).
3. Lenis tourne en tête du ticker GSAP (`gsap.ticker.add(tick, false, true)`) ; dans un écouteur de défilement, lire la position dans l'événement et écrire dans `requestAnimationFrame`.
4. Motion uniquement dans les pages qui en ont besoin (catalogue, formulaire) : jamais dans la mise en page globale (en-tête, pied de page).
5. Filtres d'URL : `window.history.replaceState` (Next le synchronise avec `useSearchParams`), pas `router.replace` qui interroge le serveur.
6. Image principale d'une page : prop `preload` de `Photo` (= `loading="eager"` + `fetchPriority="high"`) ; `sizes` au plus près de la largeur affichée.
7. Contraste : texte clair sur framboise → `bg-framboise-deep` (le framboise clair n'atteint que 3,5:1).
8. Ne pas réactiver `experimental.inlineCss` : testé et écarté (page plus lourde, styles 4× plus coûteux au défilement).
9. Toute optimisation se mesure avant/après sur le build de production (`next build && next start`) : Lighthouse mobile, trace Chrome du défilement à CPU ×4.

## Vérification visuelle

Contrôler au minimum 320, 390, 768, 1024, 1440 et 2560 px, sans débordement horizontal, et le mode mouvement réduit.
