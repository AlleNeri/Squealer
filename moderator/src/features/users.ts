import { getToken } from '../utils/storage';
import { env } from '../env';

const usersId = 'users';

export function showUsers() {
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h2>Users</h2>
		<div id='${usersId}' class="users-container"></div>
	`;
	populateUsers();
}

function populateUsers() {
	const token: string = getToken()!;
	fetch(
		`${env.BACKEND_URL}/users`,
		{
			method: 'GET',
			headers: { 'Authorization': token }
		}
	)
		.then(response => response.json())
		.then(users => {
			if(!users) return;
			const usersDiv = document.querySelector<HTMLDivElement>(`#${usersId}`)!;
			users.map((user: any) => {
				usersDiv.innerHTML += `
					<div class='user'>
						<div class='user-header'>
							<h3>${user.u_name}</h3>
							<i>${user.name.first} ${user.name.last}</i>
						</div>
						<div>
							<button>Edit</button>
						</div>
					</div>
				`;
			});
		});
}

// TODO: adjust this function to work properly
export function addActionToUserLink(href: string): void {
	document.querySelector<HTMLAnchorElement>(`a[href='${href}']`)!.addEventListener('click', (event) => {
		event.preventDefault();
		console.log('Clicked on user link', href);
	});
}
