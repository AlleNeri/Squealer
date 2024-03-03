import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";
import "./user.js";

export class Users extends HTMLElement {
	users = [];

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	get filterUsername(){
		return this.getAttribute('filterUsername');
	}

	set filterUsername(value){
		this.setAttribute('filterUsername', value);
	}

	get filterFirstName() {
        return this.getAttribute('filterFirstName');
    }

    set filterFirstName(value) {
        this.setAttribute('filterFirstName', value);
    }

    get filterLastName() {
        return this.getAttribute('filterLastName');
    }

    set filterLastName(value) {
        this.setAttribute('filterLastName', value);
    }

    get filterType() {
        return this.getAttribute('filterType');
    }

    set filterType(value) {
        this.setAttribute('filterType', value);
    }

	static get observedAttributes() {
		return ['filterUsername', 'filterFirstName', 'filterLastName', 'filterType'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (['filterUsername', 'filterFirstName', 'filterLastName', 'filterType'].includes(name) && oldValue !== newValue) {
			this.render();
		}
	}

	async loadUsers() {
		await Backend.get('users', Auth.getToken())
			.then(data => {
				this.users = data;
				if (this.filterUsername || this.filterFirstName || this.filterLastName || this.filterType) {
					this.users = this.users.filter(user => {
						if (this.filterUsername && user.u_name && !user.u_name.includes(this.filterUsername)) return false;
						if (this.filterFirstName && user.name.first && !user.name.first.includes(this.filterFirstName)) return false;
						if (this.filterLastName && user.name.last && !user.name.last.includes(this.filterLastName)) return false;
						if (this.filterType && user.type && !user.type.includes(this.filterType)) return false;
						return true;
					});
				}
			})
			.catch(error => {
				alert('Si è verificato un errore durante il caricamento degli utenti');
				console.error(error);
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