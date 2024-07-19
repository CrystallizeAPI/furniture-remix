import { ClientInterface } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    VippsAppCredentials,
    VippsReceipt,
    addVippsReceiptOrder,
} from '@crystallize/node-service-api-request-handlers';
import { fetchOrderIntent } from '~/use-cases/crystallize/read/fetchOrderIntent';
import pushOrder from '~/use-cases/crystallize/write/pushOrder';
import pushVippsAuthorisedOrder from '~/use-cases/crystallize/write/pushVippsAuthorisedOrder';

export default async function (
    cartWrapper: CartWrapper,
    payment: any,
    apiClient: ClientInterface,
    storeFrontConfig: TStoreFrontConfig,
) {
    let properties = [
        {
            property: 'payment_method',
            value: 'Vipps',
        },
        {
            property: 'VippsReference',
            value: `${payment.reference}`,
        },
        {
            property: 'VippsPSPReference',
            value: `${payment.pspReference}`,
        },
        {
            property: 'VippsPaymentMethod',
            value: `${payment.paymentMethod.type}`,
        },
        {
            property: 'cartId',
            value: `${cartWrapper.cartId}`,
        },
    ];

    const orderIntent = await fetchOrderIntent(cartWrapper.cartId, {
        apiClient,
    });
    if (!orderIntent) {
        throw {
            message: `Order intent for cart ${cartWrapper.cartId} not found`,
            status: 404,
        };
    }

    const orderCreatedConfirmation = await pushOrder(
        orderIntent,
        {
            //@ts-ignore
            provider: 'custom',
            custom: {
                properties,
            },
        },
        { apiClient },
    );

    const credentials: VippsAppCredentials = {
        origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
        clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
        clientSecret: process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
        merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
        subscriptionKey:
            process.env.VIPPS_SUBSCRIPTION_KEY ?? storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ?? '',
    };

    pushVippsAuthorisedOrder(
        apiClient,
        orderCreatedConfirmation.id,
        process.env.VIPPS_PIPELINE_ID || '',
        process.env.VIPPS_AUTHORIZED_STAGE_ID || '',
    );

    const roundId = (value: number) => Math.round(value * 100) / 100;

    const receipt: VippsReceipt = {
        orderLines: cartWrapper.cart.cart.items.map((item) => ({
            id: item.variant.sku ?? item.variant.id ?? item.product.id,
            name: item.variant.name ?? item.product.name ?? item.variant.sku,
            unitInfo: {
                quantity: item.quantity,
                quantityUnit: 'PCS',
                unitPrice: roundId(item.price.net / item.quantity),
            },
            totalAmount: item.price.gross * 100,
            totalAmountExcludingTax: item.price.net * 100,
            totalTaxAmount: item.price.taxAmount * 100,
            taxPercentage: roundId((item.price.taxAmount / item.price.gross) * 100),
            discount:
                roundId(
                    item.price.discounts?.reduce((memo, discount) => {
                        return memo + (discount.amount || 0);
                    }, 0) ?? 0,
                ) * 100,
        })),
        bottomLine: {
            currency: 'NOK',
            tipAmount: 0,
            receiptNumber: orderCreatedConfirmation.id,
        },
    };
    // no need to wait here
    addVippsReceiptOrder(
        {
            paymentType: 'ecom',
            orderId: cartWrapper.cartId,
            receipt,
        },
        credentials,
    );
    return orderCreatedConfirmation;
}
