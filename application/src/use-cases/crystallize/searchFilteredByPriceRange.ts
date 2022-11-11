import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string, min: string, max: string) => {
    return await apiClient.searchApi(
        `#graphql
        query SEARCH_ORDER_BY_PRICE_RANGE($path: [String!], $min: Float, $max: Float) {
        search(
          language: "${language}"  
          first: 100,
          filter: {
            type: PRODUCT
            include: { paths: $path }
            productVariants: { priceRange: { min: $min, max: $max } }
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
      }
      `,
        {
            path,
            min,
            max,
        },
    );
};
