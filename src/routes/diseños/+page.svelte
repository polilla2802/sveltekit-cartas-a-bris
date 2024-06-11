<script lang="ts">
  import {
    getTypeEnumByTypeId,
    getFrameStringByTypeEnum,
  } from "$lib/enums/frames";
  import { onMount } from "svelte";
  import { formatDate } from "../../utils/getDate";
  import { sortFrames } from "../../utils/sortFrames";

  let helloWorld = "Cartas a Bris <3";
  let novio = "Jose";
  let designs: any = [];
  let sortedDesigns: any = [];

  async function getFrameDesigns() {
    try {
      const response = await fetch("/api/frames/designs");
      let data = await response.json();
      designs = data.framesDesigns;
      // Sort frames by createdAt field
      sortedDesigns = sortFrames(designs);
    } catch (error) {
      console.log(error);
    }
  }

  onMount(() => {
    getFrameDesigns();
  });
</script>

<h1>{helloWorld}</h1>
<h2>De tu novio {novio}</h2>

{#if sortedDesigns !== undefined && sortedDesigns.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each sortedDesigns as design}
      <!-- Map frames to display images -->
      <div class="flex flex-col items-center">
        <a href={design.url} target="_blank"
          ><img class="w-full h-auto" src={design.url} alt="Design" /></a
        >
        <p>Nombre: <b><i>"{design.name}"</i></b></p>
        {#if design.frame_types}
          <p>
            Tipo de Diseño: <a
              href={design.frame_types.type}
              target="_blank"
              class="text-blue-500 underline"
              >{getFrameStringByTypeEnum(
                getTypeEnumByTypeId(design.frame_types.id)
              )}</a
            >
          </p>
        {/if}
        <p>Creado: {formatDate(design.createdAt)}</p>
      </div>
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}
