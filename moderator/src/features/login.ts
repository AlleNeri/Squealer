import { env } from '../env';
import { showDashboard } from './dashboard';
import { storeToken, getToken, removeToken, storeId, getId, removeId } from '../utils/storage';

if(!env.BACKEND_URL) throw new Error('BACKEND_URL not set');

const loginFormId = 'loginForm',
	usernameInputId = 'username',
	passwordInputId = 'password',
	logoutButtonId = 'logout';

export function showLogin():void {
	if(getToken() && getId()) {
		showUserInfo(getId()!);
		showDashboard();
		return;
	}
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
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
					storeToken(data.jwt.token);
					storeId(data.id);
					showUserInfo(data.id);
					showDashboard();
				}
			}
		})
		.catch(error => console.error(error));
}

function showUserInfo(id: string): void {
	const url = `${env.BACKEND_URL}/users/${id}`;
	fetch(url, { method: 'GET' })
		.then(response => response.json())
		.then(user => {
			if(user) {
				document.querySelector<HTMLDivElement>(`#${env.USER_INFO_DIV}`)!.innerHTML = `
					<button id="${logoutButtonId}">Logout</button>
					<div>
						<h3>${user.u_name}</h3>
						<i>${user.name.first} ${user.name.last}</i>
					</div>
				`;
				addActionToLogoutButton();
			}
		})
		.catch(error => console.error(error));
}

function addActionToLogoutButton(): void {
	const logoutButton = document.querySelector<HTMLButtonElement>(`#${logoutButtonId}`);
	logoutButton?.addEventListener('click', (event) => {
		event.preventDefault();
		logout();
	})
}

function logout() {
	removeToken();
	removeId();
	showLogin();
	document.querySelector<HTMLDivElement>(`#${env.USER_INFO_DIV}`)!.innerHTML = '';
}
