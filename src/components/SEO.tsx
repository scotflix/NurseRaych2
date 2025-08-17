import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
  structuredData?: object | object[];
}

const SEO: React.FC<SEOProps> = ({
  title = 'Nurse Raych - Healthcare Advocacy & Community Support',
  description = 'Join Nurse Raych in transforming healthcare through advocacy, education, and community support. Empowering patients and healthcare professionals to create meaningful change.',
  keywords = 'healthcare advocacy, nurse advocacy, patient support, healthcare education, community health, nursing, medical advocacy',
  canonical = 'https://nurseraychfoundation.org',
  ogImage = '/og-image.png',
  noIndex = false,
  structuredData
}) => {
  const siteTitle = 'Nurse Raych';
  const fullTitle = title === siteTitle ? title : `${title} | ${siteTitle}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Update meta tags
    const updateMetaTag = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', name);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    const updatePropertyMetaTag = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('property', property);
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Update meta tags
    updateMetaTag('title', fullTitle);
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    
    // Update Open Graph tags
    updatePropertyMetaTag('og:type', 'website');
    updatePropertyMetaTag('og:url', canonical);
    updatePropertyMetaTag('og:title', fullTitle);
    updatePropertyMetaTag('og:description', description);
    updatePropertyMetaTag('og:image', `https://nurseraychfoundation.org${ogImage}`);
    updatePropertyMetaTag('og:image:width', '1200');
    updatePropertyMetaTag('og:image:height', '630');
    updatePropertyMetaTag('og:site_name', siteTitle);
    updatePropertyMetaTag('og:locale', 'en_US');
    
    // Update Twitter tags
    updatePropertyMetaTag('twitter:card', 'summary_large_image');
    updatePropertyMetaTag('twitter:url', canonical);
    updatePropertyMetaTag('twitter:title', fullTitle);
    updatePropertyMetaTag('twitter:description', description);
    updatePropertyMetaTag('twitter:image', `https://nurseraychfoundation.org${ogImage}`);
    
    // Update canonical URL
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonical);

    // Update robots
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow');
    } else {
      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (robotsMeta) {
        robotsMeta.remove();
      }
    }

    // Add structured data
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Cleanup function
    return () => {
      // Remove dynamically added meta tags if needed
    };
  }, [title, description, keywords, canonical, ogImage, noIndex, structuredData, siteTitle, fullTitle]);

  return null;
};

export default SEO;
