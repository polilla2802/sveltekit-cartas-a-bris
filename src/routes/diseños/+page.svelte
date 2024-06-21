<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import {
    getTypeEnumByTypeId,
    getFrameStringByTypeEnum,
  } from "$lib/enums/frames";
  import { onMount } from "svelte";
  import { formatToEST } from "$utils/getESTTime";
  import { sortFrames } from "$utils/sortFrames";
  import { isNew } from "$utils/isNew";

  const baseUrl: string = $page.url.origin;
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

<h1 class="text-center md:text-left md:pl-5">{helloWorld}</h1>
<h2 class="text-center md:text-left md:pl-5">De tu novio {novio}</h2>

{#if sortedDesigns !== undefined && sortedDesigns.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each sortedDesigns as design}
      <!-- Map frames to display images -->
      <div class="flex flex-col items-center relative">
        <!-- Check if the frame is new and conditionally render "Nuevo!" -->
        {#if isNew(design.createdAt)}
          <img
            class="w-20 absolute new-logo"
            src={"/images/new-styled.png"}
            alt="new"
          />
        {/if}
        <a href={baseUrl + "/diseños/" + design.id}
          ><img class="w-full h-auto" src={design.url} alt="Design" /></a
        >
        {#if design.user}
          <p class="text-center">Autor: <b>{design.user.userName}</b></p>
        {:else}
          <div>
            <p class="text-center">Autor: <b>Desconocido</b></p>
          </div>
        {/if}
        <p class="text-center">Nombre: <b><i>"{design.name}"</i></b></p>
        {#if design.frame_types}
          <p class="text-center">
            Tipo de Diseño: <span class="text-blue-500 underline"
              >{design.frame_types.type}</span
            >
          </p>
        {/if}
        <p class="text-center">Creado: {formatToEST(design.createdAt)}</p>
      </div>
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}
