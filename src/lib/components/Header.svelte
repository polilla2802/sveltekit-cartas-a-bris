<script lang="ts">
  import { page } from "$app/stores";

  console.log($page.url.pathname);
</script>

<nav>
  <div class="left">
    <a class:active={$page.url.pathname === "/"} href="/">Todas</a>
    <a class:active={$page.url.pathname === "/dise%C3%B1os"} href="/diseños"
      >Diseños</a
    >
  </div>
  <div class="right flex flex-col md:block">
    <a href="/signup">Inicia Sesión</a>
    <a href="/create" class="crear-carta">+ Crear Carta</a>
  </div>
</nav>

<style>
  @media only screen and (max-width: 768px) {
    .crear-carta {
      margin-left: 0 !important;
    }
  }

  .crear-carta {
    margin-left: 1rem;
  }

  nav {
    display: flex;
    padding: 2rem;
    align-items: center;
  }

  a {
    text-decoration: none;
    color: #000;
    display: inline-block;
  }

  a + a {
    margin-left: 1rem;
  }

  .active {
    font-weight: bold;
  }

  .right {
    margin-left: auto;
  }

  .right a {
    border: 1px solid black;
    padding: 0.5rem 1rem;
    border-radius: 3px;
  }
</style>
