class Sidebar extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() { this.render(); }

	render() {
		this.shadowRoot.innerHTML = `
			<style>
				.sidebar {
					width: 200px;
					height: 100%;
					position: fixed;
					top: 0;
					left: 0;
					background-color: white;
					overflow: auto;
					z-index: 1;
					padding-top: 20px;
					margin-top: 71px;
					padding: 15px;
				}
			</style>
			<div class="sidebar">
				<slot></slot>
			</div>
		`;
	}
}

customElements.define('my-sidebar', Sidebar);
