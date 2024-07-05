<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";

  let loading = true;

  let currentUser: User | null; // Define error as string or undefined

  // console.log($page.url.pathname);

  function takeMeToLogin() {
    goto("/login");
  }

  function takeMeToRegister() {
    goto("/register");
  }

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
  <section class="bg-primaryPink">
    <nav class="container mx-auto px-4 py-4 flex justify-between">
      <div>
        <a class="center flex flex-col items-center" href="/">
          <img
            src="/logos/cartas-logo-pink.png"
            class="w-16 h-auto"
            alt="main-logo"
          />
          <h1>Cartas a Bris</h1>
        </a>
      </div>
      <div class="left">

        <div class="left-container flex flex-col md:flex-row">
          <a
            class:active={$page.url.pathname === "/"}
            class="smooth-underline"
            href="/">Inicio</a
          >
          <a
            class:active={$page.url.pathname === "/dise%C3%B1os"}
            class="smooth-underline"
            href="/diseños">Diseños</a
          >
          {#if currentUser != null}
            <a
              class:active={$page.url.pathname === "/carta-del-dia"}
              class="smooth-underline"
              href="/carta-del-dia">Carta del Día</a
            >
            <a
              class:active={$page.url.pathname === "/cartas-para-mi"}
              class="smooth-underline"
              href="/cartas-para-mi">Cartas para mi</a
            >
            <a
              class:active={$page.url.pathname === "/mis-cartas"}
              class="smooth-underline"
              href="/mis-cartas">Mis Cartas</a
            >
          {/if}
        </div>
      </div>

      <div class="right flex flex-col md:block">
        {#if currentUser}
          <p>{currentUser.email}</p>
          <a href="/logout">Cerrar Sesión</a>
        {:else}
          <button on:click={takeMeToLogin}>Login</button>
          <button on:click={takeMeToRegister}>Registrate</button>
        {/if}
      </div>
    </nav>
  </section>
{/if}

<style>
  h1 {
    font-size: 1rem;
    font-weight: bold;
    align-self: center;
  }

  nav {
    display: flex;
    align-items: center;
    font-weight: normal;
    /* font-family: Cursive, sans-serif; */
    font-family: Dancing, sans-serif;
    /* font-family: Garamond, sans-serif; */
    /* font-family: Libre, sans-serif; */
    /* font-family: Nunito, sans-serif; */
    letter-spacing: 1.5px;
  }

  a {
    text-decoration: none;
  }

  .active {
    font-weight: bold;
  }

  .left {
    font-weight: bold;
    font-size: 1.2rem;
  }

  .left a {
    display: flex;
    font-weight: bold;
    text-align: center;
  }

  .left a + a {
    margin-left: 3rem;
  }

  .right {
    font-size: 1rem;
  }

  .right button {
    border: 1px solid #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 3px;
    font-weight: 800;
    text-align: center;
  }

  .right button:hover {
    border: 1px solid #2f4858;
    background-color: #2f4858;
    color: white;
    font-weight: normal;
  }

  .right button + button {
    margin-left: 1rem;
  }

  .register {
    margin-left: 1rem;
  }

  .smooth-underline {
    position: relative;
    text-decoration: none;
  }

  .smooth-underline::after {
    content: "";
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background-color: currentColor;
    transition: width 0.3s ease-in-out;
  }

  .smooth-underline:hover::after,
  .smooth-underline.active::after {
    width: 70%;
  }

  @media only screen and (max-width: 768px) {
    .left {
      position: relative;
      width: 100px;
      align-self: flex-start;
      font-size: 1rem;
    }

    .left-container {
      position: absolute;
      left: 0;
      top: 0;
    }

    .smooth-underline:hover::after,
    .smooth-underline.active::after {
      width: 30%;
    }

    .left a {
      margin-bottom: 10px;
      text-align: left;
    }

    .left a + a {
      margin-left: 0;
    }

    .right button + button {
      margin-left: 0;
    }
  }
</style>
