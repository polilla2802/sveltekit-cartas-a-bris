<script lang="ts">
  import { page } from "$app/stores"; // Import the page store from SvelteKit
  import { onMount } from "svelte"; // Optional: If you want to run some code when the component mounts
  import { formatToEST } from "../../../utils/getESTTime";
  import { isNew } from "../../../utils/isNew";

  // Use the `$page` store to get the data returned by the load function
  const { frameFinalized } = $page.data.frameFinalized;

  let qrCode: string;
  let qrCodeLoading: string =
    "https://firebasestorage.googleapis.com/v0/b/cartas-a-bris.appspot.com/o/qr%2Fqr-loading.gif?alt=media&token=9de90db0-b6f6-4f4d-8970-b8e7f24afcf7";

  // Construct the base URL based on page url origin
  const baseUrl: string = $page.url.origin;

  // Extract the `designId` from URL parameters
  let designId: string = $page.params.id;

  const QR_API_URL: string =
    "https://api.qrserver.com/v1/create-qr-code/?data=";

  async function getQRCode() {
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
    console.log("Component has mounted", frameFinalized);
    setTimeout(() => {
      getQRCode();
    }, 1000); // 2500 milliseconds (2.5 seconds) delay
  });
</script>

<!-- Now you can use the `user` data in your component -->
<section class="pb-10">
  {#if frameFinalized}
    <!-- Map frames to display images -->
    <div class="flex flex-col items-center self-center">
      <div class="w-full xs:w-2/4 md:w-3/4 lg:w-2/4 xl:w-2/6 relative">
        <!-- Check if the frame is new and conditionally render "Nuevo!" -->
        {#if isNew(frameFinalized.createdAt)}
          <img
            class="w-20 md:w-32 absolute new-logo-single"
            src={"/images/new-styled.png"}
            alt="new"
          />
        {/if}
        <a href={frameFinalized.url} class="frame-link"
          ><img class="w-full h-auto" src={frameFinalized.url} alt="Frame" /></a
        >
      </div>
      {#if frameFinalized.User}
        <p class="text-center">Autor: <b>{frameFinalized.User.userName}</b></p>
      {:else}
        <div>
          <p class="text-center">Autor: <b>Desconocido</b></p>
        </div>
      {/if}
      <p class="text-center">Nombre: <b><i>"{frameFinalized.name}"</i></b></p>
      {#if frameFinalized.frame_designs}
        <p class="text-center">
          Diseño: <a
            href={baseUrl + "/diseños/" + frameFinalized.frame_designs.id}
            class="text-blue-500 underline"
            >{frameFinalized.frame_designs.name}</a
          >
        </p>
      {/if}
      <p class="text-center">Creado: {formatToEST(frameFinalized.createdAt)}</p>
    </div>
    {#if qrCode}
      <div class="qr-container">
        <img src={qrCode} alt="QR code" />
      </div>
    {:else}
      <div class="qr-container-loading">
        <img src={qrCodeLoading} alt="QR code" />
      </div>
    {/if}
  {/if}
</section>

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
