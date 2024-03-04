export class Auth {
	tokenFieldName = 'token';

	static setToken(token) { localStorage.setItem(this.tokenFieldName, token); }
	
	static getToken() {
		if(this.isTokenExpired()) {
			this.removeToken();
			return null;
		}
		return localStorage.getItem(this.tokenFieldName);
	}

	static removeToken() { localStorage.removeItem(this.tokenFieldName); }

	// a jwt token has a payload with an expiration time
	static isTokenExpired() {
		const token = localStorage.getItem(this.tokenFieldName);
		if(!token) return true;
		const payload = JSON.parse(atob(token.split('.')[1]));
		return Date.now() >= payload.exp * 1000;
	}
}
