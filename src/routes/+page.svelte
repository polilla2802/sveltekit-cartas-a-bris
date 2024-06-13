<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit

  import {
    getTypeEnumByTypeId,
    getFrameStringByTypeEnum,
  } from "$lib/enums/frames";
  import { onMount } from "svelte";
  import { formatDate } from "../utils/getDate";
  import { sortFrames } from "../utils/sortFrames";

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

  onMount(() => {
    getFrames();
  });
</script>

<h1>{helloWorld}</h1>
<h2>De tu novio {novio}</h2>

{#if sortedFrames !== undefined && sortedFrames.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each sortedFrames as frame}
      <!-- Map frames to display images -->
      <div class="flex flex-col items-center">
        <a href={baseUrl + "/finalizado/" + frame.id} target="_blank"
          ><img class="w-full h-auto" src={frame.url} alt="Frame" /></a
        >
        {#if frame.User}
          <p>Autor: <b>{frame.User.userName}</b></p>
        {:else}
        <div>
          <p>Autor: <b>Desconocido</b></p>
        </div>
        {/if}
        <p>Nombre: <b><i>"{frame.name}"</i></b></p>
        {#if frame.frame_designs}
          <p>
            Diseño: <a
            href={baseUrl + "/diseños/" + frame.frame_designs.id}
              target="_blank"
              class="text-blue-500 underline"
              >{frame.frame_designs.name}</a
            >
          </p>
        {/if}
        <p>Creado: {formatDate(frame.createdAt)}</p>
      </div>
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}
