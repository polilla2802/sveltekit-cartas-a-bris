import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, loadEnv } from "vite";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get the port from the environment variables, default to 8000 if not set
// const port = process.env.VITE_PORT ? parseInt(process.env.VITE_PORT) : 5173;


export default defineConfig(({ mode }) => {
  // Determine the appropriate env file to load based on the mode
  let env;
  if (mode === 'development') {
    env = loadEnv('dev', process.cwd(), '');
  } else if (mode === 'production') {
    env = loadEnv('prod', process.cwd(), '');
  } else {
    env = loadEnv(mode, process.cwd(), '');
  }

  // Ensure the port is a number
  const port = env.VITE_PORT ? parseInt(env.VITE_PORT, 10) : 5173;

  return {
    plugins: [sveltekit()],
    define: {
      'process.env': env,
    },
    server: {
      port: port,
    },
  };
});