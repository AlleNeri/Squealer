import { env } from '../env.js';

export class Backend {
	static async get(url) {
		const response = await fetch(`${env.apiUrl}${url}`);
		return response.json();
	}

	static async get(url, token) {
		const response = await fetch(`${env.apiUrl}${url}`, {
			headers: {
				'Authorization': token
			}
		});
		return response.json();
	}

	static async post(url, data) {
		const response = await fetch(`${env.BACKEND_URL}${url}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if(response.ok) return await response.json();
	}
}
