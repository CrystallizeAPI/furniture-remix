import { LoaderFunction, Response } from '@remix-run/node';
import ReactPDF from '@react-pdf/renderer';
import { Invoice } from '~/core/components/pdf/order-invoice';
import { ServiceAPI } from '~/use-cases/service-api';
import { createOrderFetcher } from '@crystallize/js-api-client';
import { getStoreFront } from '~/core-server/storefront.server';
import { getHost } from '~/core-server/http-utils.server';

export const loader: LoaderFunction = async ({ context, params, request }) => {
    const { secret } = await getStoreFront(getHost(request));
    const response = await createOrderFetcher(secret.apiClient).byId(`${params.id}`);

    let pdf = await ReactPDF.renderToStream(<Invoice data={response} />);

    return new Response(pdf, {
        headers: {
            'Content-Type': 'application/pdf',
        },
    });
};
