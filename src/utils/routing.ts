import { goto } from "$app/navigation";

export function takeMeToLogin() {
  goto("/login");
}

export function takeMeToLogout() {
  goto("/logout");
}

export function takeMeToRegister() {
  goto("/register");
}
