import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string) => {
    return (
        await apiClient.catalogueApi(
            `#graphql
                query ($language: String!, $path: String!) {
                    catalogue(path: $path, language: $language) {
                        component(id: "meta") {
                            content {
                                ... on ContentChunkContent {
                                    chunks {
                                        id
                                        content {
                                            ... on SingleLineContent {
                                                text
                                            }
                                            ... on RichTextContent {
                                                plainText
                                            }
                                            ... on ImageContent {
                                                firstImage {
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
            }`,
            {
                language,
                path,
            },
        )
    ).catalogue;
};
