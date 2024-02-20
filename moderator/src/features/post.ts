import { env } from '../env';
import { getToken } from '../utils/storage';

const postId: string = 'post';

export function showPost(postId: string) {
	document.querySelector<HTMLElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h1>Post</h1>
		<div id="post"></div>
	`;
	populatePost(postId);
}

function populatePost(postId: string) {
	const token: string = getToken()!;
	const postDiv = document.querySelector<HTMLElement>('#post')!;
	fetch(
		`${env.BACKEND_URL}/posts/${postId}`,
		{
			method: 'GET',
			headers: { 'Authorization': token }
		}
	)
		.then(response => response.json())
		.then(post => {
			if(!post) return;
			fetch(
				`${env.BACKEND_URL}/users/${post.posted_by}`,
				{
					method: 'GET',
					headers: { 'Authorization': token }
				}
			)
			.then(response => response.json())
			.then(user => {
				postDiv.innerHTML = `
					<div class='post'>
						<div class='post-header'>
							<h3>${post.title}</h3>
							<i><a href="/posts/${post.posted_by}">${user.u_name}</a></i>
						</div>
						<div>
							${
								post.content.text
									? `<p>${post.content.text}</p>`
									: ''
							}
							${
								post.content.img
									? `<img src="${env.BACKEND_URL}/media/image/${post.content.img}" alt="immagine non disponibile" width="300px" />`
									: ''
							}
							${
								post.content.position
									? `<p>Latitude: ${post.content.position.latitude}, Longitude: ${post.content.position.longitude}</p>`
									: ''
							}
						</div>
					</div>
				`;
			})
			.catch(err => console.error(err));
		})
		.catch(error => console.log(error));
}
