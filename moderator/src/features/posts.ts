import { router } from '../utils/router';
import { env } from '../env';
import { getToken } from '../utils/storage';

const postsId: string = "posts";
const nameFilterId = 'post-name-form';
const dateFilterId = 'post-date-form';
const channelFilterId = 'post-channel-form';

let name: string | undefined = undefined;
let date: string | undefined = undefined;
let channel: string | undefined = undefined;
let channels: any[] = [];

export function showPosts() {
	fetchChannels().then(channels => {
		const directChannels = channels.filter((channel: any) => channel.name.startsWith("__direct__"));
		const otherChannels = channels.filter((channel: any) => !channel.name.startsWith("__direct__"));
		document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
			<h2>Posts</h2>
			<form class="search-container">
				<div>
					<input type="text" id="${nameFilterId}" placeholder="Search by username" value="${name || ''}">
				</div>
				<div>
					<input type="date" id="${dateFilterId}" value="${date || ''}">
				</div>
				<div>
					<select id="${channelFilterId}">
						<option value="">All Channels</option>
						<optgroup label="Other Channels">
							${otherChannels.map((channel: any) => `<option value="${channel._id}">${channel.name}</option>`).join('')}
						</optgroup>
						<optgroup label="Direct Channels">
							${directChannels.map((channel: any) => `<option value="${channel._id}">${channel.name}</option>`).join('')}
						</optgroup>
					</select>
				</div>
				
			</form>
			<div id='${postsId}' class="posts-container"></div>
		`;
		populatePosts();
		setNameFilterListener();
		setDateFilterListener();
		setChannelFilterListener();
	});
}

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

function populatePosts() {
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
			//order posts by date
			posts.sort((a: any, b: any) => {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
			const postsDiv = document.querySelector<HTMLDivElement>(`#${postsId}`)!;
			postsDiv.innerHTML = '';
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
					if((!name || user.u_name.includes(name)) && (!date || new Date(post.date).toISOString().split('T')[0] === date) && (!channel || post.posted_on === channel)) {
						const channel = channels.find((channel: any) => channel._id === post.posted_on);
						const tmp = document.createElement('div');
						tmp.classList.add('post');
						tmp.innerHTML = `
							<div class='post-header'>
								<h3>${post.title}</h3>
								<i><a href="/users/${post.posted_by}">${user.u_name}</a></i>
								${channel ? `<p>§${channel.name}</p>` : ''}
								<p>${new Date(post.date).toLocaleDateString()}</p>
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
							<div class='post-footer'>
								<p>Keywords: ${post.keywords.map((keyword: string) => `#${keyword}`).join(', ')}</p>
							</div>
							`;
							postsDiv.appendChild(tmp);
        					addListenerToEditButton(post._id);
						}
					})
					.catch(error => console.log(error));
			});
		})
		.catch(error => console.log(error));
}

function setNameFilterListener() {
	document.getElementById(nameFilterId)!.addEventListener('input', (event) => {
		const target = event.target as HTMLInputElement;
		name = target.value;
		populatePosts();
	});
}

function setDateFilterListener() {
	document.getElementById(dateFilterId)!.addEventListener('input', (event) => {
		const target = event.target as HTMLInputElement;
		date = target.value;
		populatePosts();
	});
}

function setChannelFilterListener() {
    document.getElementById(channelFilterId)!.addEventListener('change', (event) => {
        const target = event.target as HTMLSelectElement;
        channel = target.value;
        populatePosts();
    });
}

function addListenerToEditButton(postId: string) {
	document.getElementById(`${postId}`)!.addEventListener('click', () => router.navigateTo(`/posts/${postId}`));
}
