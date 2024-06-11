<script lang="ts">
  import {
    getTypeEnumByTypeId,
    getFrameStringByTypeEnum,
  } from "$lib/enums/frames";
  import { onMount } from "svelte";
  import { formatDate } from "../utils/getDate";
  import { sortFrames } from "../utils/sortFrames";

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
        <a href={frame.url} target="_blank"
          ><img class="w-full h-auto" src={frame.url} alt="Frame" /></a
        >
        <p>Nombre: <b><i>"{frame.name}"</i></b></p>
        {#if frame.frame_designs}
          <p>
            Tipo de Diseño: <a
              href={frame.frame_designs.url}
              target="_blank"
              class="text-blue-500 underline"
              >{getFrameStringByTypeEnum(
                getTypeEnumByTypeId(frame.frame_designs.typeId)
              )}</a
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
