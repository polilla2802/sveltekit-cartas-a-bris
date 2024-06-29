<!-- src/routes/login.svelte -->
<script>
  import { auth } from "$lib/firebase";
  import { signInWithEmailAndPassword } from "firebase/auth";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let error = "";

  const navigateToHome = () => {
    goto("/");
  };

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Redirect to a protected route or home page
      // Example: navigate to "/dashboard"
      navigateToHome();
    } catch (e) {
      error = e.message;
    }
  };
</script>

<form on:submit|preventDefault={login}>
  <input type="email" bind:value={email} placeholder="Email" />
  <input type="password" bind:value={password} placeholder="Password" />
  <button type="submit">Login</button>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
</form>
