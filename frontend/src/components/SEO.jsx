import { useEffect } from 'react';

export default function SEO({ title, description, keywords, ogUrl, ogImage }) {
  useEffect(() => {
    // Update Document Title
    const finalTitle = title ? `${title} | Akshar Graphics` : 'Akshar Graphics - Premium Printing & Branding Surat';
    document.title = finalTitle;

    // Helper to update or create meta tags
    const updateMetaTag = (attrName, attrValue, content) => {
      let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (element) {
        element.setAttribute('content', content);
      } else {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrValue);
        element.setAttribute('content', content);
        document.head.appendChild(element);
      }
    };

    // Update Meta Description
    updateMetaTag('name', 'description', description || '20+ Years of Trusted Printing & Creative Solutions in Surat, Gujarat.');

    // Update Meta Keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // Update Open Graph Tags
    updateMetaTag('property', 'og:title', finalTitle);
    updateMetaTag('property', 'og:description', description || '20+ Years of Trusted Printing & Creative Solutions in Surat, Gujarat.');
    updateMetaTag('property', 'og:url', ogUrl || window.location.href);
    updateMetaTag('property', 'og:image', ogImage || '/assets/logo.svg');
    updateMetaTag('property', 'og:type', 'website');

    // Update Twitter Cards
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', finalTitle);
    updateMetaTag('name', 'twitter:description', description || '20+ Years of Trusted Printing & Creative Solutions in Surat, Gujarat.');

  }, [title, description, keywords, ogUrl, ogImage]);

  return null;
}
