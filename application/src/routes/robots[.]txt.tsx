import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import {
    HttpCacheHeaderTaggerFromLoader,
    StoreFrontAwaretHttpCacheHeaderTagger,
} from '~/core-server/http-cache.server';
import { getContext } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    console.log(shared.config);
    return new Response(
        `User-agent: *\n${shared.config.identifier !== 'furniture' ? 'Disallow: ' : 'Allow: '}/\n`,
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['/robots.txt'], shared.config.tenantIdentifier),
    );
};
