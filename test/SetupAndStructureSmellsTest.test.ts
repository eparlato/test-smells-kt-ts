// =============================================================================
// KATA: Test Smells — Setup & Struttura
//
// Ogni test qui sotto contiene uno smell. Il tuo compito è:
//   1. Identificare lo smell
//   2. Capire perché è un problema
//   3. Applicare il fix
//
// Il codice di produzione è corretto e non va modificato.
// Devi intervenire solo sui test.
// =============================================================================

import { describe, test, expect, beforeEach, beforeAll } from 'vitest';
import { BankAccount } from '../src/BankAccount';
import { User } from '../src/User';
import { Cart } from '../src/Cart';
import { OrderService } from '../src/OrderService';

// =============================================================================
// KATA 1 — Hidden Setup
//
// Smell: il setup rilevante per il test è nascosto nel beforeEach.
//        Leggendo solo il corpo del test non si capisce in che stato
//        si trova l'account, né perché il prelievo dovrebbe fallire.
//
// Fix: ?
// =============================================================================
describe('HiddenSetupTest', () => {

    let account: BankAccount;

    beforeEach(() => {
        account = new BankAccount("Alice", "IT60X054280111", 50.0);
    });

    test('withdraw_shouldFail_whenBalanceIsInsufficient', () => {
        expect(() => account.withdraw(100.0)).toThrow();
    });
});

// =============================================================================
// KATA 2 — Unclear / Undefined Setup Details
//
// Smell: il setup crea un utente, ma i valori scelti non comunicano
//        nulla sull'intenzione del test. Perché "xyz"? Perché "a@b.com"?
//        Non è chiaro quale caratteristica dell'utente è rilevante.
//
// Fix: ?
// =============================================================================
describe('UnclearSetupTest', () => {

    test('deactivate_shouldMakeUserInactive', () => {
        const user = new User("xyz", "a@b.com", "admin", true);

        user.deactivate();

        expect(user.isActive()).toBe(false);
    });
});

// =============================================================================
// KATA 3 — Excessive Setup
//
// Smell: il setup è lungo e rumoroso. Per capire cosa viene testato
//        bisogna leggere ogni riga e chiedersi cosa sia rilevante.
//        L'intenzione — verificare che un utente attivo con carrello
//        non vuoto possa fare un ordine — è sepolta nel dettaglio.
//
// Fix: ?
// =============================================================================
describe('ExcessiveSetupTest', () => {

    test('canPlaceOrder_shouldReturnTrue_whenUserIsActiveAndCartIsNotEmpty', () => {
        const username = "mario";
        const email = "mario@example.com";
        const role = "customer";
        const active = true;
        const user = new User(username, email, role, active);

        const currency = "EUR";
        const cart = new Cart(currency);
        const item1 = "Laptop";
        const item2 = "Mouse";
        const item3 = "Keyboard";
        cart.addItem(item1);
        cart.addItem(item2);
        cart.addItem(item3);

        const service = new OrderService();

        const result = service.canPlaceOrder(user, cart);

        expect(result).toBe(true);
    });
});

// =============================================================================
// KATA 4 — Irrelevant Setup
//
// Smell: vengono costruiti tre item e aggiunti al carrello, ma il test
//        verifica solo che il carrello non sia vuoto. Il numero di item,
//        i loro nomi e la valuta sono irrilevanti e distraggono.
//
// Fix: ?
// =============================================================================
describe('IrrelevantSetupTest', () => {

    test('cart_shouldNotBeEmpty_afterAddingItems', () => {
        const cart = new Cart("EUR");
        cart.addItem("Laptop");
        cart.addItem("Mouse");
        cart.addItem("Keyboard");

        expect(cart.isEmpty()).toBe(false);
    });
});

// =============================================================================
// KATA 5 — Shared Mutable Fixture
//
// Smell: i tre test condividono la stessa istanza di BankAccount
//        inizializzata una volta sola nel beforeAll. Ogni test modifica
//        lo stato dell'account, quindi l'ordine di esecuzione influenza
//        i risultati: i test non sono indipendenti.
//
// Fix: ?
// =============================================================================
describe('SharedMutableFixtureTest', () => {

    let account: BankAccount;

    beforeAll(() => {
        account = new BankAccount("Bob", "IT60X054280111", 100.0);
    });

    test('deposit_shouldIncreaseBalance', () => {
        account.deposit(50.0);
        expect(account.getBalance()).toBe(150.0);
    });

    test('withdraw_shouldDecreaseBalance', () => {
        account.withdraw(30.0);
        expect(account.getBalance()).toBe(70.0);
    });

    test('balance_shouldBeInitialValue_whenNoOperationsAreDone', () => {
        expect(account.getBalance()).toBe(100.0);
    });
});

// =============================================================================
// KATA 6 — Irrelevant Setup › Fix con Test Data Builder
//
// Questo kata mostra come applicare il pattern Test Data Builder come fix
// per l'Irrelevant Setup del KATA 4.
//
// Il problema originale: per costruire un Cart o uno User bisogna fornire
// tutti i parametri del costruttore, anche quelli irrilevanti per il test.
// Il risultato è un setup pieno di dettagli che distraggono dall'intenzione.
//
// Il Test Data Builder risolve questo introducendo valori di default
// sensati per tutto ciò che non conta, e metodi named (with*) per
// impostare solo ciò che è rilevante per quel test specifico.
//
// Il tuo compito:
//   1. Osserva come CartBuilder e UserBuilder nascondono i dettagli
//      irrilevanti e rendono esplicita l'intenzione del test.
//   2. Completa UserBuilder aggiungendo i metodi mancanti: withEmail(),
//      withRole(), e inactive() seguendo lo stesso stile.
//   3. Scrivi un nuovo test che usi UserBuilder per verificare che
//      un utente disattivato non possa effettuare un ordine.
// =============================================================================
describe('TestDataBuilderTest', () => {

    // Esempio già risolto: mostra come il builder rende evidente
    // l'intenzione — "un carrello con almeno un item non è vuoto" —
    // senza dettagli irrilevanti come valuta o numero esatto di item.
    test('cart_shouldNotBeEmpty_whenItHasAtLeastOneItem', () => {
        const cart = CartBuilder.aCart()
            .withItem("any-item")
            .build();

        expect(cart.isEmpty()).toBe(false);
    });

    // Esempio già risolto: anche qui il builder rende chiaro che
    // ciò che conta è che l'utente sia attivo e il carrello non vuoto.
    // Username, email, valuta e nome dell'item sono rumore: restano nei default.
    test('canPlaceOrder_shouldReturnTrue_whenUserIsActiveAndCartIsNotEmpty', () => {
        const user = UserBuilder.aUser()
            .build();                             // default: utente attivo
        const cart = CartBuilder.aCart()
            .withItem("any-item")
            .build();

        const result = new OrderService().canPlaceOrder(user, cart);

        expect(result).toBe(true);
    });

    // TODO: scrivi un test che verifichi che un utente inattivo
    //       non possa effettuare un ordine, usando UserBuilder.inactive()
});

class CartBuilder {
    private currency: string = "EUR";                  // default: irrilevante per la maggior parte dei test
    private readonly items: string[] = [];

    static aCart(): CartBuilder {
        return new CartBuilder();
    }

    withCurrency(currency: string): CartBuilder {
        this.currency = currency;
        return this;
    }

    withItem(item: string): CartBuilder {
        this.items.push(item);
        return this;
    }

    empty(): CartBuilder {
        this.items.length = 0;
        return this;
    }

    build(): Cart {
        const cart = new Cart(this.currency);
        this.items.forEach(item => cart.addItem(item));
        return cart;
    }
}

class UserBuilder {
    private username: string = "any-user";             // default: irrilevante
    private email: string    = "user@example.com";     // default: irrilevante
    private role: string     = "customer";             // default: irrilevante
    private active: boolean  = true;                   // default: attivo

    static aUser(): UserBuilder {
        return new UserBuilder();
    }

    withUsername(username: string): UserBuilder {
        this.username = username;
        return this;
    }

    // TODO: aggiungi withEmail(), withRole(), inactive()

    build(): User {
        return new User(this.username, this.email, this.role, this.active);
    }
}
