import { getToken } from '../utils/storage';
import { env } from '../env';

const usersId = 'users';
const nameFilterId = 'user-name-form';
const typeFilterId = 'user-type-form';

const userTypes = ['normal', 'vip', 'smm', 'mod', 'bot'];
const selectedTypes = [ ...userTypes ];
let name: string | undefined = undefined;

export function showUsers() {
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h2>Users</h2>
		<form class="search-container">
			<input type="text" id="${nameFilterId}" placeholder="Search by username" value="${name || ''}">
		</form>
		<form class="checkbox-container" id="${typeFilterId}">
			${userTypes.map((userType) => 
				`<div>
					<input type="checkbox" id='${userType}' checked>
					<label for='${userType}'>${userType}</label>
				</div>`
			).join('')}
		</form>
		<div id='${usersId}' class="users-container"></div>
	`;
	populateUsers(selectedTypes);
	setNameFilterListener();
	setTypeFilterListeners();
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
				if(type.includes(user.type) && (!name || user.u_name.includes(name))) usersDiv.innerHTML += `
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

function setNameFilterListener() {
	document.getElementById(nameFilterId)!.addEventListener('input', (event) => {
		const target = event.target as HTMLInputElement;
		name = target.value;
		populateUsers(selectedTypes);
	});
}

function setTypeFilterListeners() {
	document.getElementById(typeFilterId)!.addEventListener('change', (event) => {
		const target = event.target as HTMLInputElement;
		if(target.tagName !== 'INPUT') return;
		if(!userTypes.includes(target.id)) return;
		if(target.checked) selectedTypes.push(target.id);
		else selectedTypes.splice(selectedTypes.indexOf(target.id), 1);
		populateUsers(selectedTypes);
	});
}
