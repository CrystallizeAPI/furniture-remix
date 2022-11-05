import { ClientInterface, createNavigationFetcher } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string) => {
    const [folders, topics] = await Promise.all([
        createNavigationFetcher(apiClient).byFolders(path, language, 3),
        createNavigationFetcher(apiClient).byTopics(path, language, 2),
    ]);

    return {
        folders,
        topics,
    };
};
