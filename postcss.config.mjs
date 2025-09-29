// Use classic postcss to avoid lightningcss native binding issues in Vercel
const purgecss = require('@fullhuman/postcss-purgecss');

const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' && {
      purgecss: purgecss({
        content: [
          './src/**/*.{js,ts,jsx,tsx,mdx}',
          './app/**/*.{js,ts,jsx,tsx,mdx}',
          './pages/**/*.{js,ts,jsx,tsx,mdx}',
          './components/**/*.{js,ts,jsx,tsx,mdx}',
        ],
        defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
        safelist: [
          // Mantener clases dinámicas y de animación
          /^animate-/,
          /^fade-/,
          /^slide-/,
          /^scale-/,
          /^rotate-/,
          /^translate-/,
          /^opacity-/,
          /^duration-/,
          /^delay-/,
          /^ease-/,
          // Mantener clases de estado
          /^hover:/,
          /^focus:/,
          /^active:/,
          /^group-hover:/,
          /^group-focus:/,
          // Mantener clases de responsive
          /^sm:/,
          /^md:/,
          /^lg:/,
          /^xl:/,
          /^2xl:/,
          // Mantener clases de dark mode
          /^dark:/,
          // Mantener variables CSS
          /^--/,
          // Mantener clases de Tailwind que podrían ser generadas dinámicamente
          'bg-gradient-to-r',
          'bg-gradient-to-l',
          'bg-gradient-to-t',
          'bg-gradient-to-b',
          'bg-gradient-to-tr',
          'bg-gradient-to-tl',
          'bg-gradient-to-br',
          'bg-gradient-to-bl',
        ],
        // Variables CSS que deben mantenerse
        variables: true,
      }),
    }),
  },
};

export default config;
