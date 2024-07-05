<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/firebase";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";
  import MobileMenu from "./MobileMenu.svelte";
  import {
    takeMeToLogin,
    takeMeToLogout,
    takeMeToRegister,
  } from "$utils/routing";

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
  <section class="bg-primaryPink">
    <MobileMenu />

    <nav class="container mx-auto px-4 py-4 flex justify-between">
      <div class="logo-container">
        <a class="center flex flex-col items-center" href="/">
          <img
            src="/logos/cartas-logo-pink.png"
            class="w-16 h-auto"
            alt="main-logo"
          />
          <h1>Cartas a Bris</h1>
        </a>
      </div>
      <div class="left hidden md:block">
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

      {#if currentUser}
        <div class="right flex flex-col">
          <p>{currentUser.email}</p>
          <button class="logged" on:click={takeMeToLogout}>Cerrar Sesión</button
          >
        </div>
      {:else}
        <div class="right block">
          <button on:click={takeMeToLogin}>Login</button>
          <button on:click={takeMeToRegister}>Registrate</button>
        </div>
      {/if}
    </nav>
  </section>
{/if}

<style>
  .logo-container {
    margin-bottom: 3px;
  }

  h1 {
    font-size: 1rem;
    font-weight: bolder;
    align-self: flex-end;
    text-align: center;
  }

  nav {
    display: flex;
    align-items: flex-end;
    font-weight: normal;
    /* font-family: Cursive, sans-serif; */
    font-family: Dancing, sans-serif;
    /* font-family: Garamond, sans-serif; */
    /* font-family: Libre, sans-serif; */
    /* font-family: Nunito, sans-serif; */
    /* font-family: Apple, sans-serif; */
    letter-spacing: 1.5px;
  }

  nav p {
    font-family: Dancing, sans-serif;
    text-decoration: none !important;
  }

  nav a {
    font-family: Dancing, sans-serif;
    text-decoration: none !important;
  }

  .active {
    font-weight: bolder;
  }

  .left {
    font-size: 1.4rem;
  }

  .left a {
    display: flex;
    text-align: center;
    width: min-content;
    white-space: nowrap;
  }

  .left a + a {
    margin-left: 3rem;
  }

  .right {
    font-size: 1rem;
    font-weight: bolder;
    gap: 5px;
  }

  .logged {
    width: 100% !important;
  }

  .right button {
    border: 1px solid #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    font-weight: bolder;
    text-align: center;
    width: min-content;
    white-space: nowrap;
    margin: 0 auto;
    font-family: Apple, sans-serif !important;
    margin-top: 10px;
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

  .smooth-underline {
    position: relative;
    text-decoration: none !important;
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

  @media only screen and (max-width: 1280px) {
    .right button + button {
      margin-left: 0;
    }

    .left a + a {
      margin-left: 2rem;
    }
  }

  @media only screen and (max-width: 1024px) {
    .left a + a {
      margin-left: 8px;
    }

    .left a {
      font-size: 1rem;
    }

    .right button,
    p {
      font-size: 0.8rem;
    }
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
  }
</style>
