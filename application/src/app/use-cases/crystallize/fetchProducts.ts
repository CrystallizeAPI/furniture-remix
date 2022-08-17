import { catalogueFetcherGraphqlBuilder, ClientInterface, createCatalogueFetcher } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string) => {
    const fetch = createCatalogueFetcher(apiClient);
    const builder = catalogueFetcherGraphqlBuilder;
    const query = {
        catalogue: {
            __args: {
                path,
                language,
            },
            children: {
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
                            firstImage: {
                                altText: true,
                                variants: {
                                    width: true,
                                    height: true,
                                    url: true,
                                },
                            },
                        },
                    }),
                    builder.onDocument(),
                    builder.onFolder(),
                ],
            },
        },
    };
    const response = await fetch<any>(query);
    return response.catalogue?.children?.filter((item: any) => item.__typename === 'Product') || [];
};
