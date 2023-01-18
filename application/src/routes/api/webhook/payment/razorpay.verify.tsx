import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { cartWrapperRepository } from '~/use-cases/services.server';
import { getStoreFront } from '~/use-cases/storefront.server';
import receivePaymentEvent from '~/use-cases/payments/razorpay/receivePaymentEvent';

export const action: ActionFunction = async ({ request, params }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const cartId = body.cartId as string;
    const cartWrapper = await cartWrapperRepository.find(cartId);

    if (!cartWrapper) {
        throw {
            message: `Cart '${cartId}' does not exist.`,
            status: 404,
        };
    }
    const data = await receivePaymentEvent(cartWrapperRepository, storefront.apiClient, body, storefront.config);

    return json(data);
};
