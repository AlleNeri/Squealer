import { Backend } from "../utils/backend.js";

class Channel extends HTMLElement {
	editId = 'edit-channel';

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
		this.shadowRoot.innerHTML = `
			<style>
				.channel {
					padding: 10px;
					margin: 10px 0;
					background-color: white;
					border-radius: 5px;
				}
				.channel img {
					max-height: 300px;
					max-width: 50%;
				}
				.channel span.reactions {
					color: #00000073;
					font-size: 0.9em;
					margin-right: 5px;
				}
				span.private {
					color: #00000073;
					font-size: 0.7em;
				}
				.channel div.channel-head {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
				.channel div.channel-head div h2 {
					margin: 0 10px 0 0;
				}
				.inline {
					display: flex;
					align-items: center;
				}
			</style>
			<div class="channel">
				<div class="channel-head">
					<div class="inline">
						<h2>${this.channel.name}</h2>
						<span class="private">${this.channel.private ? 'Private' : 'Public'}</span>
					</div>
					<button id="${this.editId + this.channel._id}">Modifica</button>
				</div>
				<p>${ this.channel.description ? this.channel.description : '' }</p>
			</div>
		`;

		// Add edit button if user is the owner
		this.shadowRoot.getElementById(this.editId + this.channel._id)
			.addEventListener('click', () => {
				const event = new CustomEvent('edit-channel', {
					bubbles: true,
					composed: true,
					detail: this.channel
				});
				this.dispatchEvent(event);
			});
	}
}

customElements.define('my-channel', Channel);
