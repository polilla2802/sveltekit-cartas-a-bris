<script lang="ts">
  import Welcome from "$lib/components/messages/Welcome.svelte";
  import Header from "$lib/components/navigation/Header.svelte";
  import "$lib/styles/app.css";
</script>

<div class="layout">
  <Header />
  <Welcome />
  <div class="container mx-auto px-4"><slot /></div>
</div>

<style>
  .layout {
    padding: 0 2rem;
  }
</style>
