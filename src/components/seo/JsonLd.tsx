import React from 'react';

interface JsonLdProps {
  /** One or more schema.org nodes (typically an @graph bundle). */
  data: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Renders schema.org structured data as a JSON-LD <script> block for rich
 * results (SoftwareApplication, WebSite, Organization, FAQPage…).
 * dangerouslySetInnerHTML keeps the JSON payload intact — crawlers read it
 * verbatim, users never see it. Server components only (no client state).
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
