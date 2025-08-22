/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Convert modern color functions (like oklch) to supported formats
    '@csstools/postcss-color-function': {
      preserve: false, // Convert to supported formats
    },
    // Tailwind CSS plugin
    '@tailwindcss/postcss': {},
  },
};

export default config;
