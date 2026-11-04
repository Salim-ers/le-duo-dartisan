export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Contenu entièrement contrôlé (configuration du site), échappement de "<".
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
