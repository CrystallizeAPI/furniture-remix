import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string) => {
    return await apiClient.searchApi(
        `query SEARCH_ORDER_BY_PRICE_RANGE($path: [String!]) {
        search(
          first: 100,  
          filter: {
            type: PRODUCT
            include: { paths: $path }
          }
        ) {
          edges {
            node {
              name
              path
              ... on Product {
                matchingVariant {
                  isDefault
                  price
                  priceVariants {
                    identifier
                    name
                    price
                    currency
                  }
                  images {
                    variants {
                      url
                      width
                    }
                  }
                }
              }
            }
          }
        }
      }`,
        {
            path,
        },
    );
};
