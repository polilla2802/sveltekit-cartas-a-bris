import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import * as dotenv from "dotenv";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

// Get the port from the environment variables, default to 8000 if not set
const port = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;

export default defineConfig({
  define: {
    "process.env.VITE_FIREBASE_API_KEY": JSON.stringify(
      process.env.VITE_FIREBASE_API_KEY
    ),
    "process.env.VITE_FIREBASE_AUTH_DOMAIN": JSON.stringify(
      process.env.VITE_FIREBASE_AUTH_DOMAIN
    ),
    "process.env.VITE_FIREBASE_PROJECT_ID": JSON.stringify(
      process.env.VITE_FIREBASE_PROJECT_ID
    ),
    "process.env.VITE_FIREBASE_STORAGE_BUCKET": JSON.stringify(
      process.env.VITE_FIREBASE_STORAGE_BUCKET
    ),
    "process.env.VITE_FIREBASE_MESSAGING_SENDER_ID": JSON.stringify(
      process.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    ),
    "process.env.VITE_FIREBASE_APP_ID": JSON.stringify(
      process.env.VITE_FIREBASE_APP_ID
    ),
  },
  plugins: [sveltekit()],
  server: {
    port: port,
  },
  preview: {
    port: port,
  },
});
