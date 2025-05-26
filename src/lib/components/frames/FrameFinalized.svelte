<script lang="ts">
  import type { FrameFinalized } from "$lib/types/frame";
  import { formatToEST } from "$utils/getESTTime";
  import { FrameTypes, getQRCode, qrCodeLoading } from "$utils/getQRcode";
  import { isNew } from "$utils/isNew";
  import { onMount } from "svelte";
  export let frameFinalized: FrameFinalized;
  export let baseUrl: string;
  export let finalizedId: string = "";
  export let isSingle: boolean = false;
  let qrCode: Promise<string>;

  let audio: HTMLAudioElement;

  let hover: boolean = false;

  console.log(frameFinalized)

  function playSound(): void {
    audio = new Audio("/sounds/page-4.mp3");

    if (audio) {
      audio.currentTime = 0; // Reset audio to start
      audio.play();
    }
  }

  // Optional: If you need to perform any action on mount
  onMount(() => {
    qrCode = getQRCode(baseUrl, finalizedId, FrameTypes.finalized);
  });
</script>

<!-- Map frames to display images -->
<div
  class="relative flex flex-col items-center mt-16 md:mt-20 lg:mt-16 xl:mt-24 2xl:mt-32"
>
  {#if isSingle}
    <div class="relative w-full xs:w-2/4 md:w-3/4 lg:w-2/4">
      <!-- Check if the frame is new and conditionally render "Nuevo!" -->
      {#if isNew(frameFinalized.createdAt)}
        <img
          class="absolute new-logo-single"
          src={"/images/new-styled.png"}
          alt="new"
          loading="lazy"
        />
      {/if}

      <a href={frameFinalized.url} class="frame-link"
        ><img
          class="w-full h-auto"
          src={frameFinalized.url}
          alt="Frame"
          loading="lazy"
        /></a
      >
    </div>
  {:else}
    <a
      class="relative flex flex-col justify-end letter"
      on:click={playSound}
      href={baseUrl + "/finalizado/" + frameFinalized.id}
    >
      {#if isNew(frameFinalized.createdAt)}
        <img
          class="absolute new-logo"
          src={"/images/new-styled.png"}
          alt="new"
          loading="lazy"
        />
      {/if}
      <div class="absolute bottom-0 half-image-vertical">
        <img
          class="w-full h-auto"
          src={frameFinalized.url}
          alt="Frame"
          loading="lazy"
        />
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
  <b class="mb-3 text-center"><i>"{frameFinalized.name}"</i></b>
  {#if frameFinalized.userCreator}
    <p class="text-center">
      Autor: <b>{frameFinalized.userCreator.userName}</b>
    </p>
  {:else}
    <div>
      <p class="text-center">Autor: <b>Desconocido</b></p>
    </div>
  {/if}
  {#if frameFinalized.userFor}
    <p class="text-center">Para: <b>{frameFinalized.userFor.userName}</b></p>
  {/if}
  {#if frameFinalized.frame_designs}
    <p class="text-center">
      Diseño: <a
        href={baseUrl + "/diseños/" + frameFinalized.frame_designs.id}
        class="text-blue-500 underline">{frameFinalized.frame_designs.name}</a
      >
    </p>
  {/if}
  <b>{formatToEST(frameFinalized.createdAt)}</b>
</div>
{#if isSingle}
  {#await qrCode}
    <div class="qr-container-loading">
      <img src={qrCodeLoading} alt="Loading QR code..." loading="lazy" />
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
    <p class="text-center text-red-500">Error: {error.message}</p>
  {/await}
{/if}
