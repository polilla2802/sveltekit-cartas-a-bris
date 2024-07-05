<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";

  const baseUrl: string = $page.url.origin;
  const { framesFinalized } = $page.data;

  onMount(() => {
    console.log("Component has mounted", framesFinalized);
  });
</script>

{#await $page.data}
  <!-- Render a loader while fetching data -->
  <p class="text-center text-gray-500 mt-4">Cargando carta...</p>
{:then data}
  {#if data.error}
    <!-- Render an error message if there is an error -->
    <p class="text-center text-red-500 mt-4">{data.error}</p>
  {:else if data.framesFinalized}
    <!-- Render frames if frames is defined and not empty -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {#each data.framesFinalized as frameFinalized}
        <FrameFinalized data={frameFinalized} {baseUrl} isSingle={false} />
      {/each}
    </div>
  {:else}
    <!-- Render a message if frames is undefined or empty -->
    <p class="text-center text-gray-500 mt-4">No hay cartas disponibles</p>
  {/if}
{:catch error}
  <!-- This block should rarely be reached if we handle errors properly in load -->
  <p class="text-center text-red-500 mt-4">
    Hubo un error, intentalo más tarde
  </p>
{/await}
