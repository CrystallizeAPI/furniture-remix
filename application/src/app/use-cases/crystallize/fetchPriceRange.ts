import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string) => {
    return await apiClient.searchApi(
        `query GET_PRICE_RANGE($path: [String!]) {
        search(
          filter: {
            type: PRODUCT
            include: { paths: $path }
          }
        ) {
          aggregations {
            price {
              min
              max
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
