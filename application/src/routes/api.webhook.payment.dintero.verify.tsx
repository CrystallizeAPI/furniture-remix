import { json, LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { getContext } from '~/use-cases/http/utils';
import receivePayment from '~/use-cases/payments/dintero/receivePayment';
import { getStoreFront } from '~/use-cases/storefront.server';

export let loader: LoaderFunction = async ({ request }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);

    const transactionId = requestContext.url.searchParams.get('transaction_id');

    const { secret: storefront } = await getStoreFront(requestContext.host);

    const data = await receivePayment(storefront.apiClient, transactionId, storefront.config);

    return json(data);
};
