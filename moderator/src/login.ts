import { env } from './env';
import { showDashboard } from './dashboard';

if(!env.BACKEND_URL) throw new Error('BACKEND_URL not set');

const loginFormId = 'loginForm';

export function showLogin():void {
	document.querySelector<HTMLDivElement>('#content')!.innerHTML = `
		<h2>Login</h2>
		<form id="${loginFormId}">
			<input type="text" id="username" placeholder="Username" />
			<input type="password" id="password" placeholder="Password" />
			<input type="submit" value="Login" />
		</form>
	`;
	addActionToLoginButton();
}

function addActionToLoginButton(): void {
	const loginForm = document.querySelector<HTMLFormElement>(`#${loginFormId}`);
	loginForm?.addEventListener('submit', (event) => {
		event.preventDefault();
		const username = document.querySelector<HTMLInputElement>('#username')!.value;
		const password = document.querySelector<HTMLInputElement>('#password')!.value;
		login(username, password);
	})
}

function login(username:string, password:string) {
	const url = `${process.env.BACKEND_URL}/login`;
	const body = { username, password };
	fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(body)
	})
		.then(response => response.json())
		.then(data => {
			if (data.success) showDashboard();
		}
	)
}
