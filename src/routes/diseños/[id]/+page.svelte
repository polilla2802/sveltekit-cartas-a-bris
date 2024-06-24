<script lang="ts">
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts

  // Use the `$page` store to get the data returned by the load function
  const { frameDesign } = $page.data.frameDesign;
  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;
  // Extract the `designId` from URL parameters
  let designId: string = $page.params.id;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameDesign);
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section class="pb-10">
  {#if frameDesign}
    <FrameDesign data={frameDesign} {baseUrl} isSingle={true} {designId} />
  {/if}
</section>

<style>
</style>
