import { ClientInterface } from '@crystallize/js-api-client';
import { RequestContext } from '../http/utils';
import { handleAndPlaceCart, hydrateCart } from './cart';

export default async (apiClient: ClientInterface, context: RequestContext, body: any, customer: any) => {
    const cart = await hydrateCart(apiClient, context.language, body);
    return await handleAndPlaceCart(cart, customer, body.cartId as string);
};
