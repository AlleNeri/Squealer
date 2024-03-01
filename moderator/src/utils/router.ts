import Router from 'vanilla-router';

export const router = new Router({
	mode: 'history',
	page404: (path: string) => {
		console.log('"/' + path + '" Page not found');
		//TODO: show 404 page
	}
});

// for backward and forward button
router.addUriListener();
