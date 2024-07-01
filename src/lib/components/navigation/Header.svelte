<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";

  let loading = true;

  let currentUser: User | null; // Define error as string or undefined

  // console.log($page.url.pathname);

  onMount(() => {
    // Check if a user is signed in when the component mounts
    currentUser = auth.currentUser;

    // Optionally, you can listen to the auth state changes
    auth.onAuthStateChanged((user) => {
      currentUser = user;
      // console.log(currentUser);
      loading = false;
    });
  });
</script>

{#if loading}
  <nav class="py-16"></nav>
{:else}
  <nav>
    <div class="left">
      <a class:active={$page.url.pathname === "/"} href="/">Todas</a>
      <a class:active={$page.url.pathname === "/dise%C3%B1os"} href="/diseños"
        >Diseños</a
      >
    </div>
    <div class="right flex flex-col md:block">
      {#if currentUser}
        <p>{currentUser.email}</p>
        <a href="/logout">Cerrar Sesión</a>
      {:else}
        <a href="/login">Iniciar Sesión</a>
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
