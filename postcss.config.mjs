// Use classic postcss to avoid lightningcss native binding issues in Vercel
const config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
