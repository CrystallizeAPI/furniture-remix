import { catalogueFetcherGraphqlBuilder, ClientInterface, createNavigationFetcher } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string) => {
    const fetch = createNavigationFetcher(apiClient).byFolders;
    const builder = catalogueFetcherGraphqlBuilder;
    const response = await fetch(
        path,
        language,
        3,
        {
            tenant: {
                __args: {
                    language,
                },
                name: true,
            },
        },
        (level) => {
            switch (level) {
                case 0:
                    return {};
                case 1:
                    return {
                        __on: [
                            builder.onItem({
                                ...builder.onComponent('intro', 'RichText', {
                                    json: true,
                                }),
                            }),
                            builder.onFolder(),
                        ],
                    };
                case 2:
                    return {
                        __on: [
                            builder.onItem(),
                            builder.onProduct({
                                defaultVariant: {
                                    price: true,
                                    priceVariants: {
                                        price: true,
                                        currency: true,
                                        identifier: true,
                                        name: true,
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
        },
    );
    return response;
};
