<script lang="ts">
  import { formatToEST } from "$utils/getESTTime";
  import { isNew } from "$utils/isNew";
  import { onMount } from "svelte";
  export let data;
  export let baseUrl: string;
  export let designId: string;
  export let isSingle: boolean;

  let qrCode: string;
  let qrCodeLoading: string =
    "https://firebasestorage.googleapis.com/v0/b/cartas-a-bris.appspot.com/o/qr%2Fqr-loading.gif?alt=media&token=9de90db0-b6f6-4f4d-8970-b8e7f24afcf7";

  const QR_API_URL: string =
    "https://api.qrserver.com/v1/create-qr-code/?data=";

  async function getQRCode(baseUrl: string, designId: string) {
    try {
      const response = await fetch(
        `${QR_API_URL}${baseUrl}/finalizado/${designId}`
      );
      qrCode = response.url;
    } catch (error) {
      console.log(error);
    }
  }

  // Optional: If you need to perform any action on mount
  onMount(() => {
    setTimeout(() => {
      getQRCode(baseUrl, designId);
    }, 500); // 2500 milliseconds (2.5 seconds) delay
  });
</script>

{#if isSingle}
  <!-- Map frames to display images -->
  <div class="flex flex-col items-center relative">
    <!-- Check if the frame is new and conditionally render "Nuevo!" -->
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
{:else}
  <!-- Map frames to display images -->
  <div class="flex flex-col items-center self-center">
    <div class="w-full xs:w-2/4 md:w-3/4 lg:w-2/4 xl:w-2/6 relative">
      <!-- Check if the frame is new and conditionally render "Nuevo!" -->
      {#if isNew(data.createdAt)}
        <img
          class="w-20 md:w-32 absolute new-logo-single"
          src={"/images/new-styled.png"}
          alt="new"
        />
      {/if}
      <a href={data.url} class="frame-link"
        ><img class="w-full h-auto" src={data.url} alt="Frame" /></a
      >
    </div>
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
  {#if qrCode}
    <div class="qr-container">
      <a href={qrCode} class="frame-link">
        <img src={qrCode} alt="QR code" />
      </a>
    </div>
  {:else}
    <div class="qr-container-loading">
      <img src={qrCodeLoading} alt="QR code" />
    </div>
  {/if}
{/if}

<style>
  .qr-container {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
  }

  .qr-container-loading {
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
  }

  .qr-container img {
    background-color: white;
    padding: 48px;
    width: 350px;
    height: 350px;
  }

  .qr-container-loading img {
    width: 350px;
    height: 350px;
  }
</style>
