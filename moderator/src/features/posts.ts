import { env } from '../env';
import { getToken } from '../utils/storage';
import { addActionToUserLink} from './users';

const postsId = "posts";

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
				return fetch(
					`${env.BACKEND_URL}/users/${post.posted_by}`,
					{
						method: 'GET',
						headers: { 'Authorization': token }
					}
				)
					.then(response => response.json())
					.then(user => {
						postsDiv.innerHTML += `
							<div class='post'>
								<div class='post-header'>
									<h3>${post.title}</h3>
									<i><a href="${post.posted_by}">${user.u_name}</a></i>
									<button>Edit</button>
								</div>
								<div>
									${
										post.content.text
											? `<p>${post.content.text}</p>`
											: ''
									}
									${
										post.content.img
											? `<div class="preview-image"><img src="${env.BACKEND_URL}/media/image/${post.content.img}" alt="post image not found" /></div>`
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
						addActionToUserLink(post.posted_by);
					})
					.then(() => addActionToUserLink(post.posted_by))
					.catch(error => console.log(error));
			});
		})
		.catch(error => console.log(error));
}
