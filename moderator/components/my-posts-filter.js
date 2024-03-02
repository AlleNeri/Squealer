import { Backend } from "../utils/backend.js";
import { Auth } from "../utils/auth.js";

class PostsFilter extends HTMLElement {

    users = [];
    channels = [];

    //constructor
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    //getter and setter
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

    //observed attributes
    static get observedAttributes() {
        return ['filterDate', 'filterSender', 'filterRecipient'];
    }

    //attribute changed callback
    attributeChangedCallback(name, oldValue, newValue) {
        if (['filterDate', 'filterSender', 'filterRecipient'].includes(name) && oldValue !== newValue) {
            this.render();
        }
    }

    //connected callback
    async connectedCallback() {
        try {
            this.users = await Backend.get('users', Auth.getToken());
            this.channels = await Backend.get('channels/all', Auth.getToken());
        } catch (error) {
            console.error('Failed to fetch users or channels:', error);
            this.users = [];
            this.channels = [];
        }
        this.render();
    }
    

    //render
    render(){
        this.shadowRoot.innerHTML = `
        <style>
            input[type="date"], select, button {
                width: 80%;
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
            <input type="date" id="filterDate" value="${this.filterDate || ''}" />
            <select id="filterSender">
                <option value="">-- Select --</option>
                ${this.users.map(user => `<option value="${user.u_name}">${user.u_name}</option>`).join('')}
            </select>
            <select id="filterRecipient">
                <option value="">-- Select --</option>
                <optgroup label="Public channels">
                    ${this.channels.filter(channel => !channel.private).map(channel => `<option value="${channel.name}">${channel.name}</option>`).join('')}
                </optgroup>
                <optgroup label="Private channels">
                    ${this.channels.filter(channel => channel.private && !channel.name.startsWith('__direct__')).map(channel => `<option value="${channel.name}">${channel.name}</option>`).join('')}
                </optgroup>
                <optgroup label="Direct messages">
                    ${this.channels.filter(channel => channel.name.startsWith('__direct__')).map(channel => `<option value="${channel.name}">${channel.name}</option>`).join('')}
                </optgroup>
            </select>
            <button id="applyFilter">Apply Filters</button>
        </div>
        `;

        // In your render method:
        this.shadowRoot.getElementById('applyFilter').addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent the form from being submitted normally
            const filterDate = this.shadowRoot.getElementById('filterDate').value;
            const filterSender = this.shadowRoot.getElementById('filterSender').value;
            const filterRecipient = this.shadowRoot.getElementById('filterRecipient').value;
            console.log(`Filter date in event listener: ${filterDate}`);
            console.log(`Filter sender in event listener: ${filterSender}`);
            console.log(`Filter recipient in event listener: ${filterRecipient}`);

            // Dispatch the custom event
            const event = new CustomEvent('filter-applied', { bubbles: true, composed: true, detail: { filterDate, filterSender, filterRecipient } });
            this.dispatchEvent(event);
        });
    }

}


customElements.define('my-posts-filter', PostsFilter);