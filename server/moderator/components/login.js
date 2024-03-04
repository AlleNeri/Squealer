import { Backend } from '../utils/backend.js';
import { Auth } from '../utils/auth.js';

class Login extends HTMLElement {
	loginFormId = 'loginForm';

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		if(!Auth.isTokenExpired()) window.location.href = '/posts.html';
		else this.render();
	}

	login(e) {
		e.preventDefault();
		const username = this.shadowRoot.querySelector('#username').value;
		const password = this.shadowRoot.querySelector('#password').value;
		Backend.post('users/login', { username, password })
			.then(data => {
				if(data.success && data.userType === 'mod') {
					Auth.setToken(data.jwt.token);
					// redirect to the home page
					window.location.href = '/posts.html';
				}
				else if(data.userType !== 'mod') {
					Auth.removeToken();
					alert("Non hai i permessi per accedere a questa pagina!");
				}
			})
			.catch(_ => alert("Qualcosa è andato storto durante il login, riprovare!"));
	}

	render() {
		this.shadowRoot.innerHTML = `
			<style>
				.login {
					width: 100%;
					height: 100%;
					display: flex;
					flex-direction: column;
					justify-content: center;
					align-items: center;
				}
				.login input {
					margin-bottom: 15px;
				}
			</style>
			<form class="login" id="${this.loginFormId}">
				<h1>Login</h1>
				<label for="username">Username: </label>
				<input type="text" placeholder="Username" id="username" />
				<label for="password">Password: </label>
				<input type="password" placeholder="Password" id="password" />
				<input type="submit" value="Login" />
			</form>
		`;
		this.shadowRoot.querySelector(`#${this.loginFormId}`)
			.addEventListener('submit', this.login.bind(this));
	}
}

customElements.define('my-login', Login);
