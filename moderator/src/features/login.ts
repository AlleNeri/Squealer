import { env } from '../env';
import { showDashboard } from './dashboard';

if(!env.BACKEND_URL) throw new Error('BACKEND_URL not set');

const loginFormId = 'loginForm',
	usernameInputId = 'username',
	passwordInputId = 'password';

export function showLogin():void {
	if(localStorage.getItem(env.TOKEN_NAME)) return showDashboard();
	document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
		<h2>Login</h2>
		<form id="${loginFormId}">
			<input type="text" id="${usernameInputId}" placeholder="Username" />
			<input type="password" id="${passwordInputId}" placeholder="Password" />
			<input type="submit" value="Login" />
		</form>
	`;
	addActionToLoginButton();
}

function addActionToLoginButton(): void {
	const loginForm = document.querySelector<HTMLFormElement>(`#${loginFormId}`);
	loginForm?.addEventListener('submit', (event) => {
		event.preventDefault();
		const username = document.querySelector<HTMLInputElement>(`#${usernameInputId}`)!.value;
		const password = document.querySelector<HTMLInputElement>(`#${passwordInputId}`)!.value;
		login(username, password);
	})
}

function login(username:string, password:string) {
	const url = `${env.BACKEND_URL}/users/login`;
	const body = { username, password };
	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
		.then(response => response.json())
		.then(data => {
			if(data.success) {
				if(data.userType !== "mod") alert('You are not a moderator');
				else {
					localStorage.setItem(env.TOKEN_NAME, data.jwt.token);
					showDashboard();
				}
			}
		})
		.catch(error => console.error(error));
}
