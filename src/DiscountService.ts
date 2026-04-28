import { Cart } from './Cart';

export class DiscountService {
    apply(cart: Cart, coupon: string): number {
        if (coupon === "SAVE10") return cart.itemCount() * 10.0;
        return 0.0;
    }
}
