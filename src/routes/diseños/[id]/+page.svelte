<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import {
    getFrameStringByTypeEnum,
    getTypeEnumByTypeId,
  } from "$lib/enums/frames";
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import { formatToEST } from "../../../utils/getESTTime";

  // Use the `$page` store to get the data returned by the load function
  const { frameDesign } = $page.data.frameDesign;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameDesign);
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section class="pb-10">
  {#if frameDesign}
    <!-- Map frames to display images -->
    <div class="flex flex-col items-center self-center">
      <div class="w-2/6">
        <a href={frameDesign.url} class="frame-link"
          ><img class="w-full h-auto" src={frameDesign.url} alt="Frame" /></a
        >
      </div>
      {#if frameDesign.User}
        <p>Autor: <b>{frameDesign.User.userName}</b></p>
      {:else}
        <div>
          <p>Autor: <b>Desconocido</b></p>
        </div>
      {/if}
      <p>Nombre: <b><i>"{frameDesign.name}"</i></b></p>
      {#if frameDesign.frame_types}
        <p>
          Tipo de Diseño: <a class="text-blue-500 underline"
            >{getFrameStringByTypeEnum(
              getTypeEnumByTypeId(frameDesign.frame_types.id)
            )}</a
          >
        </p>
      {/if}
      <p>Creado: {formatToEST(frameDesign.createdAt)}</p>
    </div>
  {/if}
</section>

<style>
</style>
