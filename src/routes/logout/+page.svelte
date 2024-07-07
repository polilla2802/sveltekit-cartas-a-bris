<script lang="ts">
  import { onMount } from "svelte";
  import { signOutUser } from "$lib/auth";
  import { goto } from "$app/navigation"; // Ensure goto is imported for navigation
  import Welcome from "$lib/components/messages/Welcome.svelte";

  const title: string = "Logout";

  // Perform logout on component mount
  onMount(async () => {
    try {
      await signOutUser();
      goto("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.log("Error logging out:", error);
      // Handle error, such as showing a message to the user
    }
  });
</script>

<Welcome {title}></Welcome>

<p>Cerrando sessión...</p>
