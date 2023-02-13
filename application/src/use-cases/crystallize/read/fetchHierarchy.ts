import { catalogueFetcherGraphqlBuilder, ClientInterface, createNavigationFetcher } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string, marketIdentifiers?: string[]) => {
    const fetch = createNavigationFetcher(apiClient).byFolders;
    const builder = catalogueFetcherGraphqlBuilder;
    const response = await fetch(path, language, 3, {}, (level) => {
        switch (level) {
            case 0:
                return {
                    __on: [
                        builder.onItem({
                            ...builder.onComponent('description', 'RichText', {
                                json: true,
                            }),
                        }),
                    ],
                };
            case 1:
                return {
                    __on: [
                        builder.onItem({
                            ...builder.onComponent('description', 'RichText', {
                                json: true,
                            }),
                        }),
                        builder.onFolder(),
                    ],
                };
            case 2:
                return {
                    __on: [
                        builder.onItem({
                            ...builder.onComponent('description', 'RichText', {
                                json: true,
                            }),
                        }),
                        builder.onProduct({
                            defaultVariant: {
                                price: true,
                                priceVariants: {
                                    price: true,
                                    currency: true,
                                    identifier: true,
                                    name: true,
                                    priceFor: {
                                        __args: {
                                            marketIdentifiers: marketIdentifiers,
                                        },
                                        identifier: true,
                                        price: true,
                                    },
                                },
                                attributes: {
                                    attribute: true,
                                    value: true,
                                },
                                firstImage: {
                                    altText: true,
                                    variants: {
                                        width: true,
                                        url: true,
                                    },
                                },
                            },
                        }),
                    ],
                };
            default:
                return {};
        }
    });
    return response;
};
