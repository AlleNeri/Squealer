class Header extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	get isLogged() {
		return this.hasAttribute('isLogged')
			? this.getAttribute('isLogged').toLowerCase() === 'true'
			: false;
	}

	set isLogged(value) { this.setAttribute('isLogged', value); }

	static get observedAttributes() { return ['isLogged']; }

	attributeChangedCallback(name, oldValue, newValue) {
		if(name === 'isLogged') this.render();
	}

	connectedCallback() { this.render(); }

	render() {
		this.shadowRoot.innerHTML = `
			<style>
				.header {
					color: #ffffffa6;
					background-color: #001529;
					padding: 10px 50px;
				}
				.header ul {
					list-style-type: none;
					overflow: hidden;
				}
				.header ul li {
					float: left;
					padding: 0 10px;
				}
				.header ul li a {
					text-decoration: none;
					color: #ffffffa6;
				}
			</style>
			<nav class="header">
				<ul>
					<li><a href="./index.html">Home</a></li>
					${ this.isLogged
						? `	<li><a href="./posts.html">Posts</a></li>
							<li><a href="./users.html">Users</a></li>
							<li><a href="./channels.html">Channels</a></li>`
						: ''
					}
				</ul>
			</nav>
		`;
	}
}

customElements.define('my-header', Header);
