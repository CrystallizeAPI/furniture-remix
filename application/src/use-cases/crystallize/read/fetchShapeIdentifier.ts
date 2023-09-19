import { ClientInterface } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: String, language: string, version: String) => {
    return (
        await apiClient.catalogueApi(
            `#graphql
                query ($language: String!, $path: String!, $version: VersionLabel) {
                    catalogue(path: $path, language: $language, version: $version) {
                        shape {
                            identifier
                        }
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
