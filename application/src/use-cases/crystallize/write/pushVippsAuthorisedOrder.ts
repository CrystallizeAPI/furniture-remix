import { ClientInterface } from '@crystallize/js-api-client';

export default async (
    apiClient: ClientInterface,
    orderId: string,
    pipelineId: string,
    stageId: string,
): Promise<void> => {
    return await apiClient.pimApi(
        `mutation { order { setPipelineStage(orderId: "${orderId}", pipelineId: "${pipelineId}", stageId: "${stageId}") { id } } }`,
    );
};
