import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string) => {
    return await apiClient.searchApi(
        `#graphql
        query GET_PRICE_RANGE($path: [String!]) {
        search(
          filter: {
            type: PRODUCT
            include: { paths: $path }
          }
        ) {
          aggregations {
            price: price {
              min
              max
            }
            attributes: variantAttributes {
              attribute
              value
            }
          }
        }
      }
      `,
        {
            path,
        },
    );
};
