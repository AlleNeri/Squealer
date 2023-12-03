import { env } from '../env';
import { getToken } from '../utils/storage';

const postsId = "posts";

export function showPosts() {
	document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
		<h2>Posts</h2>
		<div id='${postsId}'></div>
	`;
	populatePosts();
}

function populatePosts(): void {
	const token: string = getToken()!;
	fetch(
		`${env.BACKEND_URL}/posts`,
		{
			method: 'GET',
			headers: {
				'Authorization': token
			}
		}
	)
		.then(response => response.json())
		.then(posts => {
			if(!posts) return;
			const postsDiv = document.querySelector<HTMLDivElement>(`#${postsId}`)!;
			postsDiv.innerHTML = posts.map((post: any) => `
				<div class='post'>
					<div>
						<h3>${post.title}</h3>
						<i>${post.posted_by}</i>
						<p>${post.content.text}</p>
					</div>
					<div>
						<button>Edit</button>
					</div>
				</div>
			`).join('');
		})
		.catch(error => console.log(error));
}
