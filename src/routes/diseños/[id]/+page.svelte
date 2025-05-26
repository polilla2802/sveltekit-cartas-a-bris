<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import { auth } from "$lib/firebase/firebase";
  import type { User } from "firebase/auth";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import { getUserByUid } from "$utils/getUserByUid";
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";
  import type {
    FrameDesign as FinalDesign,
    FrameDesignData,
  } from "$lib/types/frame";
  import { afterNavigate, beforeNavigate } from "$app/navigation";
  import Icon from "@iconify/svelte";

  export let data: FrameDesignData;
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

  function checkYourFrame(userData: any, frameDesign: FinalDesign): boolean {
    console.log(userData.user.id);
    console.log(frameDesign.createdBy);
    if (userData.user.id === frameDesign.createdBy) {
      return true;
    } else {
      return false;
    }
  }

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", data);
    if (data.frameDesign.isPublic == false) {
      auth.onAuthStateChanged(async (authUser) => {
        if (authUser) {
          currentUser = authUser;
          console.log("User is signed in:", currentUser);
          if (currentUser != null) {
            userData = await getUserByUid(currentUser!.uid);
            hasAccess = checkYourFrame(userData, data.frameDesign);
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
  });
</script>

<section>
  {#if loading || !accessChecked}
    <!-- Render a loader while fetching data -->
    <p class="mt-4 text-center text-gray-500">Cargando diseño...</p>
  {:else if !hasAccess}
    <!-- 🔒 Access Denied View -->
    <p class="mt-4 font-semibold text-center text-red-600">
      No tienes permiso para ver este diseño.
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
  {:else if data}
    <Welcome title={data.frameDesign.name}></Welcome>
    <div class="frame-single-container">
      <FrameDesign frameDesign={data.frameDesign} {baseUrl} isSingle={true} />
    </div>
  {/if}
</section>
