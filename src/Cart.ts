export class Cart {
    private readonly items: string[] = [];
    private readonly currency: string;

    constructor(currency: string) {
        this.currency = currency;
    }

    addItem(item: string): void {
        this.items.push(item);
    }

    removeItem(item: string): void {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
        }
    }

    getItems(): ReadonlyArray<string> {
        return [...this.items];
    }

    getCurrency(): string {
        return this.currency;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    itemCount(): number {
        return this.items.length;
    }
}
