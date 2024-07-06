<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/firebase";
  import { slideRightAnimation } from "$utils/slideRightAnimation";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";
  import {
    takeMeToLogin,
    takeMeToLogout,
    takeMeToRegister,
  } from "$utils/routing";
  import Icon from "@iconify/svelte";

  let isOpen = true;
  let audio: HTMLAudioElement;
  let currentUser: User | null; // Define error as string or undefined

  function toggleMenu() {
    playSound();
    isOpen = !isOpen;
  }

  function playSound(): void {
    switch (isOpen) {
      case true:
        audio = new Audio("/sounds/page-4.mp3");
        break;
      case false:
        audio = new Audio("/sounds/page-1.mp3");
        break;
      default:
        audio = new Audio("/sounds/page-4.mp3");
        break;
    }

    if (audio) {
      audio.currentTime = 0; // Reset audio to start
      audio.play();
    }
  }

  onMount(() => {
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      currentUser = user;
    });

    // Cleanup listener on component unmount
    return () => {
      unsubscribe();
    };
  });
</script>

<section class="md:hidden">
  <button class="menu-toggle text-white" on:click={toggleMenu}>
    {#if !isOpen}
      <div class="icon-container">
        <Icon
          icon="ph:envelope-open-light"
          color="white"
          width="32"
          height="32"
          opacity="1"
        />
      </div>
    {:else}
      <div class="icon-container">
        <Icon
          icon="ph:envelope-light"
          color="white"
          width="32"
          height="32"
          opacity="1"
        />
      </div>
    {/if}
  </button>

  {#if isOpen}
    <nav transition:slideRightAnimation={{ duration: 350 }}>
      <ul class="items-center">
        <div class="logo-container">
          <a
            class="center flex flex-col items-center"
            href="/"
            on:click={toggleMenu}
          >
            <img
              src="/logos/cartas-logo-golden.png"
              class="w-28 h-auto"
              alt="main-logo"
            />
            <h1>Cartas a Bris</h1>
          </a>
        </div>
        <div class="flex flex-col">
          <a
            class:active={$page.url.pathname === "/"}
            class="smooth-underline"
            href="/"
            on:click={toggleMenu}>Inicio</a
          >
          <a
            class:active={$page.url.pathname === "/dise%C3%B1os"}
            class="smooth-underline"
            href="/diseños"
            on:click={toggleMenu}>Diseños</a
          >
          {#if currentUser != null}
            <a
              class:active={$page.url.pathname === "/carta-del-dia"}
              class="smooth-underline"
              href="/carta-del-dia"
              on:click={toggleMenu}>Carta del Día</a
            >
            <a
              class:active={$page.url.pathname === "/cartas-para-mi"}
              class="smooth-underline"
              href="/cartas-para-mi"
              on:click={toggleMenu}>Cartas para mi</a
            >
            <a
              class:active={$page.url.pathname === "/mis-cartas"}
              class="smooth-underline"
              href="/mis-cartas"
              on:click={toggleMenu}>Mis Cartas</a
            >

            <div class="right flex flex-col xl:block">
              <p>{currentUser.email}</p>
              <button on:click={takeMeToLogout}>Cerrar Sesión</button>
            </div>
          {:else}
            <div class="right flex flex-col xl:block">
              <button on:click={takeMeToLogin} on:click={toggleMenu}>Login</button>
              <button on:click={takeMeToRegister} on:click={toggleMenu}>Registrate</button>
            </div>
          {/if}
        </div>
      </ul>
    </nav>
  {/if}
</section>

<style>
  .menu-toggle {
    position: fixed;
    top: 50%;
    right: 0;
    z-index: 9999;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    transform: translateY(-50%);
    padding: 5px 20px 5px 15px;
    background-color: #c4525a;
    border-radius: 100px 0px 0px 100px;
    box-shadow: 2px 4px #888888;
    font-family: "Libre", sans-serif;
  }

  nav {
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    width: 100%;
    background: #fee7db;
    padding: 20px;
    box-shadow: -2px 0 5px rgba(0, 0, 0, 0.5);
    z-index: 9998;
    border: 4px solid #2f4858;
  }

  nav p {
    font-family: Dancing, sans-serif;
    text-decoration: none !important;
  }

  nav a {
    color: #2f4858;
    text-decoration: none !important;
    font-family: Dancing, sans-serif;
    font-size: 1.3rem;
    margin-bottom: 18px;
    width: min-content;
    white-space: nowrap;
    text-align: center;
    align-self: center;
  }

  nav a:hover {
    font-weight: bolder;
  }

  .icon-container {
    width: 32px;
    height: 32px;
  }

  ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 3rem;
  }

  .logo-container a {
    margin-bottom: 30px;
    font-weight: bolder;
  }

  .active {
    font-weight: bolder;
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
    left: 50%;
    transform: translateX(-50%);
    background-color: currentColor;
    transition: width 0.3s ease-in-out;
  }

  .smooth-underline:hover::after,
  .smooth-underline.active::after {
    width: 50%;
  }

  .right {
    margin-top: 20px;
    font-family: Dancing, sans-serif;
    font-size: 1rem;
    font-weight: bolder;
  }

  .right button {
    border: 1px solid #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    text-align: center;
    margin-left: 0;
    font-weight: bolder;
    font-family: Apple, sans-serif !important;
    font-size: 0.8rem;
    font-weight: bolder;
    min-width: 80vw;
    min-height: 40px;
    margin-top: 10px;
  }

  .right button:hover {
    border: 1px solid #2f4858;
    background-color: #2f4858;
    color: white;
  }

</style>
