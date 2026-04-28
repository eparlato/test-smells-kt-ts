export class User {
    private readonly username: string;
    private readonly email: string;
    private readonly role: string;
    private active: boolean;

    constructor(username: string, email: string, role: string, active: boolean) {
        this.username = username;
        this.email = email;
        this.role = role;
        this.active = active;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getRole(): string {
        return this.role;
    }

    isActive(): boolean {
        return this.active;
    }

    deactivate(): void {
        this.active = false;
    }
}
