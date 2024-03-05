import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";
import "./post.js";

class Posts extends HTMLElement {
    posts = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get filterDate() {
        return this.getAttribute('filterDate');
    }

    set filterDate(value) {
        this.setAttribute('filterDate', value);
    }

	get filterSender() {
		return this.getAttribute('filterSender');
	}

	set filterSender(value) {
		this.setAttribute('filterSender', value);
	}

	get filterRecipient() {
		return this.getAttribute('filterRecipient');
	}

	set filterRecipient(value) {
		this.setAttribute('filterRecipient', value);
	}

	static get observedAttributes() {
		return ['filterDate', 'filterSender', 'filterRecipient'];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (['filterDate', 'filterSender', 'filterRecipient'].includes(name) && String(oldValue) !== String(newValue)) {
			this.render();
		}
	}

async loadPosts() {
	await Backend.get('posts', Auth.getToken())
		.then(async data => {
			this.posts = data.reverse();
			if (this.filterDate || this.filterSender || this.filterRecipient) {
				const filterDate = this.filterDate ? new Date(this.filterDate) : null;
				const filterDateUTC = filterDate ? Date.UTC(filterDate.getUTCFullYear(), filterDate.getUTCMonth(), filterDate.getUTCDate()) : null;
				this.posts = await Promise.all(this.posts.map(async post => {
					const postDate = new Date(post.date);
					const postDateUTC = Date.UTC(postDate.getUTCFullYear(), postDate.getUTCMonth(), postDate.getUTCDate());
					const isSameDate = filterDateUTC ? postDateUTC === filterDateUTC : true;
					if (this.filterDate && !isSameDate) {
						return null;
					}
					if (this.filterSender) {
						const user = await Backend.get(`users/${post.posted_by}`, Auth.getToken());
						if (!user || user.u_name !== this.filterSender) {
							return null;
						}
					}
					if (this.filterRecipient) {
						const channel = await Backend.get(`channels/${post.posted_on}`, Auth.getToken());
						if (!channel || channel.name !== this.filterRecipient) {
							return null;
						}
					}
					return post;
				}));
				this.posts = this.posts.filter(post => post !== null);
			}
		})
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
