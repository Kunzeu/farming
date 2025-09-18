'use client';

import { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string;
  locale?: string;
}

export default function MetaTags({ 
  title, 
  description, 
  url, 
  image = 'https://www.true-farming.com/images/icons/icon.png',
  keywords = 'Guild Wars 2, farming, gold, materials, GW2, Tyria',
  locale = 'en_US'
}: MetaTagsProps) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Function to update or create meta tags
    const updateMetaTag = (property: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${property}"]` : `meta[name="${property}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        if (isProperty) {
          meta.setAttribute('property', property);
        } else {
          meta.setAttribute('name', property);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };

    // Function to update or create link tags
    const updateLinkTag = (rel: string, href: string) => {
      let link = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        document.head.appendChild(link);
      }
      link.setAttribute('href', href);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    if (keywords) updateMetaTag('keywords', keywords);
    updateMetaTag('robots', 'index, follow');
    updateMetaTag('author', 'True Farming');
    updateMetaTag('theme-color', '#0f172a');
    updateMetaTag('msapplication-TileColor', '#0f172a');

    // Open Graph tags
    updateMetaTag('og:type', 'website', true);
    updateMetaTag('og:url', url, true);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', image, true);
    updateMetaTag('og:image:width', '1200', true);
    updateMetaTag('og:image:height', '630', true);
    updateMetaTag('og:image:alt', title, true);
    updateMetaTag('og:image:type', 'image/png', true);
    updateMetaTag('og:site_name', 'True Farming', true);
    updateMetaTag('og:locale', locale, true);
    updateMetaTag('og:image:secure_url', image, true);

    // Twitter tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:url', url);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', image);
    updateMetaTag('twitter:image:alt', title);
    updateMetaTag('twitter:image:width', '1200');
    updateMetaTag('twitter:image:height', '630');
    updateMetaTag('twitter:site', '@truefarming');
    updateMetaTag('twitter:creator', '@truefarming');

    // Canonical URL
    updateLinkTag('canonical', url);

  }, [title, description, url, image, keywords, locale]);

  return null;
}
