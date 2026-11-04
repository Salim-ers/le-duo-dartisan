import { LegalPage } from "@/components/layout/LegalPage";
import { pageMetadata } from "@/lib/seo";
import { fullAddress, siteConfig, telHref } from "@/lib/site.config";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description:
    "Comment Le Duo d’Artisans traite les données transmises via le formulaire de demande de gâteau : finalité, destinataires, durée de conservation et droits.",
  path: "/confidentialite",
});

export default function PrivacyPage() {
  const l = siteConfig.legal;
  return (
    <LegalPage title="Confidentialité" path="/confidentialite" updated={l.lastUpdated}>
      <h2>Responsable du traitement</h2>
      <p>
        {siteConfig.legalName}, {fullAddress}. Pour toute question relative à vos données, vous pouvez nous joindre au{" "}
        <a href={telHref}>{siteConfig.phone.display}</a>
        {siteConfig.email ? (
          <>
            {" "}ou à <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          </>
        ) : null}{" "}
        ou en boutique.
      </p>

      <h2>Données collectées</h2>
      <p>Ce site ne comporte ni espace client, ni paiement, ni outil de mesure d’audience. Seul le formulaire de demande de gâteau collecte des données :</p>
      <ul>
        <li>vos coordonnées : prénom et nom, adresse e-mail, téléphone ;</li>
        <li>
          le détail de votre demande : occasion, type de gâteau, nombre de personnes, date de retrait souhaitée,
          message, saveurs, décoration, informations complémentaires ;
        </li>
        <li>
          les allergies ou contraintes alimentaires que vous choisissez de signaler, uniquement pour préparer un gâteau
          adapté.
        </li>
      </ul>

      <h2>Finalité et base légale</h2>
      <p>
        Ces données servent exclusivement à étudier votre demande, vous recontacter et préparer votre gâteau. Le
        traitement repose sur les mesures précontractuelles prises à votre demande (article 6.1.b du RGPD). Elles ne
        sont ni revendues, ni utilisées à des fins publicitaires.
      </p>

      <h2>Destinataires</h2>
      <p>
        Les demandes sont reçues par l’équipe de la boutique. Elles transitent par le service d’envoi de formulaires
        Formspree (Formspree, Inc., États-Unis), qui agit comme sous-traitant et transmet la demande par e-mail. Les
        garanties encadrant ce transfert hors de l’Union européenne sont décrites dans la{" "}
        <a href="https://formspree.io/legal/privacy-policy/" target="_blank" rel="noopener noreferrer">
          politique de confidentialité de Formspree
        </a>
        .
      </p>

      <h2>Durée de conservation</h2>
      <p>Les demandes sont conservées {l.orderRetention}, puis supprimées.</p>

      <h2>Cookies et contenus tiers</h2>
      <p>
        Le site ne dépose aucun cookie publicitaire ni de mesure d’audience. Il mémorise seulement dans votre navigateur
        le fait que l’animation d’ouverture a déjà été vue, sans aucune donnée personnelle. Les polices de caractères
        sont hébergées avec le site.
      </p>
      <p>
        La carte Google Maps ne se charge que si vous cliquez sur « Afficher la carte ». Google peut alors déposer ses
        propres cookies, selon sa{" "}
        <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noopener noreferrer">
          politique de confidentialité
        </a>
        .
      </p>
      <p>
        Comme tout hébergeur, {l.host.name} enregistre des journaux techniques (adresse IP, date de connexion) pour
        assurer la sécurité et le bon fonctionnement du site.
      </p>

      <h2>Vos droits</h2>
      <p>
        Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation et d’opposition sur vos données.
        Pour l’exercer, contactez la boutique par les moyens indiqués ci-dessus. Vous pouvez également introduire une
        réclamation auprès de la{" "}
        <a href="https://www.cnil.fr/fr/plaintes" target="_blank" rel="noopener noreferrer">
          CNIL
        </a>
        .
      </p>
    </LegalPage>
  );
}
