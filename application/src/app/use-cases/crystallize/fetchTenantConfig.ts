import { ClientInterface } from '@crystallize/js-api-client';

const QUERY_FETCH_TENANT_CONFIG = `
query FETCH_TENANT_CONFIG ($identifier: String!) {
    tenant {
        get(identifier: $identifier) {
            id
            logo {
                key
                url
                variants {
                    ... on ImageVariant {
                        key
                        url
                        width
                        height
                    }
                }
            }
        }
    }
}`;

export default async (
    apiClient: ClientInterface,
    tenantIdentifier: string,
): Promise<{ currency: string; logo: { key: string; url: string } }> => {
    const { tenant } = await apiClient.pimApi(QUERY_FETCH_TENANT_CONFIG, {
        identifier: tenantIdentifier,
    });
    const tenantId = tenant?.get?.id;

    const currency = (
        await apiClient.pimApi(
            `query { priceVariant{ get(identifier:"default", tenantId:"${tenantId}") { currency } } }`,
        )
    )?.priceVariant?.get?.currency;
    return {
        currency,
        logo: tenant?.get?.logo,
    };
};
