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

  let audio: HTMLAudioElement;

  function playSound(): void {
    audio = new Audio("/sounds/page-4.mp3");

    if (audio) {
      audio.currentTime = 0; // Reset audio to start
      audio.play();
    }
  }
  // Optional: If you need to perform any action on mount
  onMount(() => {
    // console.log(data);
    qrCode = getQRCode(baseUrl, designId, FrameTypes.designs);
  });
</script>

<!-- Map frames to display images -->
<div
  class="relative flex flex-col items-center mt-16 md:mt-20 lg:mt-16 xl:mt-24 2xl:mt-32"
>
  {#if isSingle}
    <div class="relative w-full xs:w-2/4 md:w-3/4 lg:w-2/4">
      <!-- Check if the frame is new and conditionally render "Nuevo!" -->
      {#if isNew(data.createdAt)}
        <img
          class="absolute new-logo-single"
          src={"/images/new-styled.png"}
          alt="new"
          loading="lazy"
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
    <a
      class="relative flex flex-col justify-end letter"
      on:click={playSound}
      href={baseUrl + "/diseños/" + data.id}
    >
      {#if isNew(data.createdAt)}
        <img
          class="absolute new-logo"
          src={"/images/new-styled.png"}
          alt="new"
          loading="lazy"
        />
      {/if}

      <div class="absolute bottom-0 half-image-vertical">
        <img class="w-full h-auto" src={data.url} alt="Design" loading="lazy" />
      </div>

      <img
        class="relative w-full h-auto"
        src="/images/carta-final.png"
        alt="Carta"
        loading="lazy"
      />
    </a>
  {/if}

  <p class="mt-2 text-center">Nombre:</p>
  <b class="mb-3 text-center"><i>"{data.name}"</i></b>
  {#if data.user}
    <p class="text-center">Autor: <b>{data.user.userName}</b></p>
  {:else}
    <div>
      <p class="text-center">Autor: <b>Desconocido</b></p>
    </div>
  {/if}
  {#if data.frame_types}
    <p class="text-center">Tipo de Diseño: <b>{data.frame_types.type}</b></p>
  {/if}
  <b>{formatToEST(data.createdAt)}</b>
</div>
{#if isSingle}
  {#await qrCode}
    <div class="qr-container-loading">
      <img src={qrCodeLoading} alt="QR code" loading="lazy" />
    </div>
  {:then qrCode}
    {#if qrCode}
      <div class="qr-container">
        <a href={qrCode} class="frame-link">
          <img src={qrCode} alt="QR code" loading="lazy" />
        </a>
      </div>
    {/if}
  {:catch error}
    <p style="color: red">{error.message}</p>
  {/await}
{/if}

<style>
  .half-image-vertical {
    height: 160%; /* Adjust as needed */
    width: 100%;
    overflow: hidden;
    transition: 0.3s all ease-in-out;
  }

  .half-image-vertical:hover {
    bottom: 70px;
  }

  @media only screen and (max-width: 768px) {
    .half-image-vertical:hover {
      bottom: 50px;
    }
  }
</style>
