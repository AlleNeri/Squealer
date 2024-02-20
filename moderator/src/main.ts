import { router } from './utils/router';
import { showBackHome } from './features/backHome';
import { showLogin } from './features/login';
import { env } from './env';
import { showDashboard } from './features/dashboard';
import { showUsers } from './features/users';
import { showPosts } from './features/posts';

import './style.css';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
	<h1>Squealer Moderator dashboard</h1>
	<div id="${env.CONTENT_DIV}"></div>
	<div id="${env.USER_INFO_DIV}"></div>
	<div id="${env.BACK_HOME_DIV}"></div>
`;

router.add("", showDashboard)
	.add("login", showLogin)
	.add("users", showUsers)
	.add("posts", showPosts);

showBackHome();
router.navigateTo("login");
