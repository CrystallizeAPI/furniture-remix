import { LoaderFunction } from '@remix-run/node';
import { privateJson } from '~/core/bridge/privateJson.server';
import { cartWrapperRepository } from '~/use-cases/services.server';

export const loader: LoaderFunction = async ({ params }) => {
    const cartWrapper = await cartWrapperRepository.find(params.id!);
    if (!cartWrapper) {
        throw {
            message: `Cart '${params.id!}' does not exist.`,
            status: 404,
        };
    }
    return privateJson(cartWrapper);
};
