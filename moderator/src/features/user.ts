import { env } from '../env';
import { getToken } from '../utils/storage';

export function showUser(userId: string) {
    const token: string = getToken()!;
    fetch(
        `${env.BACKEND_URL}/users/${userId}`,
        {
            method: 'GET',
            headers: { 'Authorization': token }
        }
    )
    .then(response => response.json())
    .then(user => {
        populateUser(user, userId);
    });
}

function populateUser(user: any, userId: string) {
    document.querySelector<HTMLDivElement>(`#${env.CONTENT_DIV}`)!.innerHTML = `
        <div class='user'>
            <div class='user-header'>
                <h3>${user.u_name}</h3>
                <i>${user.name.first} ${user.name.last}</i>
                <button id="edit-${user._id}">Edit</button>
            </div>
            <div>
            <form id="edit-form-${user._id}" class="edit-form" style="display: none;">
                    <div>
                        <label for="u_name" class="form-label">Username:</label>
                        <input type="text" id="u_name" name="u_name" value="${user.u_name}" class="form-input">
                    </div>
                    <div>
                        <label for="first_name" class="form-label">First Name:</label>
                        <input type="text" id="first_name" name="first_name" value="${user.name.first}" class="form-input">
                    </div>
                    <div>
                        <label for="last_name" class="form-label">Last Name:</label>
                        <input type="text" id="last_name" name="last_name" value="${user.name.last}" class="form-input">
                    </div>
                    <div>
                        <label for="email" class="form-label">Email:</label>
                        <input type="email" id="email" name="email" value="${user.email}" class="form-input">
                    </div>
                    <div class="form-group">
                        <div>
                            <label for="quote_dayly" class="form-label">Quote Daily:</label>
                            <input type="number" id="quote_dayly" name="quote_dayly" value="${user.quote.dayly}" class="form-input">
                        </div>
                        <div>
                            <label for="quote_weekly" class="form-label">Quote Weekly:</label>
                            <input type="number" id="quote_weekly" name="quote_weekly" value="${user.quote.weekly}" class="form-input">
                        </div>
                        <div>
                            <label for="quote_monthly" class="form-label">Quote Monthly:</label>
                            <input type="number" id="quote_monthly" name="quote_monthly" value="${user.quote.monthly}" class="form-input">
                        </div>
                    </div>
                    <div class="form-group">
                        <div>
                            <label for="char_availability_dayly" class="form-label">Char Availability Daily:</label>
                            <input type="number" id="char_availability_dayly" name="char_availability_dayly" value="${user.char_availability.dayly}" class="form-input">
                        </div>
                        <div>
                            <label for="char_availability_weekly" class="form-label">Char Availability Weekly:</label>
                            <input type="number" id="char_availability_weekly" name="char_availability_weekly" value="${user.char_availability.weekly}" class="form-input">
                        </div>
                        <div>
                            <label for="char_availability_monthly" class="form-label">Char Availability Monthly:</label>
                            <input type="number" id="char_availability_monthly" name="char_availability_monthly" value="${user.char_availability.monthly}" class="form-input">
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="form-button">Update</button>
                    </div>
                </form>
            </div>
        </div>
        
    `;
    
    document.getElementById(`edit-${user._id}`)!.addEventListener('click', () => {
        document.getElementById(`edit-form-${user._id}`)!.style.display = 'block';
    });

    // Add an event listener to the form
    document.getElementById(`edit-form-${user._id}`)!.addEventListener('submit', (event) => {
        const u_name = (document.getElementById('u_name') as HTMLInputElement).value;
        const first_name = (document.getElementById('first_name') as HTMLInputElement).value;
        const last_name = (document.getElementById('last_name') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const quote_dayly = (document.getElementById('quote_dayly') as HTMLInputElement).value;
        const quote_weekly = (document.getElementById('quote_weekly') as HTMLInputElement).value;
        const quote_monthly = (document.getElementById('quote_monthly') as HTMLInputElement).value;
        const char_availability_dayly = (document.getElementById('char_availability_dayly') as HTMLInputElement).value;
        const char_availability_weekly = (document.getElementById('char_availability_weekly') as HTMLInputElement).value;
        const char_availability_monthly = (document.getElementById('char_availability_monthly') as HTMLInputElement).value;
        // Get the values of the other input fields

        const token: string = getToken()!;
        fetch(
            `${env.BACKEND_URL}/users/${userId}`,
            {
                method: 'PUT',
                headers: { 
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: {
                        u_name: u_name,
                        name: {
                            first: first_name,
                            last: last_name
                        },
                        email: email,
                        quote: {
                            dayly: quote_dayly,
                            weekly: quote_weekly,
                            monthly: quote_monthly,
                        },
                        char_availability: {
                            dayly: char_availability_dayly,
                            weekly: char_availability_weekly,
                            monthly: char_availability_monthly,
                        }
                    }
                })
            }
        )
        .then(response => response.json())
        .then(data => {
            populateUser(data, userId);
        });
    });
}