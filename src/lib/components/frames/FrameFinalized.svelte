<script lang="ts">
  import { formatToEST } from "$utils/getESTTime";
  import { FrameTypes, getQRCode, qrCodeLoading } from "$utils/getQRcode";
  import { isNew } from "$utils/isNew";
  import { onMount } from "svelte";
  export let data;
  export let baseUrl: string;
  export let finalizedId: string = "";
  export let isSingle: boolean = false;
  let qrCode: Promise<string>;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    qrCode = getQRCode(baseUrl, finalizedId, FrameTypes.finalized);
  });
</script>

<!-- Map frames to display images -->
<div class="flex flex-col items-center relative">
  {#if isSingle}
  <div class="w-full xs:w-2/4 md:w-3/4 lg:w-2/4 xl:w-2/6 relative">
    <!-- Check if the frame is new and conditionally render "Nuevo!" -->
    {#if isNew(data.createdAt)}
      <img
        class="w-20 md:w-28 absolute new-logo-single"
        src={"/images/new-styled.png"}
        alt="new"
      />
    {/if}

    <a href={data.url} class="frame-link"
      ><img class="w-full h-auto" src={data.url} alt="Frame" /></a
    >
    </div>
  {:else}
    {#if isNew(data.createdAt)}
      <img
        class="w-20 absolute new-logo"
        src={"/images/new-styled.png"}
        alt="new"
      />
    {/if}

    <a class="mb-1" href={baseUrl + "/finalizado/" + data.id}
      ><img class="w-full h-auto" src={data.url} alt="Frame" /></a
    >
  {/if}
  {#if data.user}
    <p class="text-center">Autor: <b>{data.user.userName}</b></p>
  {:else}
    <div>
      <p class="text-center">Autor: <b>Desconocido</b></p>
    </div>
  {/if}
  <p class="text-center">Nombre: <b><i>"{data.name}"</i></b></p>
  {#if data.frame_designs}
    <p class="text-center">
      Diseño: <a
        href={baseUrl + "/diseños/" + data.frame_designs.id}
        class="text-blue-500 underline">{data.frame_designs.name}</a
      >
    </p>
  {/if}
  <p class="text-center">Creado: {formatToEST(data.createdAt)}</p>
</div>
{#if isSingle}
  {#await qrCode}
    <div class="qr-container-loading">
      <img src={qrCodeLoading} alt="QR code" />
    </div>
  {:then string}
    <div class="qr-container">
      <a href={string} class="frame-link">
        <img src={string} alt="QR code" />
      </a>
    </div>
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if}
