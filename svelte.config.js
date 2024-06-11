import adapter from "@sveltejs/adapter-auto";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      // Configura el adaptador según tus necesidades
      pages: 'build',
      assets: 'build',
      fallback: null // Utiliza 'index.html' si tu aplicación es una SPA
    }),
    csrf: {
      checkOrigin: false,
    },
    alias: {
      $lib: 'src/lib'
    }
  },
  preprocess: vitePreprocess(),
};

export default config;
