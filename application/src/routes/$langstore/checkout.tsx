import { HttpCacheHeaderTaggerFromLoader } from '~/use-cases/http/cache';
import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { useLoaderData } from '@remix-run/react';
import { privateJson } from '~/core/bridge/privateJson.server';
import Checkout from '~/ui/pages/Checkout';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    return privateJson({ isServerSideAuthenticated: await isServerSideAuthenticated(request) });
};

export default () => {
    const { isServerSideAuthenticated } = useLoaderData();
    return <Checkout isServerSideAuthenticated={isServerSideAuthenticated} />;
};
