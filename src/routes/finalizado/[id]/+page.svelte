<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";

  // Use the `$page` store to get the data returned by the load function
  const { frameFinalized } = $page.data.frameFinalized;
  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;
  // Extract the `designId` from URL parameters
  let finalizedId: string = $page.params.id;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameFinalized);
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section>
  {#await $page.data.frameFinalized}
    <!-- Render a loader while fetching data -->
    <p class="text-center text-gray-500 mt-4">Loading frames...</p>
  {:then data}
    {#if data.error}
      <!-- Render an error message if there is an error -->
      <p class="text-center text-red-500 mt-4">{data.error}</p>
    {:else if data}
      <Welcome title={data.frameFinalized.name}></Welcome>
      <div class="frame-single-container">
        <FrameFinalized
          data={data.frameFinalized}
          {baseUrl}
          isSingle={true}
          {finalizedId}
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

<style>

.frame-single-container{
    margin-top: -80px;
  }

/* 2xl */
@media only screen and (max-width: 1536px) {
  .frame-single-container{
    margin-top: -60px;
  }
}

/* xl */
@media only screen and (max-width: 1280px) {
  .frame-single-container{
    margin-top: -40px;
  }
}

/* lg */
@media only screen and (max-width: 1024px) {
  .frame-single-container{
    margin-top: -30px;
  }
}

/* md */
@media only screen and (max-width: 768px) {
  .frame-single-container{
    margin-top: -50px;
  }
}

</style>
