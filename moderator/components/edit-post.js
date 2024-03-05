import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";

class EditPost extends HTMLElement {
	imageToggleId = 'toggle-image-button';
	titleId = 'title';
	textId = 'text';
	submitId = 'submit';

	constructor() {
		super();
		this.newPost = {
			deleteImage: false,
		};
		this.attachShadow({ mode: 'open' });
	}

	get post() {
		try { return JSON.parse(this.getAttribute('post')); }
		catch(e) { return {}; }
	}

	set post(value) { this.setAttribute('post', JSON.stringify(value)); }

	static get observedAttributes() { return ['post']; }

	attributeChangedCallback(name, oldValue, newValue) {
		if(name === 'post' && oldValue !== newValue) {
			if(newValue) {
				const newPost = JSON.parse(newValue);
				this.newPost.title = newPost.title;
				if(newPost.content && newPost.content.text) this.newPost.content = { text: newPost.content.text };
				if(newPost.keywords) this.newPost.keywords = newPost.keywords;
			}
			this.render();
		}
	}

	connectedCallback() { this.render(); }

	render() {
		if(!this.post) {
			this.shadowRoot.innerHTML = '';
			return;
		}
		this.shadowRoot.innerHTML = `
			<style>
				div.edit-post-section {
					position: fixed;
					width: 32%;
					margin-left: 10px;
				}
				div.edit-post-section form.edit-post {
					padding: 0 10px 10px 10px;
					background-color: white;
					border-radius: 5px;
				}
				div.edit-post-section form.edit-post label {
					display: block;
					padding-top: 10px;
					padding-bottom: 3px;
				}
				div.edit-post-section form.edit-post input[type="text"],
				div.edit-post-section form.edit-post textarea {
					width: 97%;
					norder-radius: 3px;
				}
				div.edit-post-section form.edit-post textarea {
					margin: 0;
					resize: none;
				}
				div.edit-post-section form.edit-post a.see-image,
				div.edit-post-section form.edit-post a.restore-image,
				div.edit-post-section form.edit-post a.delete-image {
					padding: 10px;
					margin: 10px;
					text-decoration: none;
					color: white;
					cursor: pointer;
				}
				div.edit-post-section form.edit-post a.see-image {
					background-color: #007bff;
				}
				div.edit-post-section form.edit-post a.delete-image {
					background-color: #dc3545;
				}
				div.edit-post-section form.edit-post a.restore-image {
					background-color: #28a745;
				}
				div.edit-post-section form.edit-post div.image-container {
					display: flex;
					justify-content: center;
				}
				div.edit-post-section form.edit-post p.position {
					margin: 0;
					padding: 10px 0;
				}
				div.edit-post-section form.edit-post div.keyword-container {
					display: flex;
					align-items: center;
					margin: 10px 0;
				}
				div.edit-post-section form.edit-post div.keyword-container input[type="checkbox"] {
					margin-right: 10px;
				}
				div.edit-post-section form.edit-post div.keyword-container label {
					padding: 0;
				}
				div.edit-post-section form.edit-post input[type="submit"] {
					margin-top: 10px;
				}
			</style>
			<div class="edit-post-section">
				<h1>Edit post</h1>
				<form class="edit-post" id="${this.submitId}">
					<label for="title">Titolo:</label>
					<input type="text" name="title" id="${this.titleId}" value="${this.newPost.title || ''}" />
					${this.post.content.text
						? `</br>
							<label for="content">Testo:</label>
							<textarea name="content" rows="4" id="${this.textId}">${this.newPost.content.text}</textarea>`
						: ''
					}
					${this.post.content.img
						? `	<div class="image-container">
								<a href="${Backend.at('media/image/'+this.post.content.img)}" target="_blank" class="see-image">Visualizza immagine</a>
								${this.newPost.deleteImage
									? `<a id="${this.imageToggleId}" class="restore-image">Ripristina immagine</a>`
									: `<a id="${this.imageToggleId}" class="delete-image">Elimina immagine</a>`
								}
							</div>`
						: ''
					}
					${this.post.content.position
						? `<p class="position">Latitudine: ${this.post.content.position.latitude}</br>Longitudine: ${this.post.content.position.longitude}</p>`
						: ''
					}
					${this.post.keywords
						? this.post.keywords.map(k =>
							`<div class="keyword-container">
								<input type="checkbox" id="${k}" ${this.newPost.keywords.includes(k) ? "checked" : ''} />
								<label for="${k}"><span class="keyword">#${k}</span></label>
							</div>`
						  ).join('')
						: ''
					}
					<input type="submit" value="Conferma" />
				</form>
			</div>
		`;
		// Copy styles from the main document to the shadow root to make the component styleable
		const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
		styles.forEach(style => this.shadowRoot.appendChild(style.cloneNode(true)));
		// Add event listeners
		this.shadowRoot.querySelector(`input#${this.titleId}`).addEventListener('input', e => this.newPost.title = e.target.value);
		if(this.post.content.text)
			this.shadowRoot.querySelector(`textarea#${this.textId}`).addEventListener('input', e => this.newPost.content.text = e.target.value);
		if(this.post.content.img)
			this.shadowRoot.querySelector(`#${this.imageToggleId}`).addEventListener('click', e => {
				e.preventDefault();
				this.newPost.deleteImage = !this.newPost.deleteImage;
				this.render();
			});
		if(this.post.keywords)
			this.post.keywords.forEach(k => {
				this.shadowRoot.querySelector(`input#${k}`).addEventListener('change', e => {
					if(e.target.checked) this.newPost.keywords.push(k);
					else this.newPost.keywords = this.newPost.keywords.filter(kw => kw !== k);
				});
			});
		// Submit event listener
		this.shadowRoot.querySelector(`form#${this.submitId}`).addEventListener('submit', async (e)=> {
			e.preventDefault();
			let content = {};
			if(this.post.content.text) content.text = this.newPost.content.text;
			if(this.post.content.position) content.position = this.post.content.position;
			const data = {
				title: this.newPost.title,
				content,
				keywords: this.newPost.keywords
			};
			if(this.post.content.img && this.newPost.deleteImage) {
				await Backend.delete('media/image', { postId: this.post._id }, Auth.getToken())
					.catch(e => {
						console.log(e)
						alert(`Errore durante l\'eliminazione dell\'immagine. Id: ${this.post.content.img}`);
					});
			}
			const { post } = await Backend.put('posts/'+this.post._id, data, Auth.getToken())
				.catch(e => {
					console.log(e);
					alert('Errore durante la modifica del post');
				});
			if(!post) return;
			const event = new CustomEvent('new-post', { bubbles: true, composed: true, detail: post });
			this.dispatchEvent(event);
		});
	}
}

customElements.define('my-edit-post', EditPost);
