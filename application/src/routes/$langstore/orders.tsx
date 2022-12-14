import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { HttpCacheHeaderTaggerFromLoader } from '~/use-cases/http/cache';
import { useLoaderData } from '@remix-run/react';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { privateJson } from '~/core/bridge/privateJson.server';
import Orders from '~/ui/pages/Orders';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    return privateJson({ isServerSideAuthenticated: await isServerSideAuthenticated(request) });
};

export default () => {
    const { isServerSideAuthenticated } = useLoaderData();
    return <Orders isServerSideAuthenticated={isServerSideAuthenticated} />;
};
