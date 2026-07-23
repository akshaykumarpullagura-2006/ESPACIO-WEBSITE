// ── SEO Helmet Helper ──────────────────────────────────────────────────────────
// Usage: <SEO title="..." description="..." />
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  url,
  type = 'website',
}) => {
  const suffix = 'ESPACIO Interiors';
  const fullTitle = title
    ? (title.includes(suffix) ? title : `${title} — ${suffix}`)
    : 'ESPACIO Interiors | Premium Interior Design, Hyderabad';
  const metaDesc = description || "ESPACIO is Hyderabad's premier interior design studio. We deliver full-home interiors, modular kitchens, commercial offices, and material supply with engineering precision.";
  const canonical = url ? `https://www.theespacio.in${url}` : 'https://www.theespacio.in';

  React.useEffect(() => {
    document.title = fullTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaDesc);
    }
  }, [fullTitle, metaDesc]);

  return (
    <Helmet>
      {/* Primary */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ESPACIO Interiors" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {/* Local Business schema */}
      <script type="application/ld+json">{JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'InteriorDesigner',
        name: 'ESPACIO Interiors',
        url: 'https://www.theespacio.in',
        logo: 'https://www.theespacio.in/logo.png',
        address: { '@type': 'PostalAddress', addressLocality: 'Hyderabad', addressRegion: 'Telangana', addressCountry: 'IN' },
        description: metaDesc,
        sameAs: ['https://www.instagram.com/theespacio.in'],
      })}</script>
    </Helmet>
  );
};

export default SEO;
