import { LoaderFunction, LoaderFunctionArgs } from '@remix-run/node';
import { Response } from '@remix-run/web-fetch';
import ReactPDF from '@react-pdf/renderer';
import { Invoice } from '~/ui/components/pdf/order-invoice';
import { createOrderFetcher } from '@crystallize/js-api-client';
import { getStoreFront } from '~/use-cases/storefront.server';
import { getContext } from '~/use-cases/http/utils';

export const loader: LoaderFunction = async ({ params, request }: LoaderFunctionArgs) => {
    const requestContext = getContext(request);
    const { secret } = await getStoreFront(requestContext.host);
    const response = await createOrderFetcher(secret.apiClient).byId(`${params.id}`);
    let pdf = await ReactPDF.renderToStream(<Invoice data={response} />);

    let body: Buffer = await new Promise((resolve, reject) => {
        let chunks: Buffer[] = [];
        pdf.on('data', (chunk) => {
            chunks.push(chunk);
        });
        pdf.on('end', () => {
            resolve(Buffer.concat(chunks));
        });
        pdf.on('error', (error) => {
            reject(error);
        });
    });

    let headers = new Headers({
        'Content-Type': 'application/pdf',
    });

    return new Response(body, {
        status: 200,
        headers,
    });
};
