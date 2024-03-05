import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";

class EditChannel extends HTMLElement {
	editId = 'edit-channel';
	submitId = 'submit';
	nameId = 'name';
	descriptionId = 'description';

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	get channel() {
		try { return JSON.parse(this.getAttribute('channel')); }
		catch(e) { return {}; }
	}

	set channel(value) { this.setAttribute('channel', JSON.stringify(value)); }

	static get observedAttributes() { return ['channel']; }

	attributeChangedCallback(name, oldValue, newValue) {
		if(name === 'channel' && oldValue !== newValue) this.render();
	}

	connectedCallback() { this.render(); }

	render() {
		if(!this.channel) {
			this.shadowRoot.innerHTML = '';
			return;
		}
		this.shadowRoot.innerHTML = `
			<style>
				div.edit-channel-section {
					position: fixed;
					width: 32%;
					margin-left: 10px;
				}
				div.edit-channel-section form.edit-channel {
					padding: 0 10px 10px 10px;
					background-color: white;
					border-radius: 5px;
				}
				div.edit-channel-section form.edit-channel label {
					display: block;
					padding-top: 10px;
					padding-bottom: 3px;
				}
				div.edit-channel-section form.edit-channel input[type="text"],
				div.edit-channel-section form.edit-channel textarea {
					width: 97%;
				}
				div.edit-channel-section form.edit-channel textarea {
					resize: none;
				}
				div.edit-channel-section form.edit-channel input[type="submit"] {
					margin-top: 10px;
			</style>
			<div class="edit-channel-section">
				<h1>Edit Channel</h1>
				<form class="edit-channel" id="${this.submitId}">
					<label for="${this.nameId}">Name:</label>
					<input type="text" id="${this.nameId}" value="${this.channel.name}">
					<label for="${this.descriptionId}">Description:</label>
					<textarea id="${this.descriptionId}" rows="4">${this.channel.description}</textarea>
					<input type="submit" value="Conferma">
				</form>
			</div>
		`;

		this.shadowRoot.querySelector(`#${this.submitId}`)
			.addEventListener('submit', async (e) => {
				e.preventDefault();
				let newChannel = this.channel;
				newChannel.name = this.shadowRoot.querySelector(`#${this.nameId}`).value;
				newChannel.description = this.shadowRoot.querySelector(`#${this.descriptionId}`).value;
				const response = await Backend.put(`channels/${this.channel._id}`, { channel: newChannel }, Auth.getToken())
					.catch(error => {
						console.error(error)
						alert('Errore durante la modifica del canale');
					});
				if(response.channel) {
					const event = new CustomEvent('new-channel', {
						bubbles: true,
						composed: true,
						detail: response.channel
					});
					this.dispatchEvent(event);
				}
			});
	}
}

customElements.define('my-edit-channel', EditChannel);
