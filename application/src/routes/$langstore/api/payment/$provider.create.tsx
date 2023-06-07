import { ActionFunction, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { cartWrapperRepository } from '~/use-cases/services.server';
import { getStoreFront } from '~/use-cases/storefront.server';
import { default as initiateKlarnaPayment } from '~/use-cases/payments/klarna/initiatePayment';
import { default as initiateStripePayment } from '~/use-cases/payments/stripe/initiatePayment';
import { default as initiateQuickpayPayment } from '~/use-cases/payments/quickpay/initiatePayment';
import { default as initiateRazorPayPayment } from '~/use-cases/payments/razorpay/initiatePayment';
import { default as initiateMontonioPayPayment } from '~/use-cases/payments/montonio/initiatePayment';
import { default as initiateAdyenPayment } from '~/use-cases/payments/adyen/initiatePayment';
import { default as initiateVippsPayment } from '~/use-cases/payments/vipps/initiatePayment';

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

    const providers = {
        klarna: initiateKlarnaPayment,
        stripe: initiateStripePayment,
        quickpay: initiateQuickpayPayment,
        razorpay: initiateRazorPayPayment,
        montonio: initiateMontonioPayPayment,
        adyen: initiateAdyenPayment,
        vipps: initiateVippsPayment,
    };

    const data = await providers[params.provider as keyof typeof providers](
        cartWrapper,
        requestContext,
        body,
        storefront.config,
    );
    return json(data);
};
