// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // Extending Locals to include user property
    interface Locals {
      user: User | null;
    }
  }
}

export {};
