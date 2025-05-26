<!-- src/routes/login.svelte -->
<script lang="ts">
  import { auth } from "$lib/firebase/firebase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    deleteCurrentUser,
    logInUserWithMail,
    signInWithGoogle,
  } from "$lib/firebase/auth";
  import { getAdditionalUserInfo, type User } from "firebase/auth";
  import { isUserRegisteredWithGoogle } from "$utils/isGoogle";
  import Icon from "@iconify/svelte";
  import Welcome from "$lib/components/messages/Welcome.svelte";

  const title: string = "Login";

  let email = "";
  let password = "";
  let error: string | undefined; // Define error as string or undefined

  let logging = false;

  let currentUser: User | null = null; // Initialize currentUser to null

  const registerUser = async (userCredential: User | null) => {
    if (!userCredential) {
      // Handle case where userCredential is null or undefined
      return;
    }

    console.log(userCredential);
    
    const isGoogle = isUserRegisteredWithGoogle(userCredential);

    const uid = userCredential.uid as string;
    const displayName = userCredential.displayName as string;
    const phoneNumber = userCredential.phoneNumber as string;
    const email = userCredential.email as string;

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
      logging = false;
      error = e;
      // Handle error state or display error message to user
      console.log("Error registering user data:", e);
      await deleteCurrentUser();
    }
  };

  const navigateToHome = async () => {
    await goto("/");
  };

  const loginUserWithMail = async () => {
    logging = true;

    try {
      const userCredential = await logInUserWithMail(email, password);
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
  <Welcome {title}></Welcome>

  {#if logging}
    <p>Iniciando Sesión...</p>
  {:else}
    <form on:submit|preventDefault={loginUserWithMail}>
      <label>
        Email:
        <input type="email" bind:value={email} required />
      </label>
      <label>
        Password:
        <input type="password" bind:value={password} required />
      </label>
      <button class="form-btn" type="submit">Login con Email</button>
    </form>
    <form on:submit|preventDefault={loginUserWithGoogle}>
      <button class="form-btn google-btn flex gap-2" type="submit"
        >Login con Google <div class="icon-container">
          <Icon icon="flat-color-icons:google" width="25" height="25" />
        </div></button
      >
    </form>
    {#if error}
    <p class="text-center text-red-500">{error}</p>
    {/if}
  {/if}
{/if}

<style>
</style>
