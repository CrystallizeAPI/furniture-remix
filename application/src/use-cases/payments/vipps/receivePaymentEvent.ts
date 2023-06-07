import { createClient } from '@crystallize/js-api-client';
import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    CartWrapper,
    CartWrapperRepository,
    VippsAppCredentials,
    VippsReceipt,
    addVippsReceiptOrder,
    handleVippsPayPaymentUpdateWebhookRequestPayload,
} from '@crystallize/node-service-api-request-handlers';
import pushOrder from '../../crystallize/write/pushOrder';

export default async (
    cartWrapperRepository: CartWrapperRepository,
    cartWrapper: CartWrapper, // once we actually use the webhook that won't be available, id will be in the payload fetchable by cartWrapperRepository
    payload: any,
    storeFrontConfig: TStoreFrontConfig,
) => {
    // once again here that is a trick, when use with webhooks we should follow the same dependency injection pattern as the other payment
    const apiClient = createClient({
        tenantId: storeFrontConfig.tenantId,
        tenantIdentifier: storeFrontConfig.tenantIdentifier,
        accessTokenId: storeFrontConfig.configuration.CRYSTALLIZE_ACCESS_TOKEN_ID,
        accessTokenSecret: storeFrontConfig.configuration.CRYSTALLIZE_ACCESS_TOKEN_SECRET,
    });

    return await handleVippsPayPaymentUpdateWebhookRequestPayload(payload, {
        handleEvent: async (payment: any) => {
            if (payment.state === 'AUTHORIZED') {
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
                ];

                const orderCreatedConfirmation = await pushOrder(cartWrapperRepository, apiClient, cartWrapper, {
                    //@ts-ignore
                    provider: 'custom',
                    custom: {
                        properties,
                    },
                });

                const credentials: VippsAppCredentials = {
                    origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
                    clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
                    clientSecret:
                        process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
                    merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
                    subscriptionKey:
                        process.env.VIPPS_SUBSCRIPTION_KEY ??
                        storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ??
                        '',
                };

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
                        taxPercentage: roundId(item.price.taxAmount / item.price.gross),
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
        },
    });
};
