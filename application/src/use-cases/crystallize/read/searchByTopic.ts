import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, value: string, language: string) => {
    return await apiClient.searchApi(
        `#graphql
        query SEARCH_BY_TOPIC($value: String!) {
      topics: search(language: "${language}"){
        aggregations {
          topics {
            path
            name
          }
        }
      }
          search(
            language: "${language}"
            first: 100,
            filter: {
              type: PRODUCT
              include: {
                topicPaths: {
                  sections: [
                    { fields: { value: $value } }
                  ]
                }
              }
            }
          ) {
            edges {
              node {
                id
                name
                path
                topics {
                  name
                  path
                }
                ... on Product {
                  matchingVariant {
                    name
                    isDefault
                    price
                    priceVariants {
                      identifier
                      name
                      currency
                      price
                    }
                    attributes {
                        attribute
                        value
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
            value,
        },
    );
};
