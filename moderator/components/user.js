import { Backend } from "../utils/backend.js";

class User extends HTMLElement {
    editId = 'edit-user';

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get user() {
        try { return JSON.parse(this.getAttribute("user")); }
        catch(e) { return {}; }
    }

    set user(value) { this.setAttribute("user", JSON.stringify(value)); }

    static get observedAttributes() { return ["user"]; }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === "user" && oldValue !== newValue) this.render();
    }

    connectedCallback() { this.render(); }

    render() {
        this.shadowRoot.innerHTML = `
			<style>
				.user {
					padding: 10px;
					margin: 10px 0;
					background-color: white;
					border-radius: 5px;
				}
				span.name,
				span.type,
				span.block {
					color: #00000073;
					font-size: 0.9em;
					margin-right: 5px;
				}
				span.block,
				span.type {
					margin-left: 5px;
				}
				span.block {
					color: red;
				}
				.user span.email {
					color: #00000073;
					font-size: 0.7em;
				}
				div.inline {
					display: flex;
					align-items: center;
				}
				div.inline h2.user-name {
					margin: 10px;
				}
				div.inline img.avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					margin-right: 10px;
					object-fit: cover;
					object-position: center;
				}
				.user div.user-header {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			</style>
            <div class='user'>
				<div class="user-header">
					<div class="inline">
						${ this.user.img
							? `<img src="${Backend.at('media/image/'+this.user.img)}" class="avatar" alt="avatar dell'utente" >`
							: ""
						}
						<h2 class="user-name">${this.user.u_name}</h2>
						${this.renderType()}
						${this.user.block
							? `<span class='block'>Bloccato</span>`
							: ""
						}
					</div>
                    <button id="${this.editId + this.user._id}">Modifica</button>
				</div>
				<div class="inline">
					<span class="name">${this.user.name.first} ${this.user.name.last}</span>
					<span class="email">${this.user.email}</span>
				</div>
			</div>
        `;
        this.shadowRoot.getElementById(this.editId + this.user._id)
            .addEventListener('click', () => {
                const event = new CustomEvent("edit-user", {
                    bubbles: true,
                    composed: true,
                    detail: this.user
                });
                this.dispatchEvent(event);
            });
        // Copy styles from the main document to the shadow root to make the component styleable
        const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
        styles.forEach(style => this.shadowRoot.appendChild(style.cloneNode(true)));
    }

    renderType() {
        switch(this.user.type) {
            case "mod":
                return "<span class='type'>Moderatore</span>";
            case "smm":
                return "<span class='type'>Social Media Manager</span>";
            case "normal":
                return "<span class='type'>Normale</span>";
            case "vip":
                return "<span class='type'>Vip</span>";
            default: return "";
        }
    }
}

customElements.define("my-user", User);
