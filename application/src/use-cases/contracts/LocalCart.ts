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
    extra?: Record<string, string>;
};
