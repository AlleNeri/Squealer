import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";

class EditUser extends HTMLElement {
    daylyId = 'dayly';
    weeklyId = 'weekly';
    monthlyId = 'monthly';
    submitId = 'submit';

    constructor() {
        super();
        this.newUser = {};
        this.attachShadow({ mode: 'open' });
    }

    get user() {
        try { return JSON.parse(this.getAttribute('user')); }
        catch(e) { return {}; }
    }

    set user(value) { this.setAttribute('user', JSON.stringify(value)); }

    static get observedAttributes() { return ['user']; }

    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'user' && oldValue !== newValue) {
            if(newValue) {
                const newUser = JSON.parse(newValue);
                this.newUser.char_availability = newUser.char_availability;
            }
            this.render();
        }
    }

    connectedCallback() { this.render(); }

    render() {
        if(!this.user) {
            this.shadowRoot.innerHTML = '';
            return;
        }
        this.shadowRoot.innerHTML = `
            <style>
                div.edit-user-section {
                    position: fixed;
                    width: 32%;
                    margin-left: 10px;
                }
                div.edit-user-section form.edit-user {
                    padding: 0 10px 10px 10px;
                    background-color: white;
                    border-radius: 5px;
                }
                div.edit-user-section form.edit-user label {
                    display: block;
                    padding-top: 10px;
                    padding-bottom: 3px;
                }
                div.edit-user-section form.edit-user input[type="text"],
                div.edit-user-section form.edit-user textarea {
                    width: 97%;
                    border-radius: 3px;
                }
                div.edit-user-section form.edit-user textarea {
                    margin: 0;
                    resize: none;
                }
                div.edit-user-section form.edit-user div.keyword-container {
                    display: flex;
                    align-items: center;
                    margin: 10px 0;
                }
                div.edit-user-section form.edit-user div.keyword-container input[type="checkbox"] {
                    margin-right: 10px;
                }
                div.edit-user-section form.edit-user div.keyword-container label {
                    padding: 0;
                }
            </style>
            <div class="edit-user-section">
                <h1>Edit user</h1>
                <form class="edit-user" id="${this.submitId}">
                    <label for="${this.daylyId}">Daily:</label>
                    <input type="number" id="${this.daylyId}" value="${this.newUser.char_availability.dayly || ''}" min="0" />
                    <label for="${this.weeklyId}">Weekly:</label>
                    <input type="number" id="${this.weeklyId}" value="${this.newUser.char_availability.weekly || ''}" min="0" />
                    <label for="${this.monthlyId}">Monthly:</label>
                    <input type="number" id="${this.monthlyId}" value="${this.newUser.char_availability.monthly || ''}" min="0" />
                    <input type="submit" value="Conferma" />
                </form>
            </div>
        `;
        // Add event listeners
        this.shadowRoot.querySelector(`input#${this.daylyId}`).addEventListener('input', e => this.newUser.char_availability.dayly = e.target.value);
        this.shadowRoot.querySelector(`input#${this.weeklyId}`).addEventListener('input', e => this.newUser.char_availability.weekly = e.target.value);
        this.shadowRoot.querySelector(`input#${this.monthlyId}`).addEventListener('input', e => this.newUser.char_availability.monthly = e.target.value);
        // Submit event listener
        this.shadowRoot.querySelector(`form#${this.submitId}`).addEventListener('submit', async (e)=> {
            e.preventDefault();
            const data = {
                char_availability: this.newUser.char_availability
            };
            const { user } = await Backend.put('users/'+this.user._id, data, Auth.getToken())
                .catch(e => {
                    console.log(e);
                    alert('Errore durante la modifica dell\'utente');
                });
            if(!user) return;
            const event = new CustomEvent('new-user', { bubbles: true, composed: true, detail: user });
            this.dispatchEvent(event);
        });
    }
}

customElements.define('my-edit-user', EditUser);