interface JsonLdProps {
  data: Record<string, unknown>;
}

function serializeJsonLd(data: Record<string, unknown>) {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/<\/script/gi, "<\\/script");
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
