<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import { auth } from "$lib/firebase/firebase";
  import type { User } from "firebase/auth";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import Icon from "@iconify/svelte";
  import { getUserByUid } from "$utils/getUserByUid";
  import type {
    FrameFinalizedData,
    FrameFinalized as FinalFrame,
  } from "$lib/types/frame";
  import { afterNavigate, beforeNavigate } from "$app/navigation";

  export let data: FrameFinalizedData;
  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;
  let currentUser: User | null = null; // Initialize currentUser to null
  let userData: any;
  let hasAccess: boolean;
  let accessChecked = false;
  let loading = true;

  // Set up navigation event listeners
  beforeNavigate(() => {
    loading = true;
  });

  afterNavigate(() => {
    loading = false;
  });

  function checkYourFrame(userData: any, frameFinalized: FinalFrame): boolean {
    console.log(userData.user.id);
    console.log(frameFinalized.createdFor);
    if (
      userData.user.id === frameFinalized.createdFor ||
      userData.user.id === frameFinalized.createdBy
    ) {
      return true;
    } else {
      return false;
    }
  }

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", data);
    if (data.frameFinalized !== null) {
      if (data.frameFinalized.isPublic == false) {
        auth.onAuthStateChanged(async (authUser) => {
          if (authUser) {
            currentUser = authUser;
            console.log("User is signed in:", currentUser);
            if (currentUser != null) {
              userData = await getUserByUid(currentUser!.uid);
              hasAccess = checkYourFrame(userData, data.frameFinalized);
              accessChecked = true;
            } else {
              hasAccess = false;
              accessChecked = true;
              // If the user is not authenticated, you might want to handle it here
              console.log("User is not authenticated");
            }
          } else {
            hasAccess = false;
            accessChecked = true;
            console.log("No user signed in");
          }
        });
      } else {
        hasAccess = true;
        accessChecked = true;
      }
    } else {
      hasAccess = true;
      accessChecked = true;
      loading = false;
    }
  });
</script>

<section>
  {#if loading || !accessChecked}
    <!-- Render a loader while fetching data -->
    <p class="mt-4 text-center text-gray-500">Cargando diseño...</p>
  {:else if !hasAccess}
    <!-- 🔒 Access Denied View -->
    <p class="mt-4 font-semibold text-center text-red-600">
      No tienes permiso para ver esta carta.
    </p>
    <div class="invalid-container">
      <Icon
        icon="bi:envelope-exclamation"
        color="#2f4858"
        width="100"
        height="100"
        opacity="1"
      />
    </div>
  {:else if data.frameFinalized}
    {#if data.frameFinalized.trackId != null}
      <iframe
        title="Spotify Player"
        style="border-radius:12px;margin-bottom:15px;"
        src="https://open.spotify.com/embed/track/{data.frameFinalized
          .trackId}?utm_source=generator"
        width="100%"
        height="352"
        frameBorder="0"
        allowfullscreen
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    {/if}
    <Welcome title={data.frameFinalized.name}></Welcome>
    <div class="frame-single-container">
      <FrameFinalized
        frameFinalized={data.frameFinalized}
        {baseUrl}
        isSingle={true}
      />
    </div>
  {:else if data.error}
    <p class="mt-4 text-center text-red-500">{data.error}</p>
    <!-- This block should rarely be reached if we handle errors properly in load -->
    <p class="mt-4 text-center text-red-500">
      Hubo un error, intentalo más tarde
    </p>
  {:else}
    <p class="mt-4 text-center text-gray-500">La carta no esta disponible</p>
  {/if}
</section>
