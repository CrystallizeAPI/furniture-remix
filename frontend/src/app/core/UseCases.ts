import {
  createNavigationFetcher,
  createCatalogueFetcher,
  catalogueFetcherGraphqlBuilder,
  ClientInterface,
} from '@crystallize/js-api-client';
import { getJson, postJson } from '@crystallize/reactjs-hooks';
import { LocalCart } from './hooks/useLocalCart';

export let customer = (formData: any) => {
  return;
};

export async function fetchPaymentIntent(cart: LocalCart): Promise<any> {
  //@ts-ignore
  return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/stripe/intent/create', { cartId: cart.cartId });
}

export async function fetchOrders() {
  //@ts-ignore
  return await getJson<any>(window.ENV.SERVICE_API_URL + '/orders');
}

export async function fetchOrder(orderId: string) {
  //@ts-ignore
  return await getJson<any>(window.ENV.SERVICE_API_URL + '/order/' + orderId);
}

// in real life that would not be that simple and the paid acknowledgement would be a separate service and/or call by the payment provider
export async function sendPaidOrder(cart: LocalCart) {
  const cartWrapper = await placeCart(cart);
  //@ts-ignore
  return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystalcoin/confirmed', {
    cartId: cartWrapper.cartId,
  });
}

export async function placeCart(cart: LocalCart) {
  //@ts-ignore
  return await postJson<any>(window.ENV.SERVICE_API_URL + '/cart/place', {
    cartId: cart.cartId,
    locale: 'en',
    items: Object.values(cart.items),
  });
}

export async function registerAndSendMagickLink(userInfos: any) {
  //@ts-ignore
  return await postJson<any>(window.ENV.SERVICE_API_URL + '/register/email/magicklink', userInfos);
}

export async function fetchCart(cartId: string) {
  //@ts-ignore
  return await getJson<any>(window.ENV.SERVICE_API_URL + '/cart/' + cartId);
}

export async function fetchNavigation(apiClient: ClientInterface) {
  return await createNavigationFetcher(apiClient).byFolders('/shop', 'en', 3);
}

export async function fetchProducts(apiClient: ClientInterface, path: string) {
  const fetch = createCatalogueFetcher(apiClient);
  const builder = catalogueFetcherGraphqlBuilder;
  const query = {
    catalogue: {
      __args: {
        path,
        language: 'en'
      },
      children: {
        __on: [
          builder.onItem(),
          builder.onProduct({
            defaultVariant: {
              price: true,
              firstImage: {
                altText: true,
                variants: {
                  width: true,
                  url: true,
                },
              },
            },
          }),
          builder.onDocument(),
          builder.onFolder(),
        ],
      },
    },
  };
  const response = await fetch<any>(query);
  return response.catalogue.children.filter((item: any) => item.__typename === 'Product');
}

export async function fetchCampaignPage(apiClient: ClientInterface, path: string, version: any) {
  return (
    await apiClient.catalogueApi(
      `query ($language: String!, $path: String!, $version: VersionLabel) {
    catalogue(path: $path, language: $language, version: $version) {
      ... on Item {
        name
        path
        component(id: "grid") {
          content {
            ... on GridRelationsContent {
              grids {
                rows {
                  columns {
                    layout {
                      rowspan
                      colspan
                    }
                    item {
                      name
                      path
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
                          ... on ComponentChoiceContent {
                            selectedComponent {
                              name
                              content {
                                ...on SingleLineContent {
                                  text
                                }
                                ... on ImageContent {
                                  images {
                                    url
                                    altText
                                  }
                                }
                                ... on ItemRelationsContent {
                                  items {
                                    name
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
                                        firstImage {
                                          url
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
                              content {
                                ... on SingleLineContent {
                                  text
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
  }`,
      {
        language: 'en',
        path,
        version: version === "draft" ? "draft" : "published"
      },
    )
  ).catalogue;
}

export async function fetchDocument(apiClient: ClientInterface, path: string, version: string) {
  return (
    await apiClient.catalogueApi(
      `query ($language: String!, $path: String!, $version: VersionLabel) {
    catalogue(path: $path, language: $language, version: $version) {
      ... on Item {
        name
        path
        components {
          type
          id
          content {
            ...on SingleLineContent {
              text
            }
            ...on RichTextContent {
              json
            }
            ...on ImageContent {
              images {
                variants {
                  url
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
                ...on Product {
                  defaultVariant {
                    images {
                      variants {
                        url
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
                  variants {
                    url
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
        language: 'en',
        path,
        version: version === "draft" ? "draft" : "published"
      },
    )
  ).catalogue;
}

export async function fetchProduct(apiClient: ClientInterface, path: string, version: string) {
  //should be using the createCatalogueFetcher
  // just did this way to have everything for now

  return (
    await apiClient.catalogueApi(
      `
      query ($language: String!, $path: String!, $version: VersionLabel!) {
      catalogue(language: $language, path: $path, version: $version) {
      ...on Product {
        ...product
        topics {
          path
          name
        }
      }
    }
  }
  
  fragment content on ComponentContent {
    ...boolean
    ...singleLine
    ...richText
    ...imageContent
    ...paragraphCollection
    ...itemRelations
    ...gridRelations
    ...location
    ...propertiesTable
    ...dateTime
    ...videoContent
    ...numeric
    ...selection
    ...file
  }
  
  fragment component on Component {
    id
    name
    type
    content {
      ...content
      ...componentChoice
      ...contentChunk
    }
  }
  
  fragment dateTime on DatetimeContent {
    datetime
  }
    
  
  fragment gridRelations on GridRelationsContent {
    grids {
      id
      name
    }
  }
  
  fragment imageContent on ImageContent {
    images {
      ...image
    }
  }
  
  fragment image on Image {
    url
    altText
    key
    variants {
      url
      width
      key
    }
  }
  
  fragment itemRelations on ItemRelationsContent {
    items {
      id
      name
      path
      ...on Product {
        defaultVariant {
          price
          images {
            variants {
              url
            }
          }
        }
      }
    }
  }
  
  fragment location on LocationContent {
    lat
    long
  }
  
  fragment paragraphCollection on ParagraphCollectionContent {
    paragraphs {
      title {
        ...singleLine
      }
      body {
        ...richText
      }
      images {
        ...image
      }
    }
  }
  
  fragment product on Product {
    id
    name
    type
    language
    path
  
    components {
      ...component
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
          width
          url
        }
      }
  
      subscriptionPlans {
        identifier
        name
        periods {
          id
          name
          initial {
            priceVariants {
              identifier
              name
              price
              currency
            }
          }
          recurring {
            priceVariants {
              identifier
              name
              price
              currency
            }
          }
        }
      }
    }
  
    vatType {
      name
      percent
    }
  }
  
  fragment propertiesTable on PropertiesTableContent {
    sections {
      ... on PropertiesTableSection {
        title
        properties {
          key
          value
        }
      }
    }
  }
  
  fragment richText on RichTextContent {
    json
    html
    plainText
  }
  
  fragment boolean on BooleanContent {
    value
  }
  
  fragment singleLine on SingleLineContent {
    text
  }
  
  fragment videoContent on VideoContent {
    videos {
      ...video
    }
  }
  
  fragment video on Video {
    id
    playlists
    title
    thumbnails {
      ...image
    }
  }
  
  fragment numeric on NumericContent {
    number
    unit
  }
  
  fragment componentChoice on ComponentChoiceContent {
    selectedComponent {
      id
      name
      type
      content {
        ...content
      }
    }
  }
  
  fragment contentChunk on ContentChunkContent {
    chunks {
      id
      name
      type
      content {
        ...content
      }
    }
  }
  
  fragment selection on SelectionContent {
    options {
      key
      value
    }
  }
  
  
  fragment file on FileContent {
    files {
      url
      key
      title
      size
    }
  }  

`,
      {
        language: 'en',
        path,
        version: version === "draft" ? "draft" : "published"
      },
    )
  ).catalogue;
}

export async function fetchFolder(apiClient: ClientInterface, path: string, version: string) {
  return (
    await apiClient.catalogueApi(
      `query ($language: String!, $path: String!, $version: VersionLabel) {
    catalogue(language: $language, path: $path, version: $version) {
        name
        components {
          type
          content {
            ...on SingleLineContent {
              text
            }
            ...on RichTextContent {
              plainText
            }
          }
        }
        children {
          name
          path
          ...on Document {
            name
            path
            components {
              id
              type
              content {
                ...on SingleLineContent {
                  text
                }
                ...on RichTextContent {
                  plainText
                }
                ...on ComponentChoiceContent {
                  selectedComponent {
                    id
                    content {
                      ...on ImageContent {
                        images {
                          variants {
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
          ...on Product {
            defaultVariant {
              price
              firstImage {
                url
                altText
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
        version: version === "draft" ? "draft" : "published"
      },
    )
  ).catalogue;
}
