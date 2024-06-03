import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables based on the mode
const envFile = `.env.${process.env.NODE_ENV}`;
dotenv.config({ path: resolve(__dirname, envFile) });

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