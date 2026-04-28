export class BankAccount {
    private readonly owner: string;
    private readonly iban: string;
    private balance: number;
    private frozen: boolean;

    constructor(owner: string, iban: string, initialBalance: number) {
        this.owner = owner;
        this.iban = iban;
        this.balance = initialBalance;
        this.frozen = false;
    }

    getOwner(): string {
        return this.owner;
    }

    getIban(): string {
        return this.iban;
    }

    getBalance(): number {
        return this.balance;
    }

    isFrozen(): boolean {
        return this.frozen;
    }

    freeze(): void {
        this.frozen = true;
    }

    deposit(amount: number): void {
        if (this.frozen) throw new Error("Account is frozen");
        if (amount <= 0) throw new Error("Amount must be positive");
        this.balance += amount;
    }

    withdraw(amount: number): void {
        if (this.frozen) throw new Error("Account is frozen");
        if (amount <= 0) throw new Error("Amount must be positive");
        if (amount > this.balance) throw new Error("Insufficient funds");
        this.balance -= amount;
    }
}
