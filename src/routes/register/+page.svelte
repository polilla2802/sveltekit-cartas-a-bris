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
  import Welcome from "$lib/components/messages/Welcome.svelte";

  const title: string = "Registrate";

  let userName: string = "";
  let name: string = "";
  let phoneNumber: string = "";
  let email: string = "";
  let password: string = "";
  let gender: string = "";
  let age: number;
  let error: string | undefined; // Define error as string or undefined

  let registering = false;

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

    console.log(uid);
    console.log(displayName);
    console.log(email);
    console.log(isGoogle);

    const formData = new FormData();
    if (isGoogle) {
      formData.append("firebaseUid", uid); // Assuming you want to send user ID
      formData.append("userName", displayName); // Assuming you want to send user ID
      formData.append("name", displayName); // Assuming you want to send user ID
      formData.append("email", userCredential.email as string); // Assuming you want to send user ID
    } else {
      formData.append("firebaseUid", uid); // Assuming you want to send user ID
      formData.append("userName", userName); // Assuming you want to send user ID
      formData.append("name", name); // Assuming you want to send user ID
      formData.append("phoneNumber", phoneNumber); // Assuming you want to send user ID
      formData.append("email", email); // Assuming you want to send user ID
      formData.append("gender", gender); // Assuming you want to send user ID
      // TODO: check if age value exists and then parse it to string
      formData.append("age", age.toString()); // Assuming you want to send user ID
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

<Welcome {title}></Welcome>

{#if registering}
  <p>Registrando...</p>
{:else}
  <form on:submit|preventDefault={() => registerUserWithMail(email, password)}>
    <label>
      Usuario: <span class="text-red-500">*</span>
      <input type="text" bind:value={userName} required />
    </label>
    <label>
      Nombre Completo: <span class="text-red-500">*</span>
      <input type="text" bind:value={name} required />
    </label>
    <label>
      Email: <span class="text-red-500">*</span>
      <input type="email" bind:value={email} required />
    </label>
    <label>
      Password: <span class="text-red-500">*</span>
      <input type="password" bind:value={password} required />
    </label>
    <label>
      Teléfono:
      <input type="tel" bind:value={phoneNumber} />
    </label>
    <label>
      Edad:
      <input type="number" bind:value={age} max="100" min="0" />
    </label>
    <label>
      Sexo:
      <select bind:value={gender}>
        <option value="" disabled selected>Seleccionar</option>
        <option value="M">M</option>
        <option value="F">F</option>
        <option value="O">Otro</option>
      </select>
    </label>
    <button class="form-btn" type="submit">Registrate con Email</button>
  </form>
  {#if !currentUser}
    <form on:submit|preventDefault={() => registerUserWithGoogle()}>
      <button class="form-btn google-btn flex gap-2" type="submit"
        >Registrate con Google <div class="icon-container">
          <Icon icon="flat-color-icons:google" width="25" height="25" />
        </div></button
      >
    </form>
  {/if}

  {#if error}
    <p class="text-center text-red-500">{error}</p>
  {/if}
{/if}
