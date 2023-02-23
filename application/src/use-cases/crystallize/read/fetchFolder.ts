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
    catalogue(language: $language, path: $path, version: $version) {
        id
        name
        path
        meta: component(id:"meta"){
          content {
            ...on ContentChunkContent {
              chunks {
                id
                type
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
              plainText
            }
            ... on ComponentChoiceContent {
              selectedComponent {
                name
                content {
                    ... on GridRelationsContent {
                        grids {
                          rows {
                            columns {
                              layout {
                                rowspan
                                colspan
                                colIndex
                                rowIndex
                              }
                              item {
                                name
                                path
                                type
                                shape {
                                  identifier
                                }
                                ...on Product {
                                  defaultVariant {
                                    price
                                    attributes {
                                        value
                                        attribute
                                    }
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
                                        height
                                        width
                                      }
                                    }
                                  }
                                }
                                components {
                                  type
                                  id
                                  content {
                                    ...on BooleanContent{
                                      value
                                    }
                                    ... on SingleLineContent {
                                      text
                                    }
                                    ... on RichTextContent {
                                      plainText
                                    }
                                    ... on ImageContent {
                                      images {
                                        url
                                        altText
                                        variants {
                                          url
                                          width
                                          height
                                        }
                                      }
                                    }
                                    ... on ComponentChoiceContent {
                                      selectedComponent {
                                        name
                                        content {
                                          ...on SingleLineContent {
                                            text
                                          }
                                          ... on VideoContent {
                                            videos {
                                                title
                                                playlists
                                                id
                                                thumbnails {
                                                    variants {
                                                        url
                                                        width
                                                        height
                                                    }
                                                }
                                            }
                                        }
                                          ... on ImageContent {
                                            images {
                                              url
                                              altText
                                              variants {
                                                url
                                                width
                                                height
                                              }
                                            }
                                          }
                                          ... on ItemRelationsContent {
                                            items {
                                              name
                                              type
                                              path
                                              components {
                                                id
                                                content {
                                                  ...on SingleLineContent {
                                                    text
                                                  }
                                                  ...on RichTextContent {
                                                    plainText
                                                  }
                                                  ...on ComponentChoiceContent {
                                                    selectedComponent {
                                                      content {
                                                        ...on ImageContent {
                                                          firstImage {
                                                            url
                                                            altText
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
                                                }
                                              }
                                              ...on Product {
                                                defaultVariant {
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
                                                  firstImage {
                                                    url
                                                    altText
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
                                        }
                                      }
                                    }
                                    ... on ContentChunkContent {
                                      chunks {
                                        id  
                                        content {
                                          ... on NumericContent {
                                            number
                                            unit
                                          }
                                          ...on SingleLineContent{
                                              text
                                          }
                                          ...on SelectionContent {
                                              options {
                                                  value
                                                  key 
                                              }
                                          }
                                          ...on BooleanContent {
                                              value
                                          }
                                          ... on ItemRelationsContent {
                                            items {
                                              name
                                              type
                                              path
                                              ...on Product {
                                                id
                                                defaultVariant {
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
                                                  firstImage {
                                                    url
                                                    altText
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
                                          ...on PropertiesTableContent {
                                              sections {
                                                  title
                                                  properties {
                                                      key
                                                      value
                                                  }
                                              }
                                          }
                                        }
                                      }
                                    }
                                    ... on SelectionContent {
                                      options {
                                        value
                                        key
                                      }
                                    }
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                  
                  ... on ItemRelationsContent {
                    items {
                      name
                      path
                      type
                      shape {
                        identifier
                      }
                      components {
                        type
                        id
                        content {
                            ...on BooleanContent{
                                value
                            }
                            ... on SingleLineContent {
                                text
                            }
                            ... on RichTextContent {
                                plainText
                            }
                            ... on ImageContent {
                                images {
                                    url
                                    altText
                                    variants {
                                      url
                                      width
                                      height
                                    }
                                }
                            }
                            ... on ComponentChoiceContent {
                                selectedComponent {
                                    name
                                    content {
                                        ...on SingleLineContent {
                                            text
                                        }
                                        ... on VideoContent {
                                            videos {
                                                title
                                                playlists
                                                id
                                                thumbnails {
                                                    variants {
                                                        url
                                                        width
                                                        height
                                                    }
                                                }
                                            }
                                        }
                                        ... on ImageContent {
                                            images {
                                              url
                                              altText
                                              variants {
                                                url
                                                width
                                                height
                                              }
                                            } 
                                        }
                                        ... on ItemRelationsContent {
                                            items {
                                              name
                                              type
                                              path
                                              components {
                                                id
                                                content {
                                                  ...on SingleLineContent {
                                                    text
                                                  }
                                                  ...on RichTextContent {
                                                    plainText
                                                  }
                                                  ...on ComponentChoiceContent {
                                                    selectedComponent {
                                                      content {
                                                        ...on ImageContent {
                                                          firstImage {
                                                            url
                                                            altText
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
                                                }
                                              }
                                              ...on Product {
                                                defaultVariant {
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
                                                  firstImage {
                                                    url
                                                    altText
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
                                        }
                                      }
                                    }
                                    ... on ContentChunkContent {
                                      chunks {
                                        id  
                                        content {
                                          ... on NumericContent {
                                            number
                                            unit
                                          }
                                          ...on SingleLineContent{
                                              text
                                          }
                                          ...on SelectionContent {
                                              options {
                                                  value
                                                  key
                                              }
                                          }
                                          ...on BooleanContent {
                                              value
                                          }
                                          ... on ItemRelationsContent {
                                            items {
                                              name
                                              type
                                              path
                                              ...on Product {
                                                id
                                                defaultVariant {
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
                                                  firstImage {
                                                    url
                                                    altText
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
                                          ...on PropertiesTableContent {
                                              sections {
                                                  title
                                                  properties {
                                                      key
                                                      value
                                                  }
                                              }
                                          }
                                        }
                                      }
                                    }
                                    ... on SelectionContent {
                                      options {
                                        value
                                        key
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
        }
      }
    }
  `,
            {
                language: 'en',
                path,
                version: version === 'draft' ? 'draft' : 'published',
                marketIdentifiers,
            },
        )
    ).catalogue;
};
