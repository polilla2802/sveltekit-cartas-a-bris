<script lang="ts">
  import {
    getTypeEnumByTypeId,
    getFrameStringByTypeEnum,
    frameTypeEnum,
  } from "$lib/enums/frames";
  import { onMount } from "svelte";

  let helloWorld = "Cartas a Bris <3";
  let novio = "Jose";

  let frames: any = [];

  let myFrameType: frameTypeEnum;

  async function getFrames() {
    try {
      const response = await fetch("/api/frames/finalized");
      let data = await response.json();
      frames = data.framesFinalized;
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

{#if frames !== undefined && frames.length > 0}
  <!-- Render frames if frames is defined and not empty -->
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4"
  >
    {#each frames as frame}
      <!-- Map frames to display images -->
      <div class="flex flex-col items-center">
        <a href={frame.url} target="_blank"
          ><img class="w-full h-auto" src={frame.url} alt="Frame" /></a
        >
        {#if frame.frame_designs}
          <p>
            Design Type: <a
              href={frame.frame_designs.url}
              target="_blank"
              class="text-blue-500 underline"
              >{getFrameStringByTypeEnum(
                getTypeEnumByTypeId(frame.frame_designs.typeId)
              )}</a
            >
          </p>
        {/if}
      </div>
    {/each}
  </div>
{:else}
  <!-- Render a message if frames is undefined or empty -->
  <p class="text-center text-gray-500 mt-4">No frames available.</p>
{/if}
