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
    <div class=" frame-border h-full">
      <slot />
    </div>
  </section>
  <Footer />
</div>

<style>
  .layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .frame-border {
    border: 2px solid #2f4858;
    padding: 50px;
  }

  .flex-container {
    padding: 20px;
  }

  @media only screen and (max-width: 768px) {
    .frame-border {
      padding: 15px;
    }

    .flex-container {
      padding: 10px;
    }
  }
</style>
