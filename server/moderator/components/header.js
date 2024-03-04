import { Auth } from '../utils/auth.js';

class Header extends HTMLElement {
	logoutId = 'logout';

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
		if(name === 'isLogged' && oldValue !== newValue) this.render();
	}

	connectedCallback() { this.render(); }

	render() {
		// stiky header
		this.shadowRoot.innerHTML = `
			<style>
				.header {
					color: #ffffffa6;
					background-color: #001529;
					padding: 10px 50px;
					position: fixed;
					top: 0;
					width: 100%;
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
				.logout-link {
					cursor: pointer;
				}
			</style>
			<nav class="header">
				<ul>
					${ !this.isLogged ? `<li><a href="./login.html">Login</a></li>` : '' }
					${ this.isLogged
						? ` <li><a id="${this.logoutId}" class="logout-link">Logout</a></li>
							<li><a href="./posts.html">Posts</a></li>
							<li><a href="./users.html">Users</a></li>
							<li><a href="./channels.html">Channels</a></li>`
						: ''
					}
				</ul>
			</nav>
		`;
		// Add event listener to logout button
		if(this.isLogged)
			this.shadowRoot.querySelector(`#${this.logoutId}`)
				.addEventListener('click', () => {
					Auth.removeToken()
					window.location.href = './login.html';
				});
	}
}

customElements.define('my-header', Header);
