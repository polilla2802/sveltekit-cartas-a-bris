<!-- src/routes/Register.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import { signInWithMail, signInWithGoogle } from "$lib/auth";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  let registering = false;

  const navigateToHome = async () => {
    await goto("/");
  };

  const registerUserWithMail = async (email: string, password: string) => {
    registering = true;

    try {
      const userCredential = await signInWithMail(email, password);

      if (userCredential) {
        await navigateToHome();
      }
    } catch (e: any) {
      registering = false;
      error = e.message;
    }
  };

  const registerUserWithGoogle = async () => {
    registering = true;

    try {
      const userCredential = await signInWithGoogle();

      console.log(userCredential);

      if (userCredential != undefined) {
        await navigateToHome();
      } else {
        registering = false;
        error = "Hubo un error intenta de nuevo";
      }
    } catch (e: any) {
      registering = false;
      error = e.message;
    }
  };
</script>

<h1>Registrate</h1>

{#if registering}
  Registrando...
{:else}
  <form on:submit|preventDefault={() => registerUserWithMail(email, password)}>
    <label>
      Email:
      <input type="email" bind:value={email} required />
    </label>
    <label>
      Password:
      <input type="password" bind:value={password} required />
    </label>
    <button type="submit">Registrate</button>
  </form>
  <br />
  <br />
  <form on:submit|preventDefault={() => registerUserWithGoogle()}>
    <button type="submit">Registrate con Google</button>
  </form>

  {#if error}
    <p style="color: red;">{error}</p>
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
