<script lang="ts">
  import { onMount } from "svelte";
  import { signOutUser } from "$lib/auth";
  import { goto } from "$app/navigation"; // Ensure goto is imported for navigation

  // Perform logout on component mount
  onMount(async () => {
    try {
      await signOutUser();
      goto("/"); // Redirect to home page after successful logout
    } catch (error) {
      console.error("Error logging out:", error);
      // Handle error, such as showing a message to the user
    }
  });
</script>

<h1>Logging out...</h1>
