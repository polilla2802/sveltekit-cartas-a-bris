<!-- src/routes/Register.svelte -->
<script lang="ts">
  import { createUserWithEmailAndPassword } from "firebase/auth";
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let confirmPassword = "";
  let error: string | undefined; // Define error as string or undefined

  const navigateToHome = () => {
    goto("/");
  };

  const registerUser = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User registered successfully:", userCredential.user);
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
</script>

<h1>Register</h1>

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
</form>
