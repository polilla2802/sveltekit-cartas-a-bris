<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import { sortFrames } from "$utils/sortFrames";
  import { getUserByUid } from "$utils/getUserByUid";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import FrameDesign from "$lib/components/frames/FrameDesign.svelte";

  const title: string = "Mis Diseños";

  let currentUser: User | null = null; // Initialize currentUser to null

  const baseUrl: string = $page.url.origin;

  let designs: any = [];
  let sortedDesigns: any = [];

  let loading: boolean = true; // Start with loading set to true

  let error: string | undefined; // Define error as string or undefined

  let userData;

  async function getFrames() {
    console.log(currentUser!.uid);

    userData = await getUserByUid(currentUser!.uid);

    try {
      const response = await fetch(`/api/users/designs/${userData.user.id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch Frame Designs, check user if exists`);
      }

      const data = await response.json();
      designs = data.frameDesigns;
      // Sort frames by createdAt field
      sortedDesigns = sortFrames(designs);
    } catch (e) {
      error = e as string;
      console.log(e);
    } finally {
      loading = false; // Ensure loading is set to false after attempt to fetch frames
    }
  }

  onMount(async () => {
    auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        currentUser = authUser;
        console.log("User is signed in:", currentUser);
        if (currentUser != null) {
          await getFrames();
        } else {
          // If the user is not authenticated, you might want to handle it here
          console.log("User is not authenticated");
        }
      } else {
        console.log("No user signed in");
      }
    });
  });
</script>

<Welcome {title}></Welcome>

{#if currentUser == null}
  <p>Inicia Sesión para ver tus diseños</p>
{:else if loading}
  <p>Cargando Diseños...</p>
{:else if sortedDesigns && sortedDesigns.length > 0}
  <!-- TODO:Render a grid col 1 if there is only one new Frame -->
  <!-- Render frames if frames is defined and not empty -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
    {#each sortedDesigns as design}
      <FrameDesign data={design} {baseUrl} isSingle={false} />
    {/each}
  </div>
{:else if error}
  <p class="text-center text-red-500">{error}</p>
{:else}
  <p class="text-center text-gray-500 mt-4">No hay cartas disponibles</p>
{/if}
