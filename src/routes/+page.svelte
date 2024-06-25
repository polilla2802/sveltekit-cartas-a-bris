<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";

  const baseUrl: string = $page.url.origin;
  const { sortedFinalized } = $page.data;

  onMount(() => {
    console.log("Component has mounted", sortedFinalized);
  });
</script>

{#await $page.data}
  <!-- Render a loader while fetching data -->
  <p class="text-center text-gray-500 mt-4">Loading frames...</p>
{:then data}
  {#if data.error}
    <!-- Render an error message if there is an error -->
    <p class="text-center text-red-500 mt-4">{data.error}</p>
  {:else if data.sortedFinalized && data.sortedFinalized.length > 0}
    <!-- Render frames if frames is defined and not empty -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {#each data.sortedFinalized as frame}
        <FrameFinalized data={frame} {baseUrl} isSingle={false} />
      {/each}
    </div>
  {:else}
    <!-- Render a message if frames is undefined or empty -->
    <p class="text-center text-gray-500 mt-4">No frames available.</p>
  {/if}
{:catch error}
  <!-- This block should rarely be reached if we handle errors properly in load -->
  <p class="text-center text-red-500 mt-4">Unexpected error. Please try again later.</p>
{/await}

