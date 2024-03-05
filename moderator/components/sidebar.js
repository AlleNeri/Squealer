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
					height: 100%;
					margin-right: 15px;
					background-color: white;
					overflow: auto;
					z-index: 1;
					padding-top: 20px;
					padding: 15px;
				}
				.fixed-pos {
					position: fixed;
					width: 13%;
				}
			</style>
			<div class="sidebar">
				<div class="fixed-pos">
					<slot></slot>
				</div>
			</div>
		`;
	}
}

customElements.define('my-sidebar', Sidebar);
