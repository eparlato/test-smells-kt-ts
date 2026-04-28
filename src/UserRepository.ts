import { User } from './User';

export class UserRepository {
    private readonly store: Map<string, User> = new Map();

    save(user: User): void {
        this.store.set(user.getUsername(), user);
    }

    findByUsername(id: string): User | undefined {
        return this.store.get(id);
    }

    count(): number {
        return this.store.size;
    }

    clear(): void {
        this.store.clear();
    }
}
