'use client';
import { useLocalStorage, writeStorage } from '@rehooks/local-storage';
import { LocalCart } from '~/use-cases/contracts/LocalCart';

const InitializeEmptyLocalCart = (): LocalCart => {
    return {
        items: {},
        cartId: '',
        state: 'cart',
        extra: {},
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
        clone: () => {
            update({
                ...cart,
                cartId: '',
            });
        },
        add: (
            item: {
                name: string;
                sku: string;
                price: number;
            },
            quantity: number = 1,
        ) => {
            if (isImmutable()) {
                return;
            }
            if (cart.items[item.sku]) {
                cart.items[item.sku].quantity = cart.items[item.sku].quantity + quantity;
            } else {
                cart.items[item.sku] = {
                    sku: item.sku,
                    name: item.name,
                    price: item.price,
                    quantity: quantity,
                };
            }
            update(cart);
        },
        remove: (item: { sku: string }) => {
            if (isImmutable()) {
                return;
            }
            if (cart.items[item.sku]) {
                if (cart.items[item.sku].quantity >= 1) {
                    cart.items[item.sku].quantity--;
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
        setVoucher: (voucher: string) => {
            if (isImmutable()) {
                return;
            }
            update({
                ...cart,
                extra: {
                    ...cart.extra,
                    voucher,
                },
            });
        },
    };
}
