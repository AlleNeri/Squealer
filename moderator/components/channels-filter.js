class ChannelsFilter extends HTMLElement {
	applyId = "applyFilter";
	filterNameId = "filterName";
	filterEvent = "filter-applied";

	constructor() {
		super();
		this.attachShadow({ mode: "open" });
	}

	connectedCallback() { this.render(); }

	render() {
		console.log("Rendering filter");
		this.shadowRoot.innerHTML = `
			<style>
				input[type="text"], button {
					width: 100%;
					padding: 10px 15px;
					margin: 8px 0;
					box-sizing: border-box;
					border: 2px solid #ccc;
					border-radius: 4px;
					font-size: 16px;
				}
				button {
					background-color: #007bff;
					color: white;
					border: none;
					cursor: pointer;
				}
				button:hover {
					opacity: 0.8;
				}
				div {
					display: flex;
					flex-direction: column;
					align-items: flex-start;
				}
			</style>
			<div>
				<label for="${this.filterNameId}">Name:</label>
				<input type="text" id="${this.filterNameId}" placeholder="Enter Channels Name" />
				<button id="${this.applyId}">Apply Filter</button>
			</div>
		`;

		// Add event listeners
		this.shadowRoot.getElementById(this.applyId)
			.addEventListener("click", e => {
				e.preventDefault();
				const name = this.shadowRoot.getElementById("filterName").value;
				// Dispatch event to notify the filter has been applied
				const event = new CustomEvent(this.filterEvent, { bubbles: true, composed: true, detail: name });
				this.dispatchEvent(event);
			});
	}
}

customElements.define("my-channels-filter", ChannelsFilter);
