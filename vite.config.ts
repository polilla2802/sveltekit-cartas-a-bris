import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the port from the environment variables, default to 8000 if not set
const port = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    port: port,
  },
});
