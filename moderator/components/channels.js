import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";
import "./channel.js";

class Channels extends HTMLElement {
	channels = [];

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	get filterName() { return this.getAttribute("filterName"); }

	set filterName(value) {
		console.log(value);
		this.setAttribute("filterName", value);
	}

	static get observedAttributes() { return ["filterName"]; }

	attributeChangedCallback(name, oldValue, newValue) {
		console.log(name);
		if(name === "filterName" && oldValue !== newValue) {
			this.loadChannels();
			this.render();
		}
	}

	async loadChannels() {
		await Backend.get("channels/all", Auth.getToken())
			.then(data => {
				if(data)
					this.channels = data.filter(channel => channel.name.includes(this.filterName));
			})
			.catch(error => {
				alert("Si è verificato un errore durante il caricamento dei canali");
				console.log(error)
			});
	}

	connectedCallback() { this.render(); }

	async render() {
		await this.loadChannels();
		this.shadowRoot.innerHTML = `
			<style>
			</style>
			<div>
				${
					this.channels
						.map(channel => `<my-channel channel='${JSON.stringify(channel)}'></my-channel>`)
						.join("")
				}
			</div>
		`;
	}

	updateChannel(channel) {
		const index = this.channels.findIndex(c => c._id === channel._id);
		this.channels[index] = channel;
		this.render();
	}
}

customElements.define("my-channels", Channels);
