<!-- src/routes/Register.svelte -->
<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    signInWithGoogle,
    signInUserWithMail,
    deleteCurrentUser,
  } from "$lib/auth";
  import { isUserRegisteredWithGoogle } from "$utils/isGoogle";
  import { getAdditionalUserInfo, type User } from "firebase/auth";
  import { onMount } from "svelte";
  import { auth } from "$lib/firebase";
  import Icon from "@iconify/svelte";

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

    const uid = userCredential.uid as string;
    const displayName = userCredential.displayName as string;
    const phoneNumber = userCredential.phoneNumber as string;
    const email = userCredential.email as string;
    const isGoogle = isUserRegisteredWithGoogle(userCredential);

    console.log(uid);
    console.log(displayName);
    console.log(phoneNumber);
    console.log(email);
    console.log(isGoogle);

    const formData = new FormData();
    if (isGoogle) {
      formData.append("firebaseUid", uid); // Assuming you want to send user ID
      formData.append("userName", displayName); // Assuming you want to send user ID
      formData.append("name", displayName); // Assuming you want to send user ID
      formData.append("phoneNumber", phoneNumber); // Assuming you want to send user ID
      formData.append("email", email); // Assuming you want to send user ID
      formData.append("password", "google"); // Assuming you want to send user ID
    } else {
      formData.append("firebaseUid", uid); // Assuming you want to send user ID
      formData.append("userName", "Usuario 3"); // Assuming you want to send user ID
      formData.append("name", "Nombre"); // Assuming you want to send user ID
      formData.append("phoneNumber", "12345678"); // Assuming you want to send user ID
      formData.append("email", email); // Assuming you want to send user ID
      formData.append("password", "12345678"); // Assuming you want to send user ID
      formData.append("gender", "M"); // Assuming you want to send user ID
      formData.append("age", "29"); // Assuming you want to send user ID
    }

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
      await navigateToHome();

      // Redirect or perform any additional actions after successful registration
    } catch (e: any) {
      registering = false;
      error = e;
      // Handle error state or display error message to user
      console.log("Error registering user data:", e);
      //TODO: delete user when some error occurs
      await deleteCurrentUser();
    }
  };

  const navigateToHome = async () => {
    await goto("/");
  };

  const registerUserWithMail = async (email: string, password: string) => {
    registering = true;

    try {
      const userCredential = await signInUserWithMail(email, password);

      const additionalInfo = getAdditionalUserInfo(userCredential);

      if (additionalInfo != null) {
        console.log(additionalInfo!.isNewUser);

        if (userCredential && additionalInfo!.isNewUser) {
          await registerUser(userCredential.user);
        } else {
          await navigateToHome();
        }
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

      const additionalInfo = getAdditionalUserInfo(userCredential);

      if (additionalInfo != null) {
        console.log(additionalInfo!.isNewUser);

        if (userCredential && additionalInfo!.isNewUser) {
          await registerUser(userCredential.user);
        } else {
          await navigateToHome();
        }
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
      <button class="google-btn flex gap-2" type="submit"
        >Registrate con Google <div class="icon-container">
          <Icon icon="flat-color-icons:google" width="25" height="25" />
        </div></button
      >
    </form>
  {/if}

  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
{/if}

<style>
  :global(button) {
    border: 1px solid #2f4858;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    text-align: center;
    margin-left: 0;
    font-weight: bolder;
    font-family: Apple, sans-serif !important;
    font-size: 1rem;
  }

  :global(button:hover) {
    border: 1px solid #2f4858;
    background-color: #2f4858;
    color: white;
  }
</style>
