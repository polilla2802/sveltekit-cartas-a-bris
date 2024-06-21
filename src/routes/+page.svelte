<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit

  import { onMount } from "svelte";
  import { formatToEST } from "$utils/getESTTime";
  import { sortFrames } from "$utils/sortFrames";

  const baseUrl: string = $page.url.origin;
  let helloWorld = "Cartas a Bris <3";
  let novio = "Jose";

  let frames: any = [];
  let sortedFrames: any = [];

  async function getFrames() {
    try {
      const response = await fetch("/api/frames/finalized");
      let data = await response.json();
      frames = data.framesFinalized;

      sortedFrames = sortFrames(frames);
    } catch (error) {
      console.log(error);
    }
  }

  function isNew(date: string): boolean {
    const frameDate = new Date(date);
    const currentDate = new Date();
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds

    // Check if the frame is less than or equal to one week old
    return currentDate.getTime() - frameDate.getTime() <= oneWeek;
  }

  onMount(() => {
    getFrames();
  });
</script>

<h1 class="text-center md:text-left md:pl-5">{helloWorld}</h1>
<h2 class="text-center md:text-left md:pl-5">De tu novio {novio}</h2>

{#if sortedFrames !== undefined && sortedFrames.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each sortedFrames as frame}
      <!-- Map frames to display images -->
      <div class="flex flex-col items-center relative">
        <!-- Check if the frame is new and conditionally render "Nuevo!" -->
        {#if isNew(frame.createdAt)}
          <img
            class="w-20 absolute new-logo"
            src={"/images/new-styled.png"}
            alt="new"
          />
        {/if}
        <a href={baseUrl + "/finalizado/" + frame.id}
          ><img class="w-full h-auto" src={frame.url} alt="Frame" /></a
        >
        {#if frame.user}
          <p class="text-center">Autor: <b>{frame.user.userName}</b></p>
        {:else}
          <div>
            <p class="text-center">Autor: <b>Desconocido</b></p>
          </div>
        {/if}
        <p class="text-center">Nombre: <b><i>"{frame.name}"</i></b></p>
        {#if frame.frame_designs}
          <p class="text-center">
            Diseño: <a
              href={baseUrl + "/diseños/" + frame.frame_designs.id}
              class="text-blue-500 underline">{frame.frame_designs.name}</a
            >
          </p>
        {/if}
        <p class="text-center">Creado: {formatToEST(frame.createdAt)}</p>
      </div>
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}

<style>
  .new-logo {
    top: -15px;
    left: -15px;
  }
</style>
