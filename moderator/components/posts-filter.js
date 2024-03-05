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
            input[type="date"], input[type="text"], select, button {
                width: 100%;
                padding: 10px 15px;
                margin: 8px 0;
                box-sizing: border-box;
                border: 1px solid #ccc;
                border-radius: 4px;
                font-size: 16px;
            }
            button {
                background-color: #007bff;
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
                align-items: flex-start;
            }
        </style>
        <div>
            <label for="filterDate">Publish date:</label>
            <input type="date" id="filterDate" value="${this.filterDate || ''}" />
            <label for="filterSender">Sender:</label>
            <input type="text" id="filterSender" placeholder="Enter Sender">
            <label for="filterRecipient">Recipient:</label>
            <input type="text" id="filterRecipient" placeholder="Enter Recipient">
            <button id="applyFilter">Apply Filters</button>
        </div>
        `;

        // In your render method:
        this.shadowRoot.getElementById('applyFilter').addEventListener('click', async (e) => {
            e.preventDefault(); // Prevent the form from being submitted normally
            const filterDate = this.shadowRoot.getElementById('filterDate').value;
            const filterSender = this.shadowRoot.getElementById('filterSender').value;
            const filterRecipient = this.shadowRoot.getElementById('filterRecipient').value;

            // Dispatch the custom event
            const event = new CustomEvent('filter-applied', { bubbles: true, composed: true, detail: { filterDate, filterSender, filterRecipient } });
            this.dispatchEvent(event);
        });
    }

}


customElements.define('my-posts-filter', PostsFilter);
