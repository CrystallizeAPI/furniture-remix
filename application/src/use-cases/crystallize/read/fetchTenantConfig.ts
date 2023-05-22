import { ClientInterface } from '@crystallize/js-api-client';
import { TenantConfiguration } from '../../contracts/TenantConfiguration';
import { getCurrencyFromCode } from '~/use-cases/contracts/Currency';

const QUERY_FETCH_TENANT_CONFIG = `#graphql
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

export default async (apiClient: ClientInterface, tenantIdentifier: string): Promise<TenantConfiguration> => {
    try {
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
            currency: getCurrencyFromCode(currency.toUpperCase()),
            logo: tenant?.get?.logo,
        };
    } catch (error) {
        // we don't to break here, therefore we are returning a default config if the credentials are not working
        return {
            currency: getCurrencyFromCode('USD'),
        };
    }
};
