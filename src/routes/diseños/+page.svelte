<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import type { FrameDesignsData } from "$lib/types/frame";
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  export let data: FrameDesignsData;
  const baseUrl: string = $page.url.origin;
  const title: string = "Diseños";
  let loading = true;

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

<Welcome {title}></Welcome>

{#if loading}
  <!-- Render a loader while fetching data -->
  <p class="mt-4 text-center text-gray-500">Cargando cartas...</p>
{:else if data.frameDesigns}
  <div class="grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 lg:grid-cols-5">
    {#each data.frameDesigns as frameDesign}
      <FrameDesign {frameDesign} {baseUrl} isSingle={false} qrCode={null} />
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
