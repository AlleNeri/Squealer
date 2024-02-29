import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";
import "./post.js";

class Posts extends HTMLElement {
	posts = [];

	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	async loadPosts() {
		await Backend.get('posts', Auth.getToken())
			.then(data => this.posts = data.reverse())
			.catch(error => {
				alert('Si è verificato un errore durante il caricamento dei post.');
				console.log(error);
			});
	}

	connectedCallback() { this.render(); }

	async render() {
		await this.loadPosts();
		this.shadowRoot.innerHTML = `
			<style>
			</style>
			<div>
				${
					this.posts
						.map(post => `<my-post post='${JSON.stringify(post)}'></my-post>`)
						.join('')
				}
			</div>
		`;
	}

	updatePost(post) {
		const index = this.posts.findIndex(p => p._id === post._id);
		this.posts[index] = post;
		this.render();
	}
}

customElements.define('my-posts', Posts);
