import { ClientInterface } from '@crystallize/js-api-client';

export default async (
    apiClient: ClientInterface,
    path: string,
    language: string,
    orderBy?: any,
    filters?: any,
    attributes?: any,
) => {
    const field = orderBy?.split('_')[0] || 'NAME';
    const direction = orderBy?.split('_')[1] || 'ASC';
    const priceRangeParams = filters?.price;

    attributes = attributes?.map((attribute: string) => {
        return {
            attribute: attribute?.split('_')[0],
            value: attribute?.split('_')[1],
        };
    });

    const attributeFilters = attributes?.reduce(
        (
            acc: { [x: string]: { attribute: string; values: string[] } },
            { attribute, value }: { attribute: string; value: string },
        ) => {
            acc[attribute] ??= { attribute, values: [] };
            acc[attribute].values.push(value);
            return acc;
        },
        [],
    );

    const results = await apiClient.searchApi(
        `#graphql
        query SEARCH_ORDERBY(
        $path: [String!]
        $field: OrderField!
        $direction: OrderDirection!
        $min: Float
        $max: Float
        $attributes: [VariantAttributeFilter!]
      ) {
        search(
          language: "${language}"
          first: 100,
          orderBy: { field: $field, direction: $direction }
          filter: {
            type: PRODUCT
            productVariants: { priceRange: { min: $min, max: $max }, attributes: $attributes }
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
                  sku
                  attributes {
                    attribute
                    value
                  }
                  priceVariants {
                    identifier
                    name
                    price
                    currency
                  }
                  images {
                    url
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
            min: priceRangeParams?.min ? parseFloat(priceRangeParams.min) : 0.0,
            max: priceRangeParams?.max ? parseFloat(priceRangeParams.max) : 0.0,
            attributes: Object?.values(attributeFilters) as [],
        },
    );

    return results?.search?.edges || [];
};
