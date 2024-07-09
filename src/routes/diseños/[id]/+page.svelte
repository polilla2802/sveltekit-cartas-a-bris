<script lang="ts">
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import Icon from "@iconify/svelte";

  // Use the `$page` store to get the data returned by the load function
  const { frameDesign } = $page.data.frameDesign;
  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;
  // Extract the `designId` from URL parameters
  let designId: string = $page.params.id;

  let notVisible: boolean;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameDesign);
    if (frameDesign.isPublic == false) {
      notVisible = true;
    }
  });
</script>

<section>
  {#await $page.data.frameDesign}
    <!-- Render a loader while fetching data -->
    <p class="text-center text-gray-500 mt-4">Loading frames...</p>
  {:then data}
    {#if data.error}
      <!-- Render an error message if there is an error -->
      <p class="text-center text-red-500 mt-4">{data.error}</p>
    {:else if notVisible}
      <Welcome title={"Lo siento, no tienes acceso para ver esta carta"}
      ></Welcome>
      <div class="invalid-container">
        <Icon
          icon="bi:envelope-exclamation"
          color="#2f4858"
          width="100"
          height="100"
          opacity="1"
        />
      </div>
    {:else if data}
      <Welcome title={data.frameDesign.name}></Welcome>
      <div class="frame-single-container">
        <FrameDesign
          data={data.frameDesign}
          {baseUrl}
          isSingle={true}
          {designId}
        />
      </div>
    {:else}
      <!-- Render a message if frames is undefined or empty -->
      <p class="text-center text-gray-500 mt-4">No frame design available.</p>
    {/if}
  {:catch error}
    <!-- This block should rarely be reached if we handle errors properly in load -->
    <p class="text-center text-red-500 mt-4">
      Unexpected error. Please try again later.
    </p>
  {/await}
</section>
