import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, value: string, language: string): Promise<any[]> => {
    const data = await apiClient.searchApi(
        `#graphql
        query Search ($searchTerm: String!){
                        search(language:"${language}", first: 100, filter: { 
                            searchTerm: $searchTerm, 
                            type: PRODUCT, 
                            }){
                          edges {
                            node {
                              name
                              type
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
                                    url
                                    variants {
                                      url
                                      width
                                      key
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
            searchTerm: value,
        },
    );
    return data.search.edges;
};
