import { env } from '../env';
import { getToken } from '../utils/storage';

const postId: string = 'post';
let channels: any[] = [];

export function fetchChannels() {
    const token: string = getToken()!;
    return fetch(
        `${env.BACKEND_URL}/channels/all`,
        {
            method: 'GET',
            headers: { 'Authorization': token }
        }
    )
    .then(response => response.json())
    .then(data => {
        channels = data;
        return channels;
    });
}

export function showPost(postId: string) {
    fetchChannels().then(() => {
        document.querySelector<HTMLElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
            <h1>Post</h1>
            <div id="post"></div>
        `;
        populatePost(postId);
    });
}

function setupRemoveButton(removeButton: HTMLElement) {
    removeButton.addEventListener('click', (event: MouseEvent) => {
        event.preventDefault();
        (removeButton.parentNode as HTMLElement).remove();
    });
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
				const channel = channels.find((channel: any) => channel._id === post.posted_on);
				postDiv.innerHTML = `
					<div class='post'>
						<div class='post-header'>
							<h3>${post.title}</h3>
							<i><a href="/posts/${post.posted_by}">${user.u_name}</a></i>
							${channel ? `<p>§${channel.name}</p>` : ''}
							<button id="edit-${post._id}">Edit</button>
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
						<div class='post-footer'>
							<p>Keywords: ${post.keywords.map((keyword: string) => `#${keyword}`).join(', ')}</p>
						</div>
					</div>
					<form id="edit-form-${post._id}" class="edit-form" style="display: none;">
						<label class="form-label">
							Title:
							<input type="text" name="title" value="${post.title}" class="form-input">
						</label>
						${
							post.content.text
								? `<label class="form-label">
									Text:
									<textarea name="text" class="form-input">${post.content.text}</textarea>
								   </label>`
								: ''
						}
						<div class="form-label">
							Keywords:
							<div id="keywords-container">
								${post.keywords.map((keyword: string) => {
									// Remove special characters from the keyword
									const sanitizedKeyword = keyword.replace(/[^\w\s]/gi, '');
									return `<div class="keyword-row"><span class="keyword">${sanitizedKeyword}</span><button class="remove-keyword" type="button">-</button></div>`;
								}).join('')}
							</div>
							<div class="input-container">
								<input type="text" id="new-keyword" class="form-input">
								<button id="add-keyword" type="button">+</button>
							</div>
						</div>
						<label class="form-label">
							Channel:
							<select name="posted_on" class="form-input">
								${channels.filter((channel: any) => !channel.name.startsWith("__direct__")).map((channel: any) => `<option value="${channel._id}"${channel._id === post.posted_on ? ' selected' : ''}>${channel.name}</option>`).join('')}
							</select>
						</label>
						<button type="submit" class="form-button">Update</button>
					</form>
				`;

				document.getElementById('add-keyword')!.addEventListener('click', (event) => {
					const newKeywordInput = document.getElementById('new-keyword') as HTMLInputElement;
					let newKeyword = newKeywordInput.value;
					if (newKeyword) {
						// Remove special characters from the new keyword
						newKeyword = newKeyword.replace(/[^\w\s]/gi, '');

						const keywordsContainer = document.getElementById('keywords-container')!;
						const newKeywordElement = document.createElement('div');
						newKeywordElement.className = 'keyword-row';
						newKeywordElement.innerHTML = `<span class="keyword">${newKeyword}</span><button class="remove-keyword" type="button">-</button>`;
						keywordsContainer.appendChild(newKeywordElement);
						newKeywordInput.value = '';

						const newRemoveButton = newKeywordElement.querySelector('.remove-keyword') as HTMLElement;
						setupRemoveButton(newRemoveButton);
					}
				});

				Array.from(document.getElementsByClassName('remove-keyword')).forEach((removeButton: any) => {
					removeButton.addEventListener('click', (event: MouseEvent) => {
						event.preventDefault();
						(removeButton.parentNode as HTMLElement).remove();
					});
				});

				document.getElementById(`edit-${post._id}`)!.addEventListener('click', () => {
					document.getElementById(`edit-form-${post._id}`)!.style.display = 'block';
				});

				document.getElementById(`edit-form-${post._id}`)!.addEventListener('submit', (event) => {
					event.preventDefault();
					const formData = new FormData(event.target as HTMLFormElement);
					const keywordsContainer = document.getElementById('keywords-container')!;
					const keywords = Array.from(keywordsContainer.getElementsByClassName('keyword')).map((keywordElement: any) => {
						// Remove special characters from the keyword before saving
						return keywordElement.textContent.replace(/[^\w\s]/gi, '');
					});
					const updatedPost = {
						title: formData.get('title'),
						content: {
							text: formData.get('text')
						},
						keywords: keywords,
						posted_on: formData.get('posted_on'),
						posted_by: post.posted_by
					};
					fetch(
						`${env.BACKEND_URL}/posts/${post._id}`,
						{
							method: 'PUT',
							headers: { 'Authorization': token, 'Content-Type': 'application/json' },
							body: JSON.stringify({ post: updatedPost })
						}
					)
					.then(response => response.json())
					.then(updatedPost => {
						// Refresh the post
						populatePost(updatedPost._id);
					})
					.catch(error => console.log(error));
				});
			})
			.catch(err => console.error(err));
		})
		.catch(error => console.log(error));
}
