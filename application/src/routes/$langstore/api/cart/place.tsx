import { ActionFunction } from '@remix-run/node';
import { authenticate, isAuthenticated as isServerSideAuthenticated } from '~/core/authentication.server';
import { getContext } from '~/use-cases/http/utils';
import { privateJson } from '~/core/bridge/privateJson.server';
import { getStoreFront } from '~/core/storefront.server';
import handlePlaceCart from '~/use-cases/checkout/handlePlaceCart';

export const action: ActionFunction = async ({ request }) => {
    const requestContext = getContext(request);
    const { secret: storefront } = await getStoreFront(requestContext.host);
    const isAuthenticated = await isServerSideAuthenticated(request);
    const authUser = isAuthenticated ? (await authenticate(request))?.user : null;
    const body = await request.json();

    const customerIdentifier = authUser?.aud || body.customer?.email || 'unknow@unknown.com';
    const customer = {
        ...body.customer,
        // we enforce those 3 values from the Authentication, it might not be overridden in the Form
        email: body.customer?.email || authUser?.aud || 'unknow@unknown.com',
        firstname: body.customer?.firstname || authUser.firstname,
        lastname: body.customer?.lastname || authUser.lastname,
        // then we decide of and customerIdentifier
        customerIdentifier,
        isGuest: !isAuthenticated,
    };

    return privateJson(await handlePlaceCart(storefront.apiClient, requestContext, body, customer));
};
