import type { User } from "firebase/auth";

// Function to check if user registered with Google
export const isUserRegisteredWithGoogle = (user: User | null): boolean => {
	if (user) {
		const providerData = user.providerData;

		// Loop through providerData to check if Google provider exists
		for (const userInfo of providerData) {
			if (userInfo.providerId === "google.com") {
				return true; // User was registered using Google
			}
		}
	}

	return false; // User not registered using Google or user is null
};