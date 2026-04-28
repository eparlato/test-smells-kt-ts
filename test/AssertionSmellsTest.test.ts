import { describe, test, expect } from 'vitest';
import { User } from '../src/User';
import { Cart } from '../src/Cart';
import { OrderService } from '../src/OrderService';
import { BankAccount } from '../src/BankAccount';

// =============================================================================
// KATA 1 — Unclear Assertion Message
//
// Smell: quando il test fallisce, il messaggio di errore non comunica
//        nulla di utile. Il framework riporta solo "expected true but was
//        false", senza spiegare quale condizione non era soddisfatta
//        né quale fosse il contesto.
//
// Fix: ?
// =============================================================================
describe('UnclearAssertionMessageTest', () => {

    test('canPlaceOrder_shouldReturnTrue_whenUserIsActiveAndCartIsNotEmpty', () => {
        const user         = new User("alice", "alice@example.com", "customer", true);
        const cart         = new Cart("EUR");
        const svc          = new OrderService();
        cart.addItem("Laptop");

        expect(svc.canPlaceOrder(user, cart)).toBe(true);
    });
});

// =============================================================================
// KATA 2 — Assertion Roulette
//
// Smell: il test contiene più assertion senza messaggi descrittivi.
//        Quando fallisce, il report indica solo il numero di riga,
//        e non è immediato capire quale delle tre condizioni non
//        era soddisfatta né perché.
//
// Fix: ?
// =============================================================================
describe('AssertionRouletteTest', () => {

    test('deposit_shouldUpdateAccountCorrectly', () => {
        const account = new BankAccount("Bob", "IT60X054280111", 100.0);

        account.deposit(50.0);

        expect(account.getBalance()).toBe(150.0);
        expect(account.isFrozen()).toBe(false);
        expect(account.getOwner()).toBe("Bob");
    });
});

// =============================================================================
// KATA 3 — Over-assertion
//
// Smell: il test vuole verificare che dopo aver aggiunto un item
//        il carrello non sia vuoto. Ma asserisce anche la valuta,
//        il numero esatto di item e il nome specifico dell'item.
//        Qualsiasi modifica marginale al setup (es. cambiare la valuta
//        o aggiungere un secondo item) romperà il test, anche se il
//        comportamento rilevante è rimasto invariato.
//
// Fix: ?
// =============================================================================
describe('OverAssertionTest', () => {

    test('cart_shouldContainItem_afterAddingIt', () => {
        const cart = new Cart("EUR");
        cart.addItem("Laptop");

        expect(cart.isEmpty()).toBe(false);
        expect(cart.itemCount()).toBe(1);
        expect(cart.getCurrency()).toBe("EUR");
        expect(cart.getItems()).toContain("Laptop");
    });
});

// =============================================================================
// KATA 4 — Missing Assertion
//
// Smell: il test esercita il comportamento — congela l'account e poi
//        tenta un deposito — ma non verifica nulla sul risultato.
//        Passa sempre, anche se freeze() o deposit() fossero implementati
//        in modo completamente sbagliato.
//
// Fix: ?
// =============================================================================
describe('MissingAssertionTest', () => {

    test('deposit_shouldFail_whenAccountIsFrozen', () => {
        const account = new BankAccount("Carol", "IT60X054280111", 200.0);

        account.freeze();

        expect(() => account.deposit(50.0)).toThrow();
    });

    test('freeze_shouldFreezeTheAccount', () => {
        const account = new BankAccount("Carol", "IT60X054280111", 200.0);

        account.freeze();
    });
});
