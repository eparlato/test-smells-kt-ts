import { User } from './User';
import { Cart } from './Cart';

export class OrderService {
    canPlaceOrder(user: User, cart: Cart): boolean {
        return user.isActive() && !cart.isEmpty();
    }
}
