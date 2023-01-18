import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { Invoice } from '~/ui/components/pdf/order-invoice';
import { createOrderFetcher } from '@crystallize/js-api-client';
import { getStoreFront } from '~/use-cases/storefront.server';
import { getContext } from '~/use-cases/http/utils';

export const loader: LoaderFunction = async ({ context, params, request }) => {
    const requestContext = getContext(request);
    const { secret } = await getStoreFront(requestContext.host);
    const response = await createOrderFetcher(secret.apiClient).byId(`${params.id}`);
    let pdf = await ReactPDF.renderToStream(<Invoice data={response} />);

    return new Response(pdf, {
        headers: {
            'Content-Type': 'application/pdf',
        },
    });
};
