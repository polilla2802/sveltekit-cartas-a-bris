<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import { sortFrames } from "$utils/sortFrames";
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";

  const baseUrl: string = $page.url.origin;

  let designs: any = [];
  let sortedDesigns: any = [];

  async function getFrameDesigns() {
    try {
      const response = await fetch("/api/frames/designs");
      let data = await response.json();
      designs = data.framesDesigns;
      // Sort frames by createdAt field
      sortedDesigns = sortFrames(designs);
    } catch (error) {
      console.log(error);
    }
  }

  onMount(() => {
    getFrameDesigns();
  });
</script>

{#if sortedDesigns !== undefined && sortedDesigns.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each sortedDesigns as design}
      <FrameDesign data={design} {baseUrl} isSingle={false} />
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}
