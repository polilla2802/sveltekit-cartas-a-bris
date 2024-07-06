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
          class="absolute new-logo-single"
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
      <img class="absolute new-logo" src={"/images/new-styled.png"} alt="new" />
    {/if}

    <a href={baseUrl + "/finalizado/" + data.id}
      ><img class="w-full h-auto" src={data.url} alt="Frame" /></a
    >
  {/if}
  <p class="text-center mt-2">Nombre:</p>
  <b class="mb-3 text-center"><i>"{data.name}"</i></b>
  {#if data.userCreator}
    <p class="text-center">Autor: <b>{data.userCreator.userName}</b></p>
  {:else}
    <div>
      <p class="text-center">Autor: <b>Desconocido</b></p>
    </div>
  {/if}
  {#if data.userFor}
    <p class="text-center">Para: <b>{data.userFor.userName}</b></p>
  {/if}
  {#if data.frame_designs}
    <p class="text-center">
      Diseño: <a
        href={baseUrl + "/diseños/" + data.frame_designs.id}
        class="text-blue-500 underline">{data.frame_designs.name}</a
      >
    </p>
  {/if}
  <b>{formatToEST(data.createdAt)}</b>
</div>
{#if isSingle}
  {#await qrCode}
    <div class="qr-container-loading">
      <img src={qrCodeLoading} alt="Loading QR code..." />
    </div>
  {:then qrCode}
    {#if qrCode}
      <div class="qr-container">
        <a href={qrCode} class="frame-link">
          <img src={qrCode} alt="QR code" />
        </a>
      </div>
    {/if}
  {:catch error}
    <p class="text-center text-red-500">Error: {error.message}</p>
  {/await}
{/if}
