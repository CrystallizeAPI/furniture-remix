import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, version: string, language: string) => {
    return (
        await apiClient.catalogueApi(
            `#graphql
            query ($language: String!, $path: String!, $version: VersionLabel) {
                catalogue(path: $path, language: $language, version: $version) {
                    name
                    components {
                        id
                        content {
                            ...on SingleLineContent {
                                text
                            }
                            ...on RichTextContent {
                                plainText
                                json
                                html
                            }
                            ...on ContentChunkContent {
                                chunks {
                                    id
                                    name
                                    type
                                    content {
                                    ...on ImageContent {
                                        images {
                                            altText
                                            url
                                            variants {
                                                url
                                                width
                                                height
                                            }
                                        }
                                    }
                                    ...on SingleLineContent {
                                        text
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
            },
        )
    ).catalogue;
};
