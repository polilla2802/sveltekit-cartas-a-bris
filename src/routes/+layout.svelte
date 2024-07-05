<script lang="ts">
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import Header from "$lib/components/navigation/Header.svelte";
  import "$lib/styles/app.css";
</script>

<div class="layout">
  <Header />
  <!-- <Welcome /> -->
  <div class="container mx-auto px-4 py-4"><slot /></div>
</div>

<style>
  .layout {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>
