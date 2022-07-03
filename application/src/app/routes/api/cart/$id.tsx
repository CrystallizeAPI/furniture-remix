import { ActionFunction } from '@remix-run/node';
import { privateJson } from '~/core-server/privateJson.server';
import { cartWrapperRepository } from '~/core-server/services.server';

export const action: ActionFunction = async ({ params }) => {
    const cartWrapper = await cartWrapperRepository.find(params.id!);
    if (!cartWrapper) {
        throw {
            message: `Cart '${params.id!}' does not exist.`,
            status: 404,
        };
    }
    return privateJson(cartWrapper);
};
