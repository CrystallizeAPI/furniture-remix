import { createNavigationFetcher, createCatalogueFetcher, createClient, catalogueFetcherGraphqlBuilder } from '@crystallize/js-api-client';
import { getJson, postJson } from '@crystallize/reactjs-hooks';
import { LocalCart } from './hooks/useLocalCart';

const apiClient = createClient({
    tenantIdentifier: 'furniture'
});

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
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/payment/crystalcoin/confirmed', { cartId: cartWrapper.cartId });
}

export async function placeCart(cart: LocalCart) {
    //@ts-ignore
    return await postJson<any>(window.ENV.SERVICE_API_URL + '/cart/place', {
        cartId: cart.cartId,
        locale: 'en',
        items: Object.values(cart.items)
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

export async function fetchNavigation() {
    return await createNavigationFetcher(apiClient).byFolders('/shop', 'en', 2);
}

export async function fetchProducts(path: string) {
    const fetch = createCatalogueFetcher(apiClient);
    const builder = catalogueFetcherGraphqlBuilder;
    const query = {
        catalogue: {
            __args: {
                path,
                language: 'en',
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
                                    url: true
                                }
                            }
                        }
                    }),
                    builder.onDocument(),
                    builder.onFolder()
                ]
            }
        }
    }
    const response = await fetch<any>(query);
    return response.catalogue.children.filter((item: any) => item.__typename === 'Product');
}


export async function fetchProduct(path: string) {
    //should be using the createCatalogueFetcher
    // just did this way to have everything for now

    return (await apiClient.catalogueApi(`query ($language: String!, $path: String!) {
  catalogue(language: $language, path: $path) {
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

`, {
        language: 'en',
        path
    })).catalogue
}

