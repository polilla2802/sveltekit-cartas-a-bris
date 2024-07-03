<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";

  const baseUrl: string = $page.url.origin;
  const { randomFrameOfTheDay } = $page.data;

  onMount(() => {
    console.log("Component has mounted", randomFrameOfTheDay);
  });
</script>

{#await $page.data}
  <!-- Render a loader while fetching data -->
  <p class="text-center text-gray-500 mt-4">Cargando carta...</p>
{:then data}
  {#if data.error}
    <!-- Render an error message if there is an error -->
    <p class="text-center text-red-500 mt-4">{data.error}</p>
  {:else if data.randomFrameOfTheDay}
    <!-- Render frames if frames is defined and not empty -->
    <FrameFinalized data={data.randomFrameOfTheDay} {baseUrl} isSingle={true} />
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
