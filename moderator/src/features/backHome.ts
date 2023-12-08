import { env } from '../env';
import { showLogin } from './login';

import homeIcon from '../assets/home.svg';

const backHomeButtonId = 'backHome'

export function showBackHome() {
	document.querySelector<HTMLDivElement>(`#${env.BACK_HOME_DIV}`)!.innerHTML = `
		<button id="${backHomeButtonId}">
			<img src="${homeIcon}" alt="Home Page" width="30" height="30" >
		</button>
	`;
	addActionToBackHomeButton();
}

function addActionToBackHomeButton() {
	document.querySelector<HTMLButtonElement>(`#${backHomeButtonId}`)!.addEventListener('click', () => {
		showLogin();
	});
}
