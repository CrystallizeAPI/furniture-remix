import { ClientInterface, customerInputRequest, CustomerInputRequest } from '@crystallize/js-api-client';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';

export default async (apiClient: ClientInterface, orderCustomer: CustomerInputRequest): Promise<void> => {
    if (orderCustomer?.identifier === '') {
        return;
    }
    const pimApi = apiClient.pimApi;

    // this actually convert the enum
    const checkInput = customerInputRequest.parse({
        firstName: orderCustomer?.firstName,
        lastName: orderCustomer?.lastName,
        identifier: orderCustomer?.identifier,
        addresses: orderCustomer?.addresses,
    });
    const result = await pimApi(`query { tenant { get(identifier: "${apiClient.config.tenantIdentifier}") { id } } }`);

    const mutation = {
        customer: {
            create: {
                __args: {
                    input: {
                        email: orderCustomer?.identifier,
                        tenantId: result.tenant.get.id,
                        ...checkInput,
                    },
                },
                identifier: true,
            },
        },
    };
    await pimApi(jsonToGraphQLQuery({ mutation })).catch(() => {});
};
