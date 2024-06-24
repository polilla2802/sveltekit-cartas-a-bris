<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";

  // Use the `$page` store to get the data returned by the load function
  const { frameFinalized } = $page.data.frameFinalized;

  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;

  // Extract the `designId` from URL parameters
  let designId: string = $page.params.id;


  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameFinalized);
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section class="pb-10">
  {#if frameFinalized}
  <FrameFinalized data={frameFinalized} {baseUrl} isSingle={true} designId={designId}/>
   
  {/if}
</section>

