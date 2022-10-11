import { getHost, getLocale, isPreview } from '~/core-server/http-utils.server';
import { getStoreFront } from '~/core-server/storefront.server';
import { CrystallizeAPI } from '~/use-cases/crystallize';

import Story from './Story';
import CuratedStory from './CuratedStory';

export const fetchData = async (path: string, request: any, params: any): Promise<unknown> => {
    const { secret } = await getStoreFront(getHost(request));
    const api = CrystallizeAPI(secret.apiClient, getLocale(request), isPreview(request));
    const document = await api.fetchDocument(path);
    if (!document) {
        throw new Response('Story Mot Found', {
            status: 404,
            statusText: 'Story Not Found',
        });
    }
    return document;
};

export default ({ data: story }: { data: any }) => {
    if (story.shape.identifier === 'curated-product-story') {
        return <CuratedStory data={story} />;
    }
    if (story.shape.identifier === 'story') {
        return <Story data={story} />;
    }
    return <div> No renderer for type</div>;
};
