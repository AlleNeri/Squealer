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
                this.newUser.quote = newUser.quote;
                this.newUser.block = newUser.block;
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
                div.button-container {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }
                .button-container {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 20px; 
                }
                .button-container button {
                    margin-right: 10px; 
                }
                .button-container button:last-child {
                    margin-right: 0;
                }
                .button-container input[type="submit"] {
                    margin-left: auto; /* Push the submit button to the right */
                }
            </style>
            <div class="edit-user-section">
                <h1>Edit user</h1>
                <form class="edit-user" id="${this.submitId}">
                    <label for="${this.daylyId}">Daily:</label>
                    <input type="number" id="${this.daylyId}" value="${this.newUser.quote && this.newUser.quote.dayly !== undefined ? this.newUser.quote.dayly : 1}" min="1" />
                    <label for="${this.weeklyId}">Weekly:</label>
                    <input type="number" id="${this.weeklyId}" value="${this.newUser.quote && this.newUser.quote.weekly !== undefined ? this.newUser.quote.weekly : 1}" min="1" />
                    <label for="${this.monthlyId}">Monthly:</label>
                    <input type="number" id="${this.monthlyId}" value="${this.newUser.quote && this.newUser.quote.monthly !== undefined ? this.newUser.quote.monthly : 1}" min="1" />
                    <br />
                    <div class="button-container">
                        <button id="block">Block</button>
                        <button id="unblock">Unblock</button>
                        <input type="submit" value="Conferma" />
                    </div>
                </form>
            </div>
        `;
        // Add event listeners
        this.shadowRoot.querySelector(`input#${this.daylyId}`).addEventListener('input', e => this.newUser.quote.dayly = e.target.value);
        this.shadowRoot.querySelector(`input#${this.weeklyId}`).addEventListener('input', e => this.newUser.quote.weekly = e.target.value);
        this.shadowRoot.querySelector(`input#${this.monthlyId}`).addEventListener('input', e => this.newUser.quote.monthly = e.target.value);
                
        // Get the buttons
        const blockButton = this.shadowRoot.querySelector('#block');
        const unblockButton = this.shadowRoot.querySelector('#unblock');

        // Disable or enable the buttons based on newUser.block
        if (this.newUser.block) {
            blockButton.disabled = true;
            unblockButton.disabled = false;
        } else {
            blockButton.disabled = false;
            unblockButton.disabled = true;
        }

        // Event listener block event
        blockButton.addEventListener('click', async () => {
            await Backend.put('users/'+this.user._id+'/block', {}, Auth.getToken())
                .catch(e => {
                    console.log(e);
                    alert('Errore durante il blocco dell\'utente');
                });
        });

        // Event listener unblock event
        unblockButton.addEventListener('click', async () => {
            await Backend.put('users/'+this.user._id+'/unblock', {}, Auth.getToken())
                .catch(e => {
                    console.log(e);
                    alert('Errore durante lo sblocco dell\'utente');
                });
        });

        // Submit event listener
        this.shadowRoot.querySelector(`form#${this.submitId}`).addEventListener('submit', async (e)=> {
            e.preventDefault();
            const data = {
                dayly: Number(this.newUser.quote.dayly),
                weekly: Number(this.newUser.quote.weekly),
                monthly: Number(this.newUser.quote.monthly),
            };
            const result = await Backend.put('users/'+this.user._id+'/quote', data, Auth.getToken())
                            .catch(e => {
                                console.log(e);
                                alert('Errore durante la modifica dell\'utente');
                            });
            if (result && result.user) {
                const { user } = result;
                const event = new CustomEvent('new-user', { bubbles: true, composed: true, detail: user });
                this.dispatchEvent(event);
            } else {
                return;
            }
        });
    }
}

customElements.define('my-edit-user', EditUser);