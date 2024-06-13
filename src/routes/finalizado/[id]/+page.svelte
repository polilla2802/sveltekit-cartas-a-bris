<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import { formatDate } from "../../../utils/getDate";
  const baseUrl: string = $page.url.origin;

  // Use the `$page` store to get the data returned by the load function
  const { frameFinalized } = $page.data.frameFinalized;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    console.log("Component has mounted", frameFinalized);
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section class="pb-10">
  {#if frameFinalized}
    <!-- Map frames to display images -->
    <div class="flex flex-col items-center self-center">
      <div class="w-2/6">
        <a href={frameFinalized.url} target="_blank" class="frame-link"
          ><img class="w-full h-auto" src={frameFinalized.url} alt="Frame" /></a
        >
      </div>
      {#if frameFinalized.User}
        <p>Autor: <b>{frameFinalized.User.userName}</b></p>
      {:else}
        <div>
          <p>Autor: <b>Desconocido</b></p>
        </div>
      {/if}
      <p>Nombre: <b><i>"{frameFinalized.name}"</i></b></p>
      {#if frameFinalized.frame_designs}
        <p>
          Diseño: <a
            href={baseUrl + "/diseños/" + frameFinalized.frame_designs.id}
            target="_blank"
            class="text-blue-500 underline"
            >{frameFinalized.frame_designs.name}</a
          >
        </p>
      {/if}
      <p>Creado: {formatDate(frameFinalized.createdAt)}</p>
    </div>
  {/if}
</section>

<style>
</style>
