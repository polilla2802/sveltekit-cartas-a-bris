<script lang="ts">
</script>

<footer class="bg-golden">
  <div class="container flex items-center justify-between px-4 py-4 mx-auto">
    <div>
      <p class="text-xs">© Cartas a Bris - 2024</p>
    </div>
    <div class="flex">
      <p>Powered by</p>
      <a class="mr-1" href="https://kit.svelte.dev"
        ><img
          src="/logos/sveltekit-logo.png"
          alt="svelte-logo"
          class="w-4 h-auto ml-2"
        /></a
      >
      <a href="https://www.canva.com/"
        ><img
          src="/logos/canva-logo.png"
          alt="canva-logo"
          class="w-5 h-auto ml-2"
        /></a
      >
    </div>
  </div>
</footer>

<style>
  footer {
    border-top: 2px solid #2f4858;
  }

  footer p {
    font-family: Dancing, sans-serif;
    font-weight: bolder;
    font-size: 1.5rem;
    color: #2f4858;
    display: flex;
    align-self: center;
  }

  footer a {
    display: flex;
    color: #ff4513;
  }

  footer img {
    align-self: center;
  }

  @media only screen and (max-width: 1280px) {
    footer p {
      font-size: 1.2rem;
    }
  }

  @media only screen and (max-width: 768px) {
    footer p {
      font-size: 1rem;
    }
  }
</style>
