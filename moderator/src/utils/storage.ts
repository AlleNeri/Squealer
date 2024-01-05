import { env } from '../env';

export function storeToken(token: string): void {
	localStorage.setItem(env.TOKEN_NAME, token);
}

export function getToken(): string | null {
	return localStorage.getItem(env.TOKEN_NAME);
}

export function removeToken(): void {
	localStorage.removeItem(env.TOKEN_NAME);
}

export function storeId(id: string): void {
	localStorage.setItem(env.ID_NAME, id);
}

export function getId(): string | null {
	return localStorage.getItem(env.ID_NAME);
}

export function removeId(): void {
	localStorage.removeItem(env.ID_NAME);
}
