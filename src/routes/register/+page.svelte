<!-- src/routes/Register.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    signInWithGoogle,
    signInUserWithMail,
    deleteCurrentUser,
    signOutUser,
  } from "$lib/auth";
  import { isUserRegisteredWithGoogle } from "$utils/isGoogle";
  import type { User } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  let registering = false;

  let currentUser: User | null = null; // Initialize currentUser to null


  const registerUser = async (userCredential: User | null) => {
    if (!userCredential) {
      // Handle case where userCredential is null or undefined
      return;
    }

    console.log(userCredential);
    console.log(isUserRegisteredWithGoogle(userCredential));

    const uid = userCredential.uid as string;
    const displayName = userCredential.displayName as string;
    const phoneNumber = userCredential.phoneNumber as string;
    const email = userCredential.email as string;

    console.log(uid);
    console.log(displayName);
    console.log(phoneNumber);
    console.log(email);

    const formData = new FormData();
    formData.append("firebaseUid", uid); // Assuming you want to send user ID
    formData.append("userName", displayName); // Assuming you want to send user ID
    formData.append("name", displayName); // Assuming you want to send user ID
    formData.append("phoneNumber", phoneNumber); // Assuming you want to send user ID
    formData.append("email", email); // Assuming you want to send user ID
    formData.append("password", "12345678"); // Assuming you want to send user ID
    formData.append("gender", "M"); // Assuming you want to send user ID
    formData.append("age", "29"); // Assuming you want to send user ID

    console.log(formData);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to register user data");
      }

      // Optionally handle response data here if needed
      const responseData = await response.json();
      console.log("Registration successful:", responseData);

      // Redirect or perform any additional actions after successful registration
      await navigateToHome();
    } catch (e: any) {
      registering = false;
      error = e;
      // Handle error state or display error message to user
      console.log("Error registering user data:", e);
      //TODO: delete user when some error occurs
      // await deleteCurrentUser();
    }
  };

  const navigateToHome = async () => {
    await goto("/");
  };

  const registerUserWithMail = async (email: string, password: string) => {
    registering = true;

    try {
      const userCredential = await signInUserWithMail(email, password);

      if (userCredential) {
        await registerUser(userCredential);
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

      if (userCredential) {
        await registerUser(userCredential);
      }
    } catch (e: any) {
      registering = false;
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
  {#if !currentUser}
  <form on:submit|preventDefault={() => registerUserWithGoogle()}>
    <button type="submit">Registrate con Google</button>
  </form>
  {/if}

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
