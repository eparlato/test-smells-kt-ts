import { describe, test, expect, beforeEach } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { User } from '../src/User';
import { UserRepository } from '../src/UserRepository';
import { Cart } from '../src/Cart';
import { DiscountService } from '../src/DiscountService';
import { OrderService } from '../src/OrderService';

// =============================================================================
// KATA 1 — Test Interdependence
//
// Smell: i tre test condividono un UserRepository statico e dipendono
//        dall'ordine di esecuzione. Il primo salva un utente, il secondo
//        lo recupera, il terzo verifica il conteggio. Se il framework
//        li eseguisse in ordine diverso — cosa non garantita — fallirebbero.
//        Inoltre, lo stato accumulato da un test inquina i successivi.
//
// Fix: ?
// =============================================================================
describe('TestInterdependenceTest', () => {

    const repository = new UserRepository();

    test('step1_save_shouldPersistUser', () => {
        const user = new User("alice", "alice@example.com", "customer", true);

        repository.save(user);

        expect(repository.findByUsername("alice")).not.toBeUndefined();
    });

    test('step2_findByUsername_shouldReturnSavedUser', () => {
        const found = repository.findByUsername("alice");

        expect(found).not.toBeUndefined();
        expect(found!.getUsername()).toBe("alice");
    });

    test('step3_count_shouldReflectNumberOfSavedUsers', () => {
        expect(repository.count()).toBe(1);
    });
});

// =============================================================================
// KATA 2 — Eager Test
//
// Smell: il test verifica troppi comportamenti contemporaneamente:
//        che l'utente venga salvato, che sia recuperabile per username,
//        che sia attivo, e che il conteggio nel repository sia corretto.
//        Quando fallisce, non è chiaro quale dei quattro comportamenti
//        sia rotto, e ogni modifica al dominio può far fallire il test
//        per ragioni non correlate all'intenzione originale.
//
// Fix: ?
// =============================================================================
describe('EagerTestTest', () => {

    test('save_shouldPersistUserCorrectly', () => {
        const repository = new UserRepository();
        const user = new User("bob", "bob@example.com", "admin", true);

        repository.save(user);

        expect(repository.findByUsername("bob")).not.toBeUndefined();
        expect(repository.findByUsername("bob")!.getUsername()).toBe("bob");
        expect(repository.findByUsername("bob")!.isActive()).toBe(true);
        expect(repository.count()).toBe(1);
    });
});

// =============================================================================
// KATA 3 — Mystery Guest
//
// Smell: il test legge il coupon da una variabile d'ambiente e carica
//        i dati del carrello da un file esterno. Chi legge il test non
//        può capirne il comportamento senza conoscere il contenuto del
//        file e il valore della variabile d'ambiente. Se l'ambiente
//        cambia o il file non esiste, il test fallisce per ragioni
//        esterne alla logica testata.
//
// Fix: ?
// =============================================================================
describe('MysteryGuestTest', () => {

    test('applyDiscount_shouldReturnCorrectAmount', () => {
        // Il coupon viene letto dall'ambiente
        const coupon = process.env.DISCOUNT_COUPON;

        // I dati del carrello vengono caricati da file
        // Il file deve esistere in test/resources/cart.txt
        const currentDir = dirname(fileURLToPath(import.meta.url));
        const cartFile = resolve(currentDir, 'resources/cart.txt');
        const lines = readFileSync(cartFile, 'utf-8').split('\n').filter(line => line.length > 0);
        const cart = new Cart("EUR");
        lines.forEach(line => cart.addItem(line));

        const service = new DiscountService();
        const discount = service.apply(cart, coupon!);

        expect(discount).toBeGreaterThan(0);
    });
});

// =============================================================================
// KATA 4 — Inappropriate Sharing
//
// Smell: cart e user sono istanze condivise tra i due test tramite
//        campi di istanza della classe, ma vengono modificati durante
//        l'esecuzione. Il primo test aggiunge un item al carrello;
//        se il secondo test venisse eseguito dopo, partirebbe con uno
//        stato del carrello già alterato. L'ordine di esecuzione dei
//        test non è garantito, e vitest può anche parallelizzarli.
//
// Fix: ?
// =============================================================================
describe('InappropriateSharingTest', () => {

    let cart: Cart;
    let user: User;
    let orderService: OrderService;

    beforeEach(() => {
        cart = new Cart("EUR");
        user = new User("carol", "carol@example.com", "customer", true);
        orderService = new OrderService();
    });

    test('canPlaceOrder_shouldReturnTrue_whenCartHasItems', () => {
        cart.addItem("Laptop");

        expect(orderService.canPlaceOrder(user, cart)).toBe(true);
    });

    test('canPlaceOrder_shouldReturnFalse_whenCartIsEmpty', () => {
        expect(orderService.canPlaceOrder(user, cart)).toBe(false);
    });
});
