<!-- src/routes/login.svelte -->
<script lang="ts">
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { signInWithEmailAndPassword, type User } from "firebase/auth";
  import { onMount } from "svelte";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  let logging = false;

  let currentUser: User | null = null; // Initialize currentUser to null

  const navigateToHome = async () => {
    await goto("/");
  };

  const login = async () => {
    logging = true;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
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

{#if currentUser != null}
  <p>Ya tienes una sessión activa</p>
{:else}
  <h1>Login</h1>

  {#if logging}
    Iniciando Sesión...
  {:else}
    <form on:submit|preventDefault={login}>
      <input type="email" bind:value={email} placeholder="Email" />
      <input type="password" bind:value={password} placeholder="Password" />
      <button type="submit">Login</button>
      {#if error}
        <p style="color: red;">{error}</p>
      {/if}
    </form>
  {/if}
{/if}
