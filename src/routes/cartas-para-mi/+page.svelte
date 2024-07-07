<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import { sortFrames } from "$utils/sortFrames";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import { getUserByUid } from "$utils/getUserByUid";
  import Welcome from "$lib/components/messages/Welcome.svelte";

  const title: string = "Cartas para mi";

  let currentUser: User | null = null; // Initialize currentUser to null

  const baseUrl: string = $page.url.origin;

  let finalized: any = [];
  let sortedFinalized: any = [];

  let loading: boolean = true; // Start with loading set to true

  let error: string | undefined; // Define error as string or undefined

  let userData;

  async function getFrames() {
    console.log(currentUser!.uid);

    userData = await getUserByUid(currentUser!.uid);

    try {
      // TODO: get my letters from my userId stored in the user session
      const response = await fetch(
        `/api/frames/created-for/${userData.user.id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Frames Finalized, check user if exists`
        );
      }

      const data = await response.json();
      finalized = data.framesFinalized;
      // Sort frames by createdAt field
      sortedFinalized = sortFrames(finalized);
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
  <p>Inicia Sesión para ver tus cartas</p>
{:else if loading}
  <p>Cargando Cartas...</p>
{:else if sortedFinalized && sortedFinalized.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-4">
    {#each sortedFinalized as frame}
      <FrameFinalized data={frame} {baseUrl} isSingle={false} />
    {/each}
  </div>
{:else if error}
<p class="text-center text-red-500">{error}</p>
{:else}
  <p class="text-center text-gray-500 mt-4">No hay cartas disponibles</p>
{/if}
