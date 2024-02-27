import { Backend } from "../utils/backend.js";

class EditPost extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
		this.addEventListener('edit-post', e=> console.log(e.detail));
	}

	get post() {
		try { return JSON.parse(this.getAttribute('post')); }
		catch(e) { return {}; }
	}

	set post(value) { this.setAttribute('post', JSON.stringify(value)); }

	static get observedAttributes() { return ['post']; }

	attributeChangedCallback(name, oldValue, newValue) {
		if(name === 'post'  && oldValue !== newValue) this.render();
	}

	connectedCallback() { this.render(); }

	render() {
		if(!this.post) return;
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
				div.edit-post-section form.edit-post input,
				div.edit-post-section form.edit-post textarea {
					width: 97%;
					norder-radius: 3px;
				}
				div.edit-post-section form.edit-post textarea {
					margin: 0;
					resize: none;
				}
				div.edit-post-section form.edit-post a.see-image,
				div.edit-post-section form.edit-post a.delete-image {
					padding: 10px;
					margin: 10px;
					text-decoration: none;
					color: white;
				}
				div.edit-post-section form.edit-post a.see-image {
					background-color: #007bff;
				}
				div.edit-post-section form.edit-post a.delete-image {
					background-color: #dc3545;
				}
				div.edit-post-section form.edit-post div.image-container {
					display: flex;
					justify-content: space-between;
				}
				div.edit-post-section form.edit-post p.position,
				div.edit-post-section form.edit-post p.keywords {
					margin: 0;
					padding: 10px 0;
				}
				div.edit-post-section form.edit-post div.keyword-container {
					padding: 10px 0;
				}
			</style>
			<div class="edit-post-section">
				<h1>Edit post</h1>
				<form class="edit-post">
					<label for="title">Titolo:</label>
					<input type="text" name="title" value="${this.post.title || ''}" />
					${this.post.content.text
						? `</br>
							<label for="content">Testo:</label>
							<textarea name="content" rows="4">${this.post.content.text}</textarea>`
						: ''
					}
					${this.post.content.img
						? `	<div class="image-container">
								<a href="${Backend.at('media/image/'+this.post.content.img)}" target="_blank" class="see-image">Visualizza immagine</a>
								<a href="${Backend.at('media/image/'+this.post.content.img)}" target="_blank" class="delete-image">Elimina immagine</a>
							</div>`
						: ''
					}
					${this.post.content.position
						? `<p class="position">Latitudine: ${this.post.content.position.latitude}</br>Longitudine: ${this.post.content.position.longitude}</p>`
						: ''
					}
					${this.post.keywords
						? this.post.keywords.map(k => `<div class="keyword-container"><span class="keyword">#${k}</span></div>`).join('')
						: ''
					}
				</form>
			</div>
		`;
		// Copy styles from the main document to the shadow root to make the component styleable
		const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
		styles.forEach(style => this.shadowRoot.appendChild(style.cloneNode(true)));
	}
}

customElements.define('my-edit-post', EditPost);
