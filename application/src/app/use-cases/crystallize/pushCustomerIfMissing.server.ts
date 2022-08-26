import { ClientInterface, createCustomerManager, OrderCustomerInputRequest } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, orderCustomer: OrderCustomerInputRequest): Promise<void> => {
    if (orderCustomer?.identifier === '') {
        return;
    }
    const idResponse = await apiClient.catalogueApi(`query { tenant { id } }`);
    await createCustomerManager(apiClient).create({
        tenantId: idResponse.tenant.id,
        firstName: orderCustomer?.firstName || '',
        lastName: orderCustomer?.lastName || '',
        identifier: orderCustomer?.identifier,
        addresses: orderCustomer?.addresses,
        email: orderCustomer?.identifier || '',
    });
};
