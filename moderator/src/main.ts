import { showLogin } from './features/login';

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<h1>Squealer Moderator dashboard</h1>
	<div id="content"></div>
`;

showLogin();
