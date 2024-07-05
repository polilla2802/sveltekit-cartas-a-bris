<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";

  const baseUrl: string = $page.url.origin;
  // Use the `$page` store to get the data returned by the load function
  const { sortedDesigns } = $page.data;

  onMount(() => {
    console.log("Component has mounted", sortedDesigns);
  });
</script>

{#await $page.data}
  <!-- Render a loader while fetching data -->
  <p class="text-center text-gray-500 mt-4">Loading frames...</p>
{:then data}
  {#if data.error}
    <!-- Render an error message if there is an error -->
    <p class="text-center text-red-500 mt-4">{data.error}</p>
  {:else if data.sortedDesigns && data.sortedDesigns.length > 0}
    <!-- Render frames if frames is defined and not empty -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {#each data.sortedDesigns as design}
        <FrameDesign data={design} {baseUrl} isSingle={false} />
      {/each}
    </div>
  {:else}
    <!-- Render a message if frames is undefined or empty -->
    <p class="text-center text-gray-500 mt-4">No frames available.</p>
  {/if}
{:catch error}
  <!-- This block should rarely be reached if we handle errors properly in load -->
  <p class="text-center text-red-500 mt-4">
    Unexpected error. Please try again later.
  </p>
{/await}
