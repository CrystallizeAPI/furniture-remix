import { CartItem } from '@crystallize/node-service-api-request-handlers';

export type RemoteCart = {
    remoteCart: {
        cartId: string;
        cart: {
            total: any | null;
            cart: {
                items: CartItem[];
            } | null;
        };
        state: 'cart' | 'placed' | 'paid';
        extra?: any;
    } | null;
    loading: boolean;
};
