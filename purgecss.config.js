module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  css: ['./src/app/globals.css'],
  output: './purged-css/',
  safelist: [
    // Mantener clases dinámicas
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
    // Mantener clases responsive
    /^sm:/,
    /^md:/,
    /^lg:/,
    /^xl:/,
    /^2xl:/,
    // Mantener clases de dark mode
    /^dark:/,
    // Mantener variables CSS
    /^--/,
    // Clases específicas de tu proyecto
    'animate-fade-in',
    'bg-gradient-to-r',
    'bg-gradient-to-l',
    'bg-gradient-to-t',
    'bg-gradient-to-b',
    'bg-gradient-to-tr',
    'bg-gradient-to-tl',
    'bg-gradient-to-br',
    'bg-gradient-to-bl',
  ],
  variables: true,
  keyframes: true,
  fontFace: true,
};
