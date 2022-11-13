import { LoaderFunction } from '@remix-run/node';
import { privateJson } from '~/bridge/privateJson.server';
import { cartWrapperRepository } from '~/core-server/services.server';

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
