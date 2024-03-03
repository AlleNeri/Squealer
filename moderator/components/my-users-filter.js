class MyUsersFilter extends HTMLElement {

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    get filterUsername(){
        return this.getAttribute('filterUsername');
    }

    set filterUsername(value){
        this.setAttribute('filterUsername', value);
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
        if (['filterUsername', 'filterFirstName', 'filterLastName', 'filterType'].includes(name) && oldValue !== newValue) {
            this.render();
        }
    }

    async connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                input[type="date"], input[type="text"], select, button {
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
                    align-items: flex-start;
                }
            </style>
            <div>
                <label for="filterUsername">Username:</label>
                <input type="text" id="filterUsername" placeholder="Enter Username">
                <label for="filterFirstName">First Name:</label>
                <input type="text" id="filterFirstName" placeholder="Enter First Name">
                <label for="filterLastName">Last Name:</label>
                <input type="text" id="filterLastName" placeholder="Enter Last Name">
                <label for="filterType">Type:</label>
                <select id="filterType">
                    <option value="">-- Select user type --</option>
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
            const filterUsername = this.shadowRoot.getElementById('filterUsername').value;
            const filterFirstName = this.shadowRoot.getElementById('filterFirstName').value;
            const filterLastName = this.shadowRoot.getElementById('filterLastName').value;
            const filterType = this.shadowRoot.getElementById('filterType').value;

            // Dispatch the custom event
            const event = new CustomEvent('filter-applied', { bubbles: true, composed: true, detail: { filterUsername, filterFirstName, filterLastName, filterType } });
            this.dispatchEvent(event);
        });

    }
}

customElements.define('my-users-filter', MyUsersFilter);