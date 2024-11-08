import { env } from '../env.js';

export class Backend {
	static at(url) { return `${env.BACKEND_URL}${url}`; }

	static async get(url) {
		const response = await fetch(this.at(url));
		return response.json();
	}

	static async get(url, token) {
		const response = await fetch(this.at(url), {
			headers: {
				'Authorization': token
			}
		});
		return response.json();
	}

	static async post(url, data) {
		const response = await fetch(this.at(url), {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		});
		if(response.ok) return await response.json();
	}

	static async put(url, data, token) {
		const response = await fetch(this.at(url), {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify(data)
		});
		if(response.ok) return await response.json();
	}

	static async delete(url, body, token) {
		const response = await fetch(this.at(url), {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': token
			},
			body: JSON.stringify(body)
		});
		if(response.ok) return await response.json();
	}
}
