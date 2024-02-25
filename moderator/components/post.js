import { Backend } from "../utils/backend.js";

class Post extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
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
		this.shadowRoot.innerHTML = `
			<style>
				.post {
					padding: 10px;
					margin: 10px 0;
				}
				.post img {
					max-height: 300px;
					max-width: 50%;
				}
				.post span.keyword {
					margin-right: 5px;
					border: 1px solid #91d5ff;
					color: #1890ff;
					background: #e6f7ff;
					padding: 3px 5px;
					border-radius: 2px;
				}
				.post span.reactions {
					color: #00000073;
					font-size: 0.9em;
					margin-right: 5px;
				}
				.post span.date {
					color: #00000073;
					font-size: 0.7em;
				}
			</style>
			<div class="post">
				<h2>${this.post.title}</h2>
				${this.renderContent()}
				${this.renderKeywords()}
				${this.renderReactions()}
				</br>
				${this.renderDate()}
			</div>
		`;
	}

	renderContent() {
		let res = '';
		if(this.post.content) {
			if(this.post.content.text)
				res += `<p>${this.post.content.text}</p>`;
			if(this.post.content.img)
				res += `<img src="${Backend.at('media/image/'+this.post.content.img)}" alt="immagine del post"></br>`;
			if(this.post.content.position)
				res += `<p>Latitudine: ${this.post.content.position.latitude}, Longitudine: ${this.post.content.position.longitude}</p>`;
		}
		return res;
	}

	renderKeywords() {
		if(!this.post.keywords) return '';
		const keywords = this.post.keywords.map(keyword => `<span class="keyword">#${keyword}</span>`);
		return keywords.join('') + '</br></br>';
	}

	renderReactions() {
		const reactions = this.post.reactions || [];
		return `<span class="reactions">${reactions.length} visualizzazioni</span>`+
			`<span class="reactions">${reactions.filter(e => e.value === -2).length || 0} disgusto</span>`+
			`<span class="reactions">${reactions.filter(e => e.value === -1).length || 0} dislike</span>`+
			`<span class="reactions">${reactions.filter(e => e.value === 1).length || 0} like</span>`+
			`<span class="reactions">${reactions.filter(e => e.value === 2).length || 0} super like</span>`;
	}

	renderDate() {
		const date = new Date(this.post.date);
		return `<span class="date">${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.toLocaleTimeString()}</span>`;
	}
}

customElements.define('my-post', Post);
