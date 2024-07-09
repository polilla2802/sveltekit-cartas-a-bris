<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";

  const baseUrl: string = $page.url.origin;
  const { framesFinalized } = $page.data;

  const title: string = "Cartas";

  onMount(() => {
    console.log("Component has mounted", framesFinalized);
  });
</script>

<Welcome {title}></Welcome>

{#await $page.data}
  <!-- Render a loader while fetching data -->
  <p class="text-center text-gray-500 mt-4">Cargando carta...</p>
{:then data}
  {#if data.error}
    <!-- Render an error message if there is an error -->
    <p class="text-center text-red-500 mt-4">{data.error}</p>
  {:else if data.framesFinalized}
    <!-- TODO:Render a grid col 1 if there is only one new Frame -->
    <!-- Render frames if frames is defined and not empty -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
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
