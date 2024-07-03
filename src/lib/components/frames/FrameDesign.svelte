<script lang="ts">
  import { formatToEST } from "$utils/getESTTime";
  import { FrameTypes, getQRCode, qrCodeLoading } from "$utils/getQRcode";
  import { isNew } from "$utils/isNew";
  import { onMount } from "svelte";
  export let data;
  export let baseUrl: string;
  export let designId: string = "";
  export let isSingle: boolean = false;
  let qrCode: Promise<string>;

  // Optional: If you need to perform any action on mount
  onMount(() => {
    // console.log(data);
    qrCode = getQRCode(baseUrl, designId, FrameTypes.designs);
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
        ><img
          class="w-full h-auto"
          src={data.url}
          alt="Frame"
          loading="lazy"
        /></a
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
    <a href={baseUrl + "/diseños/" + data.id}
      ><img
        class="w-full h-auto"
        src={data.url}
        alt="Design"
        loading="lazy"
      /></a
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
  {#if data.frame_types}
    <p class="text-center">
      Tipo de Diseño: <span class="text-blue-500 underline"
        >{data.frame_types.type}</span
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
  {:then qrCode}
    {#if qrCode}
      <div class="qr-container">
        <a href={qrCode} class="frame-link">
          <img src={qrCode} alt="QR code" />
        </a>
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if}
