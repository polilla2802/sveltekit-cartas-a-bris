<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import type { FramesFinalizedData } from "$lib/types/frame";
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  export let data: FramesFinalizedData;
  const baseUrl: string = $page.url.origin;
  const title: string = "Cartas";
  let loading = false;

  // Set up navigation event listeners
  beforeNavigate(() => {
    loading = true;
  });

  afterNavigate(() => {
    loading = false;
  });

  onMount(() => {
    console.log("Component has mounted", data);
  });
</script>

<svelte:head>
  <title>Cartas a Bris - Inicio</title>
  <meta
    name="description"
    content="Manda cartas personalizadas creadas para esa persona especial."
  />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Cartas a Bris - Inicio" />
  <meta
    property="og:description"
    content="Manda cartas personalizadas creadas para esa persona especial."
  />
  <meta
    property="og:image"
    content="https://www.cartasabris.com/logos/cartas-logo-pink.png"
  />
  <meta property="og:url" content={$page.url.href} />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Cartas a Bris - Inicio" />
  <meta
    name="twitter:description"
    content="Manda cartas personalizadas creadas para esa persona especial."
  />
  <meta
    name="twitter:image"
    content="https://www.cartasabris.com/logos/cartas-logo-pink.png"
  />
</svelte:head>

<Welcome {title}></Welcome>

{#if loading}
  <!-- Render a loader while fetching data -->
  <p class="mt-4 text-center text-gray-500">Cargando cartas...</p>
{:else if data.framesFinalized}
  <div class="grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 lg:grid-cols-5">
    {#each data.framesFinalized as frameFinalized}
      <FrameFinalized
        {frameFinalized}
        {baseUrl}
        isSingle={false}
        qrCode={null}
      />
    {/each}
  </div>
{:else if data.error}
  <!-- Render an error message if there is an error -->
  <p class="mt-4 text-center text-red-500">{data.error}</p>
  <!-- This block should rarely be reached if we handle errors properly in load -->
  <p class="mt-4 text-center text-red-500">
    Hubo un error, intentalo más tarde
  </p>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="mt-4 text-center text-gray-500">No hay cartas disponibles</p>
{/if}
