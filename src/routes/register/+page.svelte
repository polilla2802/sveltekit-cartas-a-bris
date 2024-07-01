<!-- src/routes/Register.svelte -->
<script lang="ts">
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { createUserWithEmailAndPassword } from "firebase/auth";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  let registering = false;

  const navigateToHome = async () => {
    await goto("/");
  };

  const registerUser = async (email: string, password: string) => {
    registering = true;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // console.log(userCredential);
      // console.log("User registered successfully:", userCredential.user);

      if (userCredential) {
        await navigateToHome();
      }
    } catch (e: any) {
      registering = false;
      error = e.message;
    }
  };
</script>

<h1>Register</h1>

{#if registering}
  Registering...
{:else}
  <form on:submit|preventDefault={() => registerUser(email, password)}>
    <label>
      Email:
      <input type="email" bind:value={email} required />
    </label>
    <label>
      Password:
      <input type="password" bind:value={password} required />
    </label>
    <button type="submit">Register</button>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
  </form>
{/if}
