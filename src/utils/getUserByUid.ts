export async function getUserByUid(uid: string) {

	console.log(uid)
	
	try {
		const response = await fetch(
			`/api/users/firebase/${uid}`
		);

		if (!response.ok) {
			throw new Error(
				`Failed to fetch Frames Finalized, check user if exists`
			);
		}

		const data = await response.json();
		console.log(data);
		return data;
	} catch (e) {
		console.log(e);
	}

}