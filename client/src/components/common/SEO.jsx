// ── SEO Helmet Helper ──────────────────────────────────────────────────────────
// Usage: <SEO title="..." description="..." keywords="..." schema={...} />
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title,
  description,
  keywords,
  image = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  url,
  type = 'website',
  schema
}) => {
  const suffix = 'ESPACIO Interiors';
  const fullTitle = title
    ? (title.includes(suffix) ? title : `${title} — ${suffix}`)
    : 'ESPACIO Interiors | Luxury Interior Design & Architecture Studio';
  const metaDesc = description || "ESPACIO is Hyderabad's premier luxury interior design studio. We deliver full-home interiors, modular kitchens, commercial offices, and material supply with engineering precision.";
  const canonical = url ? `https://www.theespacio.in${url.startsWith('/') ? url : `/${url}`}` : 'https://www.theespacio.in';
  const metaKeywords = keywords || "interior design hyderabad, luxury interior designers, turnkey home interiors, modular kitchens hyderabad, WPC wall panels, fluted panels, luxury home fitouts, ESPACIO interiors";

  const defaultSchema = {
    '@context': 'https://schema.org',
    '@type': 'InteriorDesigner',
    '@id': 'https://www.theespacio.in/#organization',
    name: 'ESPACIO Interiors & Modular',
    url: 'https://www.theespacio.in',
    logo: 'https://www.theespacio.in/favicon.svg',
    image: image,
    description: metaDesc,
    telephone: '+91 90000 00000',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Jubilee Hills / Gachibowli',
      addressLocality: 'Hyderabad',
      addressRegion: 'Telangana',
      postalCode: '500033',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.4399,
      longitude: 78.3989
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '20:00'
    },
    sameAs: [
      'https://www.instagram.com/theespacio.in',
      'https://www.facebook.com/theespacio.in'
    ]
  };

  const jsonLdSchema = schema || defaultSchema;

  React.useEffect(() => {
    document.title = fullTitle;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', metaDesc);
    }
  }, [fullTitle, metaDesc]);

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="ESPACIO Interiors" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={image} />

      {/* JSON-LD Structured Data Schema */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLdSchema)}
      </script>
    </Helmet>
  );
};

export default SEO;
