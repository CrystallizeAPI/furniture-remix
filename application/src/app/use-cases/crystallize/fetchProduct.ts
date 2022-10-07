import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, version: string, language: string) => {
    //should be using the createCatalogueFetcher
    // just did this way to have everything for now

    return (
        await apiClient.catalogueApi(
            `
      query ($language: String!, $path: String!, $version: VersionLabel!) {
      catalogue(language: $language, path: $path, version: $version) {
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
      height
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
              height
              width
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
      description: component(id:"description") {
        content {
            ...on ComponentChoiceContent {
                selectedComponent {
                    id
                    content {
                        ...richText
                    }
                }
            }
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
                language,
                path,
                version: version === 'draft' ? 'draft' : 'published',
            },
        )
    ).catalogue;
};
