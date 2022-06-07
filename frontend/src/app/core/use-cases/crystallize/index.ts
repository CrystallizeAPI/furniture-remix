import {
    createNavigationFetcher,
    createCatalogueFetcher,
    catalogueFetcherGraphqlBuilder,
    ClientInterface,
} from '@crystallize/js-api-client';

export const CrystallizeAPI = {
    fetchNavigation,
    fetchTopicNavigation,
    fetchProducts,
    search,
    fetchCampaignPage,
    fetchDocument,
    fetchProduct,
    fetchFolder,
    searchOrderBy,
    orderByPriceRange,
    getPriceRange,
    filterByPriceRange,
    searchByTopic,
};

async function fetchNavigation(apiClient: ClientInterface) {
    const fetch = createNavigationFetcher(apiClient).byFolders;
    const builder = catalogueFetcherGraphqlBuilder;
    const response = await fetch(
        '/shop',
        'en',
        3,
        {
            tenant: {
                __args: {
                    language: 'en',
                },
                name: true,
            },
        },
        (level) => {
            switch (level) {
                case 0:
                    return {};
                case 1:
                    return {
                        __on: [
                            builder.onItem({
                                ...builder.onComponent('description', 'RichText', {
                                    json: true,
                                }),
                            }),
                            builder.onFolder(),
                        ],
                    };
                case 2:
                    return {
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
                        ],
                    };
                default:
                    return {};
            }
        },
    );
    return response;
}

async function fetchTopicNavigation(apiClient: ClientInterface) {
    const fetch = createNavigationFetcher(apiClient).byTopics;
    const response = await fetch('/', 'en', 2);
    return response;
}

async function fetchProducts(apiClient: ClientInterface, path: string) {
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

async function search(apiClient: ClientInterface, value: string): Promise<any[]> {
    const data = await apiClient.searchApi(
        `query Search ($searchTerm: String!){
                        search(language:"en", filter: { 
                            searchTerm: $searchTerm, 
                            type: PRODUCT, 
                            productVariants: { isDefault: true }}){
                          edges {
                            node {
                              name
                              path
                              ... on Product {
                                matchingVariant {
                                  price
                                  images {
                                    url
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
}

async function fetchCampaignPage(apiClient: ClientInterface, path: string, version: any) {
    return (
        await apiClient.catalogueApi(
            `query ($language: String!, $path: String!, $version: VersionLabel) {
    catalogue(path: $path, language: $language, version: $version) {
      ... on Item {
        name
        path
        meta: component(id:"meta"){
          content {
            ...on ContentChunkContent {
              chunks {
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
                      type
                      ...on Product {
                        defaultVariant {
                          price
                          images {
                            variants {
                              url
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
                                ...on SingleLineContent{
                                    text
                                }
                                ...on SelectionContent {
                                    options {
                                        key
                                        value
                                    }
                                }
                                ...on BooleanContent {
                                    value
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
  }`,
            {
                language: 'en',
                path,
                version: version === 'draft' ? 'draft' : 'published',
            },
        )
    ).catalogue;
}

async function fetchDocument(apiClient: ClientInterface, path: string, version: string) {
    return (
        await apiClient.catalogueApi(
            `query ($language: String!, $path: String!, $version: VersionLabel) {
    catalogue(path: $path, language: $language, version: $version) {
      ... on Item {
        name
        createdAt
        path
        meta: component(id:"meta"){
          content {
            ...on ContentChunkContent {
              chunks {
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
            }
            ...on ImageContent {
              images {
                variants {
                  url
                  width
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
                language: 'en',
                path,
                version: version === 'draft' ? 'draft' : 'published',
            },
        )
    ).catalogue;
}

async function fetchProduct(apiClient: ClientInterface, path: string, version: string) {
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
                version: version === 'draft' ? 'draft' : 'published',
            },
        )
    ).catalogue;
}

async function fetchFolder(apiClient: ClientInterface, path: string, version: string) {
    return (
        await apiClient.catalogueApi(
            `query ($language: String!, $path: String!, $version: VersionLabel) {
    catalogue(language: $language, path: $path, version: $version) {
        name
        meta: component(id:"meta"){
          content {
            ...on ContentChunkContent {
              chunks {
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
                          }
                          item {
                            name
                            path
                            type
                            ...on Product {
                              defaultVariant {
                                price
                                images {
                                  variants {
                                    url
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
                  ... on ItemRelationsContent {
                    items {
                      name
                      components {
                        content {
                          ... on SingleLineContent {
                            text
                          }
                          ... on RichTextContent {
                            plainText
                          }
                          ... on ComponentChoiceContent {
                            selectedComponent {
                              content {
                                ... on ImageContent {
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
                  }
                }
              }
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
                version: version === 'draft' ? 'draft' : 'published',
            },
        )
    ).catalogue;
}

async function searchOrderBy(apiClient: ClientInterface, path: string, orderBy?: any, fitlers?: any) {
    const field = orderBy?.split('_')[0];
    const direction = orderBy?.split('_')[1];
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
          orderBy: { field: $field, direction: $direction }
          filter: {
            type: PRODUCT
            productVariants: { isDefault: true, priceRange: { min: $min, max: $max } }
            include: { paths: $path }
          }
        ) {
          edges {
            node {
              name
              path
              ... on Product {
                  matchingVariant {
                  price
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
}

async function orderByPriceRange(apiClient: ClientInterface, path: string, orderSearchParams: any) {
    return await apiClient.searchApi(
        `query SEARCH_ORDER_BY_PRICE_RANGE($path: [String!]) {
        search(
          filter: {
            type: PRODUCT
            include: { paths: $path }
            productVariants: { isDefault: true }
          }
        ) {
          edges {
            node {
              name
              path
              ... on Product {
                matchingVariant {
                  price
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
      }`,
        {
            path,
        },
    );
}

async function getPriceRange(apiClient: ClientInterface, path: string) {
    return await apiClient.searchApi(
        `query GET_PRICE_RANGE($path: [String!]) {
        search(
          filter: {
            type: PRODUCT
            include: { paths: $path }
          }
        ) {
          aggregations {
            price {
              min
              max
            }
          }
        }
      }
      `,
        {
            path,
        },
    );
}

async function filterByPriceRange(apiClient: ClientInterface, path: string, min: string, max: string) {
    return await apiClient.searchApi(
        `query SEARCH_ORDER_BY_PRICE_RANGE($path: [String!], $min: Float, $max: Float) {
        search(
          filter: {
            type: PRODUCT
            include: { paths: $path }
            productVariants: { isDefault: true, priceRange: { min: $min, max: $max } }
          }
        ) {
          edges {
            node {
              name
              path
              ... on Product {
                matchingVariant {
                  price
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
}

async function searchByTopic(apiClient: ClientInterface, value: string) {
    return await apiClient.searchApi(
        `query SEARCH_BY_TOPIC($value: String!) {
          search(
            filter: {
              type: PRODUCT
              include: {
                topicPaths: {
                  sections: [
                    { fields: { value: $value } }
                  ]
                }
              }
              productVariants: { isDefault: true }
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
                    price
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
}
