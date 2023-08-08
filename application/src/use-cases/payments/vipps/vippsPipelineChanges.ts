import { TStoreFrontConfig } from '@crystallize/js-storefrontaware-utils';
import {
    VippsAppCredentials,
    cancelVippsPayment,
    captureVippsPayment,
    refundVippsPayment,
} from '@crystallize/node-service-api-request-handlers';

export default async (order: any, storeFrontConfig: TStoreFrontConfig) => {
    order = order.get;
    const vippsReference = order.payment?.[0]?.properties?.find(
        (property: any) => property.property === 'VippsReference',
    )?.value;

    const credentials: VippsAppCredentials = {
        origin: process.env.VIPPS_ORIGIN ?? storeFrontConfig?.configuration?.VIPPS_ORIGIN ?? '',
        clientId: process.env.VIPPS_CLIENT_ID ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_ID ?? '',
        clientSecret: process.env.VIPPS_CLIENT_SECRET ?? storeFrontConfig?.configuration?.VIPPS_CLIENT_SECRET ?? '',
        merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
        subscriptionKey:
            process.env.VIPPS_SUBSCRIPTION_KEY ?? storeFrontConfig?.configuration?.VIPPS_SUBSCRIPTION_KEY ?? '',
    };

    const vippsPipelineStageId = order.pipelines.find(
        (pipeline: any) => pipeline.pipeline.id === process.env.VIPPS_PIPELINE_ID,
    )?.stageId;

    const createBody = (state: string) => {
        return {
            merchantInfo: {
                merchantSerialNumber: process.env.VIPPS_MSN ?? storeFrontConfig?.configuration?.VIPPS_MSN ?? '',
            },
            transaction: {
                transactionText: `Order ${state}`,
            },
        };
    };

    try {
        switch (vippsPipelineStageId) {
            case `${process.env.VIPPS_CAPTURED_STAGE_ID}`:
                await captureVippsPayment(vippsReference, credentials, createBody('captured'));
                break;
            case `${process.env.VIPPS_CANCELLED_STAGE_ID}`:
                await cancelVippsPayment(vippsReference, credentials, createBody('cancelled'));
                break;
            case `${process.env.VIPPS_REFUNDED_STAGE_ID}`:
                await refundVippsPayment(vippsReference, credentials, createBody('refunded'));
                break;
            default:
                break;
        }
    } catch (error) {
        console.log(error);
    }
};
