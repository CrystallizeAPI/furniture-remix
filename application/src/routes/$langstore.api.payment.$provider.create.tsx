import { ActionFunction, ActionFunctionArgs, json } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import { getStoreFront } from '~/use-cases/storefront.server';
import { default as initiateKlarnaPayment } from '~/use-cases/payments/klarna/initiatePayment';
import { default as initiateStripePayment } from '~/use-cases/payments/stripe/initiatePayment';
import { default as initiateQuickpayPayment } from '~/use-cases/payments/quickpay/initiatePayment';
import { default as initiateRazorPayPayment } from '~/use-cases/payments/razorpay/initiatePayment';
import { default as initiateMontonioPayPayment } from '~/use-cases/payments/montonio/initiatePayment';
import { default as initiateAdyenPayment } from '~/use-cases/payments/adyen/initiatePayment';
import { default as initiateVippsPayment } from '~/use-cases/payments/vipps/initiatePayment';
import { default as initiateDinteroPayment } from '~/use-cases/payments/dintero/initiatePayment';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';
import orderIntentToPaymentCart from '~/use-cases/mapper/API/orderIntentToPaymentCart';

export const action: ActionFunction = async ({ request, params }: ActionFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const body = await request.json();
    const cartId = body.cartId as string;
    const orderIntent = await fetchOrderIntent(cartId, {
        apiClient: storefront.apiClient,
    });
    if (!orderIntent) {
        throw {
            message: `Order intent for cart ${cartId} not found`,
            status: 404,
        };
    }

    const paymentCart = await orderIntentToPaymentCart(orderIntent);

    const providers = {
        klarna: initiateKlarnaPayment,
        stripe: initiateStripePayment,
        quickpay: initiateQuickpayPayment,
        razorpay: initiateRazorPayPayment,
        montonio: initiateMontonioPayPayment,
        adyen: initiateAdyenPayment,
        vipps: initiateVippsPayment,
        dintero: initiateDinteroPayment,
    };

    try {
        const data = await (providers[params.provider as keyof typeof providers] as any)(
            paymentCart,
            requestContext,
            body,
            storefront.config,
        );
        return json(data);
    } catch (error) {
        console.error(error);
        return json({ success: false, error: error }, 500);
    }
};
