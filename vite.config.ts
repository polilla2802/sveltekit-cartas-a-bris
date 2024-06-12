import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Get the port from the environment variables, default to 8000 if not set
const port = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;

export default defineConfig({
    plugins: [sveltekit()],
    server: {
      port: port,
    },
    preview: {
      port: port,
    },
});