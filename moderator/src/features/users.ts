import { getToken } from '../utils/storage';
import { env } from '../env';

const usersId = 'users';
const userTypes = ['normal', 'vip', 'smm', 'mod', 'bot'];
const selectedTypes = [ ...userTypes ];

export function showUsers() {
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h2>Users</h2>
		<form class="checkbox-container" id="user-type-form">
			${userTypes.map((userType) => 
				`<input type="checkbox" id='${userType}' checked>
				<label for='${userType}'>${userType}</label>`
			).join('')}
		</form>
		<div id='${usersId}' class="users-container"></div>
	`;
	populateUsers(selectedTypes);
	setCheckboxListeners();
}

function populateUsers(type: string[]) {
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
			usersDiv.innerHTML = '';
			users.map((user: any) => {
				if(type.includes(user.type)) usersDiv.innerHTML += `
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

function setCheckboxListeners() {
	document.getElementById('user-type-form')!.addEventListener('change', (event) => {
		const target = event.target as HTMLInputElement;
		if(target.tagName !== 'INPUT') return;
		if(!userTypes.includes(target.id)) return;
		if(target.checked) selectedTypes.push(target.id);
		else selectedTypes.splice(selectedTypes.indexOf(target.id), 1);
		populateUsers(selectedTypes);
	});
}
