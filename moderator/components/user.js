import { Backend } from "../utils/backend.js";

class User extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	get user() {
		try { return JSON.parse(this.getAttribute("user")); }
		catch(e) { return {}; }
	}

	set user(value) { this.setAttribute("user", JSON.stringify(value)); }

	static get observedAttributes() { return ["user"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		if(name === "user" && oldValue !== newValue) this.render();
	}

	connectedCallback() { this.render(); }

	render() {
		console.log(this.user);
		this.shadowRoot.innerHTML = `
			<style>
				.user {
					padding: 10px;
					margin: 10px 0;
				}
				.user span.name,
				.user span.type {
					color: #00000073;
					font-size: 0.9em;
					margin-right: 5px;
				}
				.user span.type {
					margin-left: 5px;
				}
				.user span.email {
					color: #00000073;
					font-size: 0.7em;
				}
				.user div.inline {
					display: flex;
					/* vertical align middle */
					align-items: center;
				}
				.user div.inline img.avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 10px;
					object-fit: cover;
					object-position: center;
				}
			</style>
			<div class='user'>
				<div class="inline">
					${ this.user.img
						? `<img src="${Backend.at('media/image/'+this.user.img)}" class="avatar" alt="avatar dell'utente" >`
						: ""
					}
					<h2>${this.user.u_name}</h2>
					${this.renderType()}
				</div>
				<span class="name">${this.user.name.first} ${this.user.name.last}</span>
				<span class="email">${this.user.email}</span>
			</div>
		`;
	}

	renderType() {
		switch(this.user.type) {
			case "mod":
				return "<span class='type'>Moderatore</span>";
			case "smm":
				return "<span class='type'>Social Media Manager</span>";
			case "normal":
				return "<span class='type'>Normale</span>";
			case "vip":
				return "<span class='type'>Vip</span>";
			default: return "";
		}
	}
}

customElements.define("my-user", User);
