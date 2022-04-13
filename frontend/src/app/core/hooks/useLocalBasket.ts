import { useLocalStorage, writeStorage } from '@rehooks/local-storage';

export function useLocalBasket() {
    const [basket] = useLocalStorage<any>('basket', { items: {} });

    const update = (basket: any) => {
        writeStorage('basket', {
            ...basket
        });
    };

    return {
        basket,
        emptyBasket: () => {
            update({
                ...basket,
                items: {}
            });
        },
        addToBasket: (variant: any) => {
            if (basket.items[variant.sku]) {
                basket.items[variant.sku].quantity++;
            } else {
                basket.items[variant.sku] = {
                    sku: variant.sku,
                    name: variant.name,
                    price: variant.price,
                    quantity: 1
                };
            }

            update(basket);
        },
        removeFromBasket: (variant: any) => {
            if (basket.items[variant.sku]) {
                if (basket.items[variant.sku].quantity >= 1) {
                    basket.items[variant.sku].quantity--;
                }
            }
            const items = Object.keys(basket.items).reduce((accumulator: any, key: any) => {
                const item = basket.items[key];
                if (item.quantity > 0) {
                    accumulator[item.sku] = item;
                }
                return accumulator;
            }, {});
            update({
                ...basket,
                items: items
            });
        }
    }

}
