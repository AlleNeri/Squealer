import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";
import "./user.js";

export class Users extends HTMLElement {
	users = [];

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async loadUsers() {
		await Backend.get('users', Auth.getToken())
			.then(data => this.users = data)
			.catch(error => {
				alert('Si è verificato un errore durante il caricamento degli utenti');
				console.error(error)
			});
	}

	connectedCallback() { this.render(); }

	async render() {
		await this.loadUsers();
		this.shadowRoot.innerHTML = `
			<style>
				ul { list-style: none; padding: 0; }
				li { margin-bottom: 10px; }
			</style>
			<div>
				${
					this.users
						.map(user => `<my-user user='${JSON.stringify(user)}'></my-user>`)
						.join('')
				}
			</div>
		`;
	}
}

customElements.define("my-users", Users);
