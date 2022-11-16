import { ClientInterface, createNavigationFetcher } from '@crystallize/js-api-client';

//@todo: this should be cached somehow
export default async (apiClient: ClientInterface, language: string) => {
    const fetchByFolders = createNavigationFetcher(apiClient).byFolders;
    const fetchByTopics = createNavigationFetcher(apiClient).byTopics;

    const [folders, topics] = await Promise.all([
        fetchByFolders('/', language, 10, {}, () => {
            return {
                shape: {
                    identifier: true,
                },
            };
        }),
        fetchByTopics('/', language, 10),
    ]);

    const map: Record<string, any> = {};
    const browse = (node: any) => {
        map[node.path] = node;
        if (node.children) {
            node.children.forEach(browse);
        }
    };
    browse(folders.tree);
    topics.tree.forEach(browse);
    return map;
};
