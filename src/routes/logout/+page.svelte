<script lang="ts">
  import { onMount } from "svelte";
  import { signOutUser } from "$lib/auth"; // Adjust path as per your project structure
  import { goto } from "$app/navigation"; // Import goto for navigation

  // Perform logout on component mount
  onMount(async () => {
    await signOutUser(); // Call signOutUser function from auth.ts
    goto("/"); // Redirect to home page after logout
  });
</script>

<h1>Logging out...</h1>
