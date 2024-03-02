import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";

class MyUsersFilter extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get filterFirstName() {
        return this.getAttribute('filterFirstName');
    }

    set filterFirstName(value) {
        this.setAttribute('filterFirstName', value);
    }

    get filterLastName() {
        return this.getAttribute('filterLastName');
    }

    set filterLastName(value) {
        this.setAttribute('filterLastName', value);
    }

    get filterType() {
        return this.getAttribute('filterType');
    }

    set filterType(value) {
        this.setAttribute('filterType', value);
    }

    static get observedAttributes() {
        return ['filterFirstName', 'filterLastName', 'filterType'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (['filterFirstName', 'filterLastName', 'filterType'].includes(name) && oldValue !== newValue) {
            this.render();
        }
    }

    async connectedCallback() {
        try {
            this.users = await Backend.get('users', Auth.getToken());
        } catch (error) {
            console.error('Failed to fetch users:', error);
            this.users = [];
        }
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                input[type="date"], select, button {
                    width: 50%;
                    padding: 12px 20px;
                    margin: 8px 0;
                    box-sizing: border-box;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    font-size: 16px;
                }
                button {
                    background-color: #4CAF50;
                    color: white;
                    border: none;
                    cursor: pointer;
                }
                button:hover {
                    opacity: 0.8;
                }
                div {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-start; /* Align items to the start */
                }
            </style>
            <div>
                <select id="filterFirstName">
                    <option value="">-- Select First Name --</option>
                    ${Array.isArray(this.users) ? this.users.map(user => `<option value="${user.name.first}">${user.name.first}</option>`).join('') : ''}
                </select>
                <select id="filterLastName">
                    <option value="">-- Select Last Name --</option>
                    ${Array.isArray(this.users) ? this.users.map(user => `<option value="${user.name.last}">${user.name.last}</option>`).join('') : ''}
                </select>
                <select id="filterType">
                    <option value="">-- Select Type --</option>
                    <option value="vip">VIP</option>
                    <option value="mod">Moderator</option>
                    <option value="normal">Normal</option>
                    <option value="smm">SMM</option>
                    <option value="bot">Bot</option>
                </select>
                <button id="ApplyFilter">Apply Filters</button>
            </div>
        `;
        
        this.shadowRoot.getElementById('ApplyFilter').addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent the form from being submitted normally
            const filterFirstName = this.shadowRoot.getElementById('filterFirstName').value;
            const filterLastName = this.shadowRoot.getElementById('filterLastName').value;
            const filterType = this.shadowRoot.getElementById('filterType').value;

            // Dispatch the custom event
            const event = new CustomEvent('filter-applied', { bubbles: true, composed: true, detail: { filterFirstName, filterLastName, filterType } });
            this.dispatchEvent(event);
        });

    }
}

customElements.define('my-users-filter', MyUsersFilter);