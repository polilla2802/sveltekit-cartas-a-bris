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
  :global(button) {
    border: 1px solid #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    text-align: center;
    margin-left: 0;
    font-weight: bolder;
    font-family: Apple, sans-serif !important;
    font-size: 1rem;
  }

  :global(button:hover) {
    border: 1px solid #2f4858;
    background-color: #2f4858;
    color: white;
  }

  :global(.google-btn) {
    color: white;
    border: 1px solid #2f4858;
    background-color: #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    text-align: center;
    margin-left: 0;
    font-weight: bolder;
    font-family: Apple, sans-serif !important;
    font-size: 1rem;
  }

  :global(.google-btn:hover) {
    border: 1px solid #2f4858;
    background-color: #fff2fa;
    color: #2f4858;
  }

  :global(.form-btn) {
    margin-bottom: 20px;
    padding: 0.5rem 1.2rem;
    justify-content: space-between;
    align-items: center;
    max-height: 40px;
  }

  :global(.form-btn:hover) {
    padding: 0.5rem 1.2rem;
    align-items: center;
    max-height: 40px;
  }

  :global(form) {
    display: flex;
    flex-direction: column;
    max-width: 300px;
    gap: 20px;
    margin: 0 auto;
  }

  :global(input),
  :global(textarea) {
    font-size: 16px;
    width: 100%;
    background-color: #fee7db;
    height: 35px;
    padding: 0.5rem 0.8rem;
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

  :global(.invalid-container) {
    display: flex;
    justify-content: center;
  }

  @media only screen and (max-width: 1024px) {
    .slot-content :global(button) {
      font-size: 0.8rem;
    }

    :global(.google-btn) {
      font-size: 0.8rem;
    }
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
