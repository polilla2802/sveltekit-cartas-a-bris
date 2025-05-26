<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import type { FrameFinalizedData } from "$lib/types/frame";
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  export let data: FrameFinalizedData;
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

<Welcome {title}></Welcome>

{#if loading}
  <!-- Render a loader while fetching data -->
  <p class="mt-4 text-center text-gray-500">Cargando cartas...</p>
{:else if data.finalizedFrames}
  <div class="grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 lg:grid-cols-5">
    {#each data.finalizedFrames as frameFinalized}
      <FrameFinalized data={frameFinalized} {baseUrl} isSingle={false} />
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
