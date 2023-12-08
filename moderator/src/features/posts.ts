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
						const postsDiv = document.querySelector<HTMLDivElement>(`#${postsId}`)!;
						postsDiv.innerHTML += `
							<div class='post'>
								<div class='post-header'>
									<h3>${post.title}</h3>
									<i><a href="${post.posted_by}">${user.u_name}</a></i>
									<button>Edit</button>
								</div>
								<div>
									<p>${post.content.text}</p>
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
