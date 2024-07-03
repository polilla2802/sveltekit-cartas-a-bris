<!-- src/routes/login.svelte -->
<script lang="ts">
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { logInUserWithMail, signInWithGoogle } from "$lib/auth";
  import type { User } from "firebase/auth";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  let logging = false;

  let currentUser: User | null = null; // Initialize currentUser to null

  const navigateToHome = async () => {
    await goto("/");
  };

  const loginUserWithMail = async () => {
    logging = true;

    try {
      const userCredential = await logInUserWithMail(
        email,
        password
      );
      // Redirect to a protected route or home page
      // Example: navigate to "/"
      if (userCredential) {
        await navigateToHome();
      }
    } catch (e: any) {
      logging = false;
      error = e.message;
    }
  };

  const loginUserWithGoogle = async () => {
    logging = true;

    try {
      const userCredential = await signInWithGoogle();

      console.log(userCredential);

      if (userCredential != undefined) {
        await navigateToHome();
      } else {
        logging = false;
        error = "Hubo un error intenta de nuevo";
      }
    } catch (e: any) {
      logging = false;
      error = e.message;
    }
  };

  onMount(async () => {
    auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        currentUser = authUser;
        console.log("User is signed in:", currentUser);
      } else {
        console.log("No user signed in");
      }
    });
  });
</script>

{#if currentUser != null}
  <p>Ya tienes una sessión activa</p>
{:else}
  <h1>Login</h1>

  {#if logging}
    Iniciando Sesión...
  {:else}
    <form on:submit|preventDefault={loginUserWithMail}>
      <input type="email" bind:value={email} placeholder="Email" />
      <input type="password" bind:value={password} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
    <br />
    <br />
    <form on:submit|preventDefault={loginUserWithGoogle}>
      <button type="submit">Login con Google</button>
    </form>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
  {/if}
{/if}

<style>
  button {
    margin-left: 10px;
    border: 1px solid black;
    padding: 0.5rem 1rem;
    border-radius: 3px;
  }
</style>
