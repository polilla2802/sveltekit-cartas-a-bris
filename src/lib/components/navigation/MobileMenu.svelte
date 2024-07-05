<script lang="ts">
  import { page } from "$app/stores";
  import { auth } from "$lib/firebase";
  import { slideRightAnimation } from "$utils/slideRightAnimation";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";
  import { getRandomNumber } from "$utils/getRandomNumber";

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
        audio = new Audio("/sounds/page-1.mp3");
        break;
      case false:
        audio = new Audio("/sounds/page-4.mp3");
        break;
      default:
        audio = new Audio("/sounds/page-1.mp3");
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
      ☰
    {:else}
      X
    {/if}
  </button>

  {#if isOpen}
    <nav transition:slideRightAnimation={{ duration: 500 }}>
      <ul class="items-center">
        <div class="logo-container">
          <a class="center flex flex-col items-center" href="/">
            <img
              src="/logos/cartas-logo-golden.png"
              class="w-30 h-auto"
              alt="main-logo"
            />
            <h1>Cartas a Bris</h1>
          </a>
        </div>
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
        {/if}
      </ul>
    </nav>
  {/if}
</section>

<style>
  .menu-toggle {
    position: fixed;
    top: 50%;
    right: 0;
    z-index: 1000;
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    transform: translateY(-50%);
    padding: 5px 20px 5px 15px;
    background-color: #c4525a;
    border-radius: 100px 0px 0px 100px;
    box-shadow: 2px 4px #888888;
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
    z-index: 1;
    border: 8px solid #2f4858;
  }

  ul {
    list-style-type: none;
    padding: 0;
    text-align: center;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-top: 3rem;
  }

  .logo-container a {
    margin-bottom: 50px;
    font-weight: bold;
  }

  .active {
    font-weight: bold;
  }

  a {
    color: #2f4858;
    text-decoration: none;
    font-family: Dancing, sans-serif;
    font-size: 2rem;
    margin-bottom: 30px;
    width: min-content;
    white-space: nowrap;
    text-align: center;
    align-self: center;
  }

  button {
    font-weight: bolder;
    font-family: Cursive, sans-serif;
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
    left: 50%;
    transform: translateX(-50%);
    background-color: currentColor;
    transition: width 0.3s ease-in-out;
  }

  .smooth-underline:hover::after,
  .smooth-underline.active::after {
    width: 50%;
  }
</style>
