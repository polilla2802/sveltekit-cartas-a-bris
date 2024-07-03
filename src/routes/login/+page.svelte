<!-- src/routes/login.svelte -->
<script lang="ts">
  import { auth } from "$lib/firebase";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import {
    deleteCurrentUser,
    logInUserWithMail,
    signInWithGoogle,
  } from "$lib/auth";
  import { getAdditionalUserInfo, type User } from "firebase/auth";
  import { isUserRegisteredWithGoogle } from "$utils/isGoogle";

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
      await navigateToHome();

      // Redirect or perform any additional actions after successful registration
    } catch (e: any) {
      logging = false;
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
