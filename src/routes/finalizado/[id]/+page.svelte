<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import Icon from "@iconify/svelte";
  import { getUserByUid } from "$utils/getUserByUid";

  let currentUser: User | null = null; // Initialize currentUser to null
  let userData: any;

  // Use the `$page` store to get the data returned by the load function
  const { frameFinalized } = $page.data.frameFinalized;
  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;
  // Extract the `designId` from URL parameters
  let finalizedId: string = $page.params.id;

  let notVisible: boolean = true;

  function checkYourFrame(userData: any, frameFinalized: any): boolean {
    console.log(userData.user.id);
    console.log(frameFinalized.createdFor);
    if (
      userData.user.id === frameFinalized.createdFor ||
      userData.user.id === frameFinalized.createdBy
    ) {
      return false;
    } else {
      return true;
    }
  }

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameFinalized);
    if (frameFinalized.isPublic == false) {
      auth.onAuthStateChanged(async (authUser) => {
        if (authUser) {
          currentUser = authUser;
          console.log("User is signed in:", currentUser);
          if (currentUser != null) {
            userData = await getUserByUid(currentUser!.uid);
            notVisible = checkYourFrame(userData, frameFinalized);
          } else {
            notVisible = true;
            // If the user is not authenticated, you might want to handle it here
            console.log("User is not authenticated");
          }
        } else {
          notVisible = true;
          console.log("No user signed in");
        }
      });
    } else {
      notVisible = false;
    }
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section>
  {#await $page.data.frameFinalized}
    <!-- Render a loader while fetching data -->
    <p class="text-center text-gray-500 mt-4">Cargando carta...</p>
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
      <p class="text-center text-gray-500 mt-4">Carta no disponible.</p>
    {/if}
  {:catch error}
    <!-- This block should rarely be reached if we handle errors properly in load -->
    <p class="text-center text-red-500 mt-4">
      Hubo un error, intentalo más tarde.
    </p>
  {/await}
</section>
