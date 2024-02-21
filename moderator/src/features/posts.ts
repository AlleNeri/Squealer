import { router } from '../utils/router';
import { env } from '../env';
import { getToken } from '../utils/storage';

const postsId: string = "posts";

export function showPosts() {
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h2>Posts</h2>
		<div id='${postsId}' class="posts-container"></div>
	`;
	populatePosts();
}

function populatePosts(): void {
	const token: string = getToken()!;
	const postsDiv = document.querySelector<HTMLDivElement>(`#${postsId}`)!;
	fetch(
		`${env.BACKEND_URL}/posts`,
		{
			method: 'GET',
			headers: { 'Authorization': token }
		}
	)
		.then(response => response.json())
		.then(posts => {
			if(!posts) return;
			//order posts by date
			posts.sort((a: any, b: any) => {
				return new Date(b.posted_on).getTime() - new Date(a.posted_on).getTime();
			});
			posts.map(async (post: any) => {
				await fetch(
					`${env.BACKEND_URL}/users/${post.posted_by}`,
					{
						method: 'GET',
						headers: { 'Authorization': token }
					}
				)
					.then(response => response.json())
					.then(user => {
						const tmp = document.createElement('div');
						tmp.classList.add('post');
						tmp.innerHTML = `
							<div class='post-header'>
								<h3>${post.title}</h3>
								<i><a href="/users/${post.posted_by}">${user.u_name}</a></i>
								<button id="${post._id}">Edit</button>
							</div>
							<div>
								${
									post.content.text
										? `<p>${post.content.text}</p>`
										: ''
								}
								${
									post.content.img
										? `<a href="${env.BACKEND_URL}/media/image/${post.content.img}" target="_blank">immagine</a>`
										: ''
								}
								${
									post.content.position
										? `<p>Latitude: ${post.content.position.latitude}, Longitude: ${post.content.position.longitude}</p>`
										: ''
								}
							</div>
						`;
						postsDiv.appendChild(tmp);
					})
					.then(() => addListenerToEditButton(post._id))
					.catch(error => console.log(error));
			});
		})
		.catch(error => console.log(error));
}

function addListenerToEditButton(postId: string) {
	document.getElementById(`${postId}`)!.addEventListener('click', () => router.navigateTo(`/posts/${postId}`));
}
