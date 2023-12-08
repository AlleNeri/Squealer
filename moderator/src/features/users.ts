export function showUsers() {
	console.log('Showing users');
}

// TODO: adjust this function to work properly
export function addActionToUserLink(href: string): void {
	document.querySelector<HTMLAnchorElement>(`a[href='${href}']`)!.addEventListener('click', (event) => {
		event.preventDefault();
		console.log('Clicked on user link', href);
	});
}
