<script lang="ts">
  import { formatToEST } from "$utils/getESTTime";
  import { isNew } from "$utils/isNew";

  // Define your prop types
  interface FrameProps {
    data: any;
    baseUrl: string;
    designId?: string; // Make designId optional by adding ?
    isSingle: boolean;
  }

  // Use the interface to type your component props
  export let props: FrameProps;
</script>

<!-- Map frames to display images -->
<div class="flex flex-col items-center relative">
  <!-- Check if the frame is new and conditionally render "Nuevo!" -->
  {#if isNew(props.data.createdAt)}
    <img
      class="w-20 absolute new-logo"
      src={"/images/new-styled.png"}
      alt="new"
    />
  {/if}
  <a href={props.baseUrl + "/diseños/" + props.data.id}
    ><img class="w-full h-auto" src={props.data.url} alt="Design" /></a
  >
  {#if props.data.user}
    <p class="text-center">Autor: <b>{props.data.user.userName}</b></p>
  {:else}
    <div>
      <p class="text-center">Autor: <b>Desconocido</b></p>
    </div>
  {/if}
  <p class="text-center">Nombre: <b><i>"{props.data.name}"</i></b></p>
  {#if props.data.frame_types}
    <p class="text-center">
      Tipo de Diseño: <span class="text-blue-500 underline"
        >{props.data.frame_types.type}</span
      >
    </p>
  {/if}
  <p class="text-center">Creado: {formatToEST(props.data.createdAt)}</p>
</div>

<style>
</style>
