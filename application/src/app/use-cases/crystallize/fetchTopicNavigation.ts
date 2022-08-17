import { ClientInterface, createNavigationFetcher } from '@crystallize/js-api-client';

export default async (apiClient: ClientInterface, path: string, language: string) => {
    const fetch = createNavigationFetcher(apiClient).byTopics;
    const response = await fetch(path, language, 2);
    return response;
};
