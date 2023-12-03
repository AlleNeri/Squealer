import { showLogin } from './features/login';
import { env } from './env';

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<h1>Squealer Moderator dashboard</h1>
	<div id="${env.CONTENT_DIV}"></div>
	<div id="${env.USER_INFO_DIV}"></div>
`;

showLogin();
