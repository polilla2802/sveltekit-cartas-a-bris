<!-- src/routes/login.svelte -->
<script lang="ts">
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { signInWithEmailAndPassword } from "firebase/auth";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  const navigateToHome = async () => {
    await goto("/");
  };

  const login = async () => {
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
      error = e.message;
    }
  };
</script>

<form on:submit|preventDefault={await login}>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button type="submit">Login</button>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
</form>
