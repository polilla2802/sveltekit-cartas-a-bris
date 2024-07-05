<script lang="ts">
  import Footer from "$lib/components/navigation/Footer.svelte";
  import Header from "$lib/components/navigation/Header.svelte";
  import "$lib/styles/app.css";
</script>

<div class="layout">
  <Header />
  <section
    class="container mx-auto px-4 py-4 flex-1 mt-2 md:mt-4 lg:mt-10 mb-20 flex-container"
  >
    <div class="slot-content h-full">
      <slot />
    </div>
  </section>
  <Footer />
</div>

<style>
  .slot-content :global(button) {
    border: 1px solid #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    font-weight: bolder;
    text-align: center;
    width: min-content;
    white-space: nowrap;
    margin: 0 auto;
    font-family: Apple, sans-serif !important;
  }

  .slot-content :global(button:hover) {
    border: 1px solid #2f4858;
    background-color: #2f4858;
    color: white;
    font-weight: normal;
  }

  .layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .slot-content {
    border: 2px solid #2f4858;
    padding: 50px;
  }

  .flex-container {
    padding: 20px;
  }

  @media only screen and (max-width: 768px) {
    .slot-content {
      padding: 15px;
    }

    .flex-container {
      padding: 10px;
    }
  }
</style>
