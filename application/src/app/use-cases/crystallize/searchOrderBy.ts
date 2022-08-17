import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, orderBy?: any, fitlers?: any) => {
    const field = orderBy?.split('_')[0] || 'NAME';
    const direction = orderBy?.split('_')[1] || 'ASC';
    const priceRangeParams = fitlers.price;

    const results = await apiClient.searchApi(
        `query SEARCH_ORDERBY(
        $path: [String!]
        $field: OrderField!
        $direction: OrderDirection!
        $min: Float
        $max: Float
      ) {
        search(
          first: 100,
          orderBy: { field: $field, direction: $direction }
          filter: {
            type: PRODUCT
            productVariants: {  priceRange: { min: $min, max: $max } }
            include: { paths: $path }
          }
        ) {
          edges {
            node {
              name
              path
              ... on Product {
                  matchingVariant {
                  name
                  price
                  isDefault
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
            field: field === 'NAME' ? 'ITEM_NAME' : field,
            direction,
            min: priceRangeParams.min ? parseFloat(priceRangeParams.min) : 0.0,
            max: priceRangeParams.max ? parseFloat(priceRangeParams.max) : 0.0,
        },
    );

    return results?.search?.edges || [];
};
