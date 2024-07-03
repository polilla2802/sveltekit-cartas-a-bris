<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";

  let loading = true;

  let currentUser: User | null; // Define error as string or undefined

  // console.log($page.url.pathname);

  onMount(() => {
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      currentUser = user;
      loading = false;
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  });
</script>

{#if loading}
  <nav class="py-16"></nav>
{:else}
  <nav>
    <div class="left">
      <a class:active={$page.url.pathname === "/"} href="/">Carta del Día</a>
      <a class:active={$page.url.pathname === "/dise%C3%B1os"} href="/diseños"
        >Diseños</a
      >
      {#if currentUser != null}
        <a
          class:active={$page.url.pathname === "/mis-cartas"}
          href="/mis-cartas">Mis Cartas</a
        >
      {/if}
    </div>
    <div class="right flex flex-col md:block">
      {#if currentUser}
        <p>{currentUser.email}</p>
        <a href="/logout">Cerrar Sesión</a>
      {:else}
        <a href="/login">Login</a>
        <a href="/register" class="register">Registrate</a>
      {/if}
    </div>
  </nav>
{/if}

<style>
  @media only screen and (max-width: 768px) {
    .register {
      margin-left: 0 !important;
    }
  }

  .register {
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
