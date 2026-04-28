import { describe, test, expect } from 'vitest';
import { BankAccount } from '../src/BankAccount';
import { User } from '../src/User';
import { Cart } from '../src/Cart';
import { OrderService } from '../src/OrderService';
import { DiscountService } from '../src/DiscountService';

// =============================================================================
// KATA 1 — Meaningless Test Name
//
// Smell: i nomi dei metodi non comunicano né il comportamento testato,
//        né il contesto, né il risultato atteso. Guardando solo i nomi
//        non è possibile capire cosa verificano senza leggere il corpo,
//        e un report di fallimento con "test1 FAILED" non dà nessun
//        indizio su cosa sia andato storto.
//
// Fix: ?
// =============================================================================
describe('MeaninglessTestNameTest', () => {

    test('test1', () => {
        const account = new BankAccount("Alice", "IT60X054280111", 100.0);

        account.deposit(50.0);

        expect(account.getBalance()).toBe(150.0);
    });

    test('test2', () => {
        const account = new BankAccount("Alice", "IT60X054280111", 100.0);

        expect(() => account.withdraw(200.0)).toThrow();
    });

    test('testOk', () => {
        const user = new User("bob", "bob@example.com", "customer", true);
        const cart = new Cart("EUR");
        cart.addItem("Laptop");

        expect(new OrderService().canPlaceOrder(user, cart)).toBe(true);
    });
});

// =============================================================================
// KATA 2 — Commented-out Tests
//
// Smell: due test sono disabilitati con un commento, senza spiegare
//        perché. Non è chiaro se siano temporaneamente sospesi in attesa
//        di un fix, obsoleti perché il comportamento è cambiato, o
//        semplicemente dimenticati. Col tempo diventano rumore che
//        nessuno osa toccare.
//
// Fix: ?
// =============================================================================
describe('CommentedOutTestsTest', () => {

    test('deposit_shouldIncreaseBalance', () => {
        const account = new BankAccount("Alice", "IT60X054280111", 100.0);

        account.deposit(50.0);

        expect(account.getBalance()).toBe(150.0);
    });

//     test('withdraw_shouldDecreaseBalance', () => {
//         const account = new BankAccount("Alice", "IT60X054280111", 100.0);
//
//         account.withdraw(30.0);
//
//         expect(account.getBalance()).toBe(70.0);
//     });

//     test('withdraw_shouldFail_whenBalanceIsInsufficient', () => {
//         const account = new BankAccount("Alice", "IT60X054280111", 30.0);
//
//         account.withdraw(100.0);
//     });
});


// =============================================================================
// KATA 3 — Hard-coded Values
//
// Smell: i valori numerici e le stringhe usati nel test non comunicano
//        nulla sulla loro intenzione. Perché 999.99? Perché 3? Perché
//        "SAVE10"? Chi legge il test deve inferire il significato dei
//        valori dal contesto, e una modifica a uno di essi può rompere
//        il test in modo non ovvio.
//
// Fix: ?
// =============================================================================
describe('HardCodedValuesTest', () => {

    test('applyDiscount_shouldReturnCorrectAmount', () => {
        const cart = new Cart("EUR");
        cart.addItem("Laptop");
        cart.addItem("Mouse");
        cart.addItem("Keyboard");

        const service = new DiscountService();
        const discount = service.apply(cart, "SAVE10");

        expect(discount).toBe(30.0);
    });

    test('withdraw_shouldFail_whenAmountExceedsBalance', () => {
        const account = new BankAccount("Alice", "IT60X054280111", 999.99);

        expect(() => account.withdraw(1000.0)).toThrow();
    });
});

// =============================================================================
// KATA 4 — Very Similar Tests
//
// Smell: i quattro test verificano la stessa logica — canPlaceOrder
//        restituisce false quando l'utente è inattivo o il carrello è
//        vuoto — variando solo i dati di ingresso. La duplicazione rende
//        il codice verbose e difficile da mantenere: aggiungere un nuovo
//        caso significa copiare un intero metodo.
//
// Fix: ?
// =============================================================================
describe('VerySimilarTestsTest', () => {

    test('canPlaceOrder_shouldReturnFalse_whenUserIsInactiveAndCartIsEmpty', () => {
        const user = new User("alice", "alice@example.com", "customer", false);
        const cart = new Cart("EUR");

        expect(new OrderService().canPlaceOrder(user, cart)).toBe(false);
    });

    test('canPlaceOrder_shouldReturnFalse_whenUserIsInactiveAndCartIsNotEmpty', () => {
        const user = new User("bob", "bob@example.com", "customer", false);
        const cart = new Cart("EUR");
        cart.addItem("Laptop");

        expect(new OrderService().canPlaceOrder(user, cart)).toBe(false);
    });

    test('canPlaceOrder_shouldReturnFalse_whenUserIsActiveAndCartIsEmpty', () => {
        const user = new User("carol", "carol@example.com", "customer", true);
        const cart = new Cart("EUR");

        expect(new OrderService().canPlaceOrder(user, cart)).toBe(false);
    });

    test('canPlaceOrder_shouldReturnTrue_whenUserIsActiveAndCartIsNotEmpty', () => {
        const user = new User("dave", "dave@example.com", "customer", true);
        const cart = new Cart("EUR");
        cart.addItem("Laptop");

        expect(new OrderService().canPlaceOrder(user, cart)).toBe(true);
    });
});

// =============================================================================
// KATA 5 — Verbose Test
//
// Smell: il test copre molti casi per verificare che deposit() aggiorni
//        il saldo correttamente, ma diversi casi sono ridondanti: depositare
//        10.0, poi 20.0, poi 50.0 testa sempre la stessa logica con valori
//        diversi. Il test è lungo, difficile da leggere, e aggiunge poca
//        copertura rispetto a un singolo caso ben scelto.
//
// Fix: ?
// =============================================================================
describe('VerboseTestTest', () => {

    test('deposit_shouldUpdateBalance', () => {
        const account = new BankAccount("Alice", "IT60X054280111", 100.0);

        account.deposit(10.0);
        expect(account.getBalance()).toBe(110.0);

        account.deposit(20.0);
        expect(account.getBalance()).toBe(130.0);

        account.deposit(50.0);
        expect(account.getBalance()).toBe(180.0);

        account.deposit(0.01);
        expect(account.getBalance()).toBeCloseTo(180.01, 3);

        account.deposit(1000.0);
        expect(account.getBalance()).toBeCloseTo(1180.01, 3);
    });
});
