import { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { useEffect, useState } from 'react';
import { MagickLoginForm } from '~/ui/components/checkout-forms/magicklogin';
import { useAuth } from '~/ui/hooks/useAuth';
import { HttpCacheHeaderTaggerFromLoader, StoreFrontAwaretHttpCacheHeaderTagger } from '~/use-cases/http/cache';
import { getStoreFront } from '~/core/storefront.server';
import { ServiceAPI } from '~/use-cases/service-api';
import { Price } from '~/ui/lib/pricing/pricing-component';
import DefaultImage from '~/assets/defaultImage.svg';
import { useAppContext } from '~/ui/app-context/provider';
import { getContext } from '~/use-cases/http/utils';
import { ClientOnly } from '@crystallize/reactjs-hooks';
import DownloadIcon from '~/assets/downloadIcon.svg';
import { useLoaderData } from '@remix-run/react';
import { isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { privateJson } from '~/core/bridge/privateJson.server';
import Orders from '~/ui/pages/Orders';

export const headers: HeadersFunction = ({ loaderHeaders }) => {
    return HttpCacheHeaderTaggerFromLoader(loaderHeaders).headers;
};

export const loader: LoaderFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { shared } = await getStoreFront(requestContext.host);
    return privateJson(
        { isServerSideAuthenticated: await isServerSideAuthenticated(request) },
        StoreFrontAwaretHttpCacheHeaderTagger('15s', '1w', ['orders'], shared.config.tenantIdentifier),
    );
};

export default () => {
    const { isServerSideAuthenticated } = useLoaderData();
    return <Orders isServerSideAuthenticated={isServerSideAuthenticated} />;
};
