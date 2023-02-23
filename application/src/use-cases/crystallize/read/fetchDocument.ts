import { ClientInterface } from '@crystallize/js-api-client';

export default async (
    apiClient: ClientInterface,
    path: string,
    version: string,
    language: string,
    marketIdentifiers: string[] = [],
) => {
    return (
        await apiClient.catalogueApi(
            `#graphql
query ($language: String!, $path: String!, $version: VersionLabel, $marketIdentifiers: [String!]!) {
    catalogue(path: $path, language: $language, version: $version) {
      ... on Item {
        name
        createdAt
        updatedAt
        path
        shape {
          identifier
        }
        meta: component(id:"meta"){
          content {
            ...on ContentChunkContent {
              chunks {
                id
                content {
                  ...on SingleLineContent {
                    text
                  }
                  ...on RichTextContent {
                    plainText
                  }
                  ...on ImageContent {
                    firstImage {
                      url
                    }
                  }
                }
              }
            }
          }
        }
        components {
          type
          id
          content {
            ...on SingleLineContent {
              text
            }
            ...on RichTextContent {
              json
              plainText
            }
            ...on ImageContent {
              images {
                variants {
                  url
                  width
                  height
                }
              }
            }
            ...on ContentChunkContent {
              chunks {
                id
                name
                type
                content {
                  ... on SingleLineContent {
                    text
                  }
                  ... on NumericContent {
                    number
                    unit
                  }
                  ... on ItemRelationsContent {
                    items {
                      name
                      type
                      path
                      ...on Product {
                        id
                        defaultVariant {
                            id
                            name
                            sku
                          priceVariants {
                            identifier
                            name
                            price
                            currency
                            priceFor(marketIdentifiers: $marketIdentifiers) {
                                identifier
                                price
                            }
                        }
                          firstImage {
                            url
                            altText
                            variants {
                              url
                              width
                              height
                            }
                          }
                        stockLocations {
                            identifier
                            name
                            stock
                          }
                        }
                        variants {
                          id
                          name
                          sku
                          price
                          priceVariants {
                            identifier
                            name
                            price
                            currency
                            priceFor(marketIdentifiers: $marketIdentifiers) {
                                identifier
                                price
                            }
                          }
                          attributes {
                            value
                            attribute
                          }
                          stockLocations {
                            identifier
                            name
                            stock
                          }
                          isDefault
                          images {
                            url
                            altText
                            key
                      
                            variants {
                              key
                              height
                              width
                              url
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            ...on PropertiesTableContent {
              sections {
                properties {
                  key
                  value
                }
              }
            }
            ...on ComponentChoiceContent {
              selectedComponent {
                id
                content {
                  ...on ImageContent {
                    images {
                      variants {
                        url
                        width
                        height
                      }
                    }
                  }
                }
              }
            }
            ... on ItemRelationsContent {
              items {
                name
                type
                path
                ...on Product {
                  defaultVariant {
                    priceVariants {
                        identifier
                        name
                        price
                        currency
                        priceFor(marketIdentifiers: $marketIdentifiers) {
                            identifier
                            price
                        }
                    }
                    images {
                      variants {
                        url
                        width
                      }
                    }
                    price
                  }
                }
                components {
                  name
                  content {
                    ... on SingleLineContent {
                      text
                    }
                     ...on ComponentChoiceContent {
                      selectedComponent {
                        content {
                          ...on ImageContent {
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
              }
            }
            ...on ParagraphCollectionContent {
              paragraphs {
                title {
                  text
                }
                body {
                  json
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
  }`,
            {
                language,
                path,
                version: version === 'draft' ? 'draft' : 'published',
                marketIdentifiers,
            },
        )
    ).catalogue;
};
