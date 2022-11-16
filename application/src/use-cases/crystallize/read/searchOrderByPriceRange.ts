import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string) => {
    return await apiClient.searchApi(
        `#graphql
        query SEARCH_ORDER_BY_PRICE_RANGE($path: [String!]) {
        search(
          language: "${language}"
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
