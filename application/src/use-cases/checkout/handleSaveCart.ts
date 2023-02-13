import { ClientInterface } from '@crystallize/js-api-client';
import { RequestContext } from '../http/utils';
import { handleAndSaveCart, hydrateCart } from './cart';

export default async (apiClient: ClientInterface, context: RequestContext, body: any) => {
    const cart = await hydrateCart(apiClient, context.language, body);

    return await handleAndSaveCart(cart, body.cartId as string);
};
