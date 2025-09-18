import Head from 'next/head';

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
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:site_name" content="True Farming" />
      <meta property="og:locale" content={locale} />
      <meta property="og:image:secure_url" content={image} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:image:width" content="1200" />
      <meta name="twitter:image:height" content="630" />
      <meta name="twitter:site" content="@truefarming" />
      <meta name="twitter:creator" content="@truefarming" />
      
      {/* Additional meta tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="True Farming" />
      <meta name="theme-color" content="#0f172a" />
      <meta name="msapplication-TileColor" content="#0f172a" />
      <link rel="canonical" href={url} />
    </Head>
  );
}
