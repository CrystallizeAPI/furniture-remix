import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

export type LocalCart = {
    items: {
        [key: string]: {
            name: string;
            quantity: number;
            price: number;
            sku: string;
        };
    };
    cartId: string;
    state: 'cart' | 'placed' | 'paid';
};

const InitializeEmptyLocalCart = (): LocalCart => {
    return {
        items: {},
        cartId: '',
        state: 'cart',
    };
};

export function useLocalCart() {
    const [cart] = useLocalStorage<LocalCart>('cart', InitializeEmptyLocalCart());

    const update = (cart: LocalCart) => {
        writeStorage('cart', {
            ...cart,
        });
    };

    const isImmutable = () => {
        return cart.state === 'placed' || cart.state === 'paid';
    };

    return {
        cart,
        setWrappingData: (cartId: string, cartState: string) => {
            update({
                ...cart,
                cartId,
                state: cartState as 'cart' | 'placed',
            });
        },
        empty: () => {
            update({
                ...cart,
                ...InitializeEmptyLocalCart(),
            });
        },
        isImmutable,
        isEmpty: () => {
            return Object.keys(cart.items).length === 0;
        },
        add: (variant: any) => {
            if (isImmutable()) {
                return;
            }
            if (cart.items[variant.sku]) {
                cart.items[variant.sku].quantity++;
            } else {
                cart.items[variant.sku] = {
                    sku: variant.sku,
                    name: variant.name,
                    price: variant.price,
                    quantity: 1,
                };
            }
            update(cart);
        },
        remove: (variant: any) => {
            if (isImmutable()) {
                return;
            }
            if (cart.items[variant.sku]) {
                if (cart.items[variant.sku].quantity >= 1) {
                    cart.items[variant.sku].quantity--;
                }
            }
            const items = Object.keys(cart.items).reduce((accumulator: any, key: any) => {
                const item = cart.items[key];
                if (item.quantity > 0) {
                    accumulator[item.sku] = item;
                }
                return accumulator;
            }, {});
            update({
                ...cart,
                items: items,
            });
        },
    };
}
