import { router } from '../utils/router';
import { env } from '../env';

const dashboardId = 'dashboard',
	usersButtonId = 'users-button',
	postsButtonId = 'posts-button';

export function showDashboard() {
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h2>Dashboard</h2>
		<div id="${dashboardId}">
			<p>Select the area you want to see</p>
			<button id="${usersButtonId}">Users</button>
			<button id="${postsButtonId}">Posts</button>
		</div>
	`;
	addActionToUserButton();
	addActionToPostsButton();
}

function addActionToUserButton() {
	document.querySelector<HTMLButtonElement>(`#${usersButtonId}`)!.addEventListener('click', () => router.navigateTo("users"));
}

function addActionToPostsButton() {
	document.querySelector<HTMLButtonElement>(`#${postsButtonId}`)!.addEventListener('click', () => router.navigateTo("posts"));
}
