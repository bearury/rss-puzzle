import { IUser } from '../entity/user';

export class StorageService<T> {
    private storageKeyPrefix: string;

    constructor(storageKeyPrefix: string) {
        this.storageKeyPrefix = storageKeyPrefix;
    }

    private getStorageKey(key: string): string {
        return `${this.storageKeyPrefix}_${key}`;
    }

    public saveData<K extends keyof T>(key: K, data: T[K]): void {
        const storageKey = this.getStorageKey(key.toString());
        localStorage.setItem(storageKey, JSON.stringify(data));
    }

    public getData<K extends keyof T>(key: K): IUser | null {
        const storageKey = this.getStorageKey(key.toString());
        const data = localStorage.getItem(storageKey);
        return data ? JSON.parse(data) : null;
    }
}

export type LocalStorageState = {
    user: IUser | null;
};

export const localStorageService = new StorageService<LocalStorageState>('puzzle-game-wm');
