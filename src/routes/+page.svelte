<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";

  import { onMount } from "svelte";
  import { sortFrames } from "$utils/sortFrames";

  const baseUrl: string = $page.url.origin;

  let frames: any = [];
  let sortedFrames: any = [];

  async function getFrames() {
    try {
      const response = await fetch("/api/frames/finalized");
      let data = await response.json();
      frames = data.framesFinalized;

      sortedFrames = sortFrames(frames);
    } catch (error) {
      console.log(error);
    }
  }

  onMount(() => {
    getFrames();
  });
</script>

{#if sortedFrames !== undefined && sortedFrames.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each sortedFrames as frame}
      <FrameFinalized data={frame} {baseUrl} isSingle={false}/>
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}
