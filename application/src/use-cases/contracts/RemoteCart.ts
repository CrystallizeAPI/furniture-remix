import { CartItem } from '@crystallize/node-service-api-request-handlers';

export type RemoteCart = {
    remoteCart: Cart | null;
    loading: boolean;
};

export type Cart = {
    id: string;
    items: CartItem[];
    total: {
        net: number;
        gross: number;
        taxAmount: number;
        discounts: number[];
        currency: string;
    };
    state: 'cart' | 'placed' | 'ordered';
    orderId?: string;
};
