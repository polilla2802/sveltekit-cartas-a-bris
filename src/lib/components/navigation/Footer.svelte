<footer class="bg-golden">
  <div class="container mx-auto px-4 py-4 flex justify-end">
    <p>Powered by</p>
    <a href="https://kit.svelte.dev"
      ><img
        src="/logos/sveltekit-logo.png"
        alt="svelte-logo"
        class="w-4 h-auto ml-2"
      /></a
    >
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
</style>
