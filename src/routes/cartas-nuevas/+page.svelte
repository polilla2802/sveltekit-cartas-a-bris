<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase/firebase";
  import type { User } from "firebase/auth";
  import FrameFinalized from "$lib/components/frames/FrameFinalized.svelte";
  import { getUserByUid } from "$utils/getUserByUid";
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import { isNew } from "$utils/isNew";
  import type {
    FramesFinalizedData,
    FrameFinalized as FinalFrame,
  } from "$lib/types/frame";

  const title: string = "Cartas Nuevas";
  let currentUser: User | null = null; // Initialize currentUser to null
  const baseUrl: string = $page.url.origin;
  let sortedFinalized: FinalFrame[] = [];
  let loading: boolean = true; // Start with loading set to true
  let error: string | undefined; // Define error as string or undefined
  let userData: any;
  let newFramesCount: number = 0;

  async function getFrames() {
    console.log(currentUser!.uid);

    userData = await getUserByUid(currentUser!.uid);

    try {
      const response = await fetch(
        `/api/frames/created-for/${userData.user.id}`
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch Frames Finalized, check user if exists`
        );
      }

      const framesFinalizedData: FramesFinalizedData = await response.json();

      sortedFinalized = framesFinalizedData.framesFinalized.sort(
        (a: FinalFrame, b: FinalFrame) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );
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

  // Reactive statement to count new frames
  $: newFramesCount = sortedFinalized.filter((frame: any) =>
    isNew(frame.createdAt)
  ).length;
</script>

<Welcome {title}></Welcome>

{#if currentUser == null}
  <p>Inicia Sesión para ver tus cartas</p>
{:else if loading}
  <p>Cargando Cartas...</p>
{:else if sortedFinalized && sortedFinalized.length > 0}
  <!-- TODO:Render a grid col 1 if there is only one new Frame -->
  <!-- Render frames if frames is defined and not empty -->
  <div class="grid grid-cols-2 gap-4 pt-4 md:grid-cols-3 lg:grid-cols-5">
    {#each sortedFinalized as frameFinalized}
      {#if isNew(frameFinalized.createdAt)}
        <FrameFinalized
          {frameFinalized}
          {baseUrl}
          isSingle={false}
          qrCode={null}
        />
      {/if}
    {/each}
  </div>
  {#if newFramesCount === 0}
    <p class="text-center text-gray-500">No hay cartas nuevas</p>
  {/if}
{:else if error}
  <p class="text-center text-red-500">{error}</p>
{:else}
  <p class="mt-4 text-center text-gray-500">No hay cartas disponibles</p>
{/if}
