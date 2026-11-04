import { LegalPage, LegalValue } from "@/components/layout/LegalPage";
import { images, type SiteImage } from "@/data/images";
import { pageMetadata } from "@/lib/seo";
import { fullAddress, siteConfig, telHref } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Mentions légales",
  description: "Mentions légales du site de la boulangerie-pâtisserie Le Duo d’Artisans à Rantigny.",
  path: "/mentions-legales",
});

export default function LegalNoticePage() {
  const l = siteConfig.legal;
  const stockPhotos = (Object.values(images) as SiteImage[]).filter((i) => i.source === "stock");
  return (
    <LegalPage title="Mentions légales" path="/mentions-legales" updated={l.lastUpdated}>
      <h2>Éditeur du site</h2>
      <dl>
        <dt>Dénomination</dt>
        <dd>{siteConfig.legalName}</dd>
        <dt>Forme juridique</dt>
        <dd>
          <LegalValue value={l.legalForm} />
        </dd>
        <dt>Capital social</dt>
        <dd>
          <LegalValue value={l.shareCapital} />
        </dd>
        <dt>Siège</dt>
        <dd>{fullAddress}</dd>
        <dt>SIREN</dt>
        <dd>{l.siren}</dd>
        <dt>SIRET</dt>
        <dd>{l.siret}</dd>
        <dt>Immatriculation</dt>
        <dd>
          <LegalValue value={l.rcs} />
        </dd>
        <dt>TVA intracommunautaire</dt>
        <dd>
          <LegalValue value={l.vatNumber} />
        </dd>
        <dt>Téléphone</dt>
        <dd>
          <a href={telHref}>{siteConfig.phone.display}</a>
        </dd>
        {siteConfig.email && (
          <>
            <dt>E-mail</dt>
            <dd>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </dd>
          </>
        )}
        <dt>Directeur de la publication</dt>
        <dd>
          <LegalValue value={l.publicationDirector} />
        </dd>
      </dl>

      <h2>Hébergement</h2>
      <dl>
        <dt>Hébergeur</dt>
        <dd>{l.host.name}</dd>
        <dt>Adresse</dt>
        <dd>{l.host.address}</dd>
        <dt>Site</dt>
        <dd>
          <a href={l.host.website} target="_blank" rel="noopener noreferrer">
            {l.host.website.replace("https://", "")}
          </a>
        </dd>
      </dl>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les photographies, le logo, les textes et la mise en page de ce site sont la propriété de {siteConfig.name} ou
        sont utilisés avec son autorisation, à l’exception des photographies d’illustration libres de droit créditées
        ci-dessous. Toute reproduction, même partielle, des éléments appartenant à {siteConfig.name} est soumise à
        autorisation préalable.
      </p>

      <h2>Crédits</h2>
      <p>
        Photographies des produits et de la boutique : {siteConfig.name}. L’assortiment réel varie selon les jours et
        les saisons.
      </p>
      <p>
        Photographies d’illustration, sans lien avec les produits de la boutique, issues d’Unsplash sous{" "}
        <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">
          licence Unsplash
        </a>{" "}
        :
      </p>
      <ul>
        {stockPhotos.map((p) => (
          <li key={p.credit?.url}>
            <a href={p.credit?.url} target="_blank" rel="noopener noreferrer">
              {p.credit?.author}
            </a>{" "}
            : {p.alt.charAt(0).toLowerCase() + p.alt.slice(1)}
          </li>
        ))}
      </ul>
      <p>Typographies : Cormorant, Manrope et Damion, sous licence SIL Open Font License, hébergées avec le site.</p>

      <h2>Informations sur les produits</h2>
      <p>
        Les produits présentés le sont à titre indicatif. Les prix, compositions et allergènes sont communiqués en
        boutique. Une demande de gâteau envoyée depuis ce site ne constitue pas une commande : elle est confirmée par
        la boutique, qui précise alors le tarif et la date de retrait.
      </p>

      <h2>Données personnelles</h2>
      <p>
        Le traitement des données transmises via le formulaire de demande est décrit dans la{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>
    </LegalPage>
  );
}
